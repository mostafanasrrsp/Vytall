using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MedConnect.API.Data;
using MedConnect.API.Models;
using System.Security.Claims;

using System.Text.Json;

namespace MedConnect.API.Controllers
{
    [ApiController]
    [Route("api/prescriptions")]
    [Authorize(Roles = "Patient, Admin, Facility, Physician")]
    public class PrescriptionsController : ControllerBase
    {
        private readonly MedConnectContext _context;

        public PrescriptionsController(MedConnectContext context)
        {
            _context = context;
        }

        // GET: api/prescriptions/all-prescriptions
        [HttpGet("all-prescriptions")]
        [Authorize(Roles = "Admin, Facility, Physician")]
        public async Task<ActionResult<IEnumerable<PrescriptionDTO>>> GetAllPrescriptions()
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userFacilityId = User.FindFirst("facilityId")?.Value;
            var physicianIdClaim = User.FindFirst("physicianId")?.Value;

            var query = _context.Prescriptions
                .Include(p => p.Patient)
                .Include(p => p.Physician)
                .AsQueryable();

            // Filter based on user role
            switch (userRole)
            {
                case "Facility":
                    query = query.Where(p => p.Patient.FacilityId.ToString() == userFacilityId);
                    break;
                case "Physician":
                    if (string.IsNullOrEmpty(physicianIdClaim))
                    {
                        return BadRequest("Physician ID not found in claims");
                    }
                    if (!int.TryParse(physicianIdClaim, out int physicianId))
                    {
                        return BadRequest($"Invalid physician ID format: {physicianIdClaim}");
                    }
                    query = query.Where(p => p.PhysicianId == physicianId);
                    break;
            }

            var prescriptions = await query
                .Select(p => new PrescriptionDTO
                {
                    PrescriptionId = p.PrescriptionId,
                    PatientId = p.PatientId,
                    PatientName = p.Patient != null 
                        ? $"{p.Patient.FirstName} {p.Patient.LastName}" 
                        : "Unknown",
                    PhysicianId = p.PhysicianId,
                    PhysicianName = p.Physician != null 
                        ? $"{p.Physician.FirstName} {p.Physician.LastName}" 
                        : "Unknown",
                    MedicationDetails = p.MedicationDetails,
                    Dosage = p.Dosage,
                    Frequency = p.Frequency,
                    IssuedDate = p.IssuedDate,
                    ExpirationDate = p.ExpirationDate,
                    IsDispensed = p.IsDispensed
                })
                .ToListAsync();

            return Ok(prescriptions);
        }

        // ✅ Get Prescription Reminders for a Patient
        [HttpGet("patients/{patientId}/reminders")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> GetPrescriptionReminders(int patientId)
        {
            var now = DateTime.UtcNow;
            var prescriptions = await _context.Prescriptions
                .Where(p => p.PatientId == patientId && p.ExpirationDate > now)
                .OrderBy(p => p.NextDoseTime)
                .Select(p => new
                {
                    PrescriptionId = p.PrescriptionId,
                    Medication = p.MedicationDetails,
                    Dosage = p.Dosage,
                    Frequency = p.Frequency,
                    NextDoseTime = p.NextDoseTime,
                    TotalDoses = p.TotalDoses,
                    DosesTaken = p.DosesTaken,
                    ExpirationDate = p.ExpirationDate,
                    IssuedDate = p.IssuedDate,
                    MissedDoses = p.MissedDoses,
                    LastTakenTime = p.LastTakenTime,
                    FrequencyIntervalHours = p.FrequencyIntervalHours,
                    CanTakeDose = p.CanTakeDose(now),
                    TimeUntilNextDose = p.NextDoseTime.HasValue 
                        ? (p.NextDoseTime.Value - now).TotalMinutes 
                        : 0
                })
                .ToListAsync();

            if (!prescriptions.Any())
                return NotFound("No active prescriptions found for this patient.");

            return Ok(prescriptions);
        }

        // ✅ Mark a Dose as Taken
        [HttpPost("patients/{patientId}/take-dose")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> MarkDoseAsTaken(int patientId, [FromBody] JsonElement requestBody)
        {
            if (!requestBody.TryGetProperty("prescriptionId", out JsonElement prescriptionIdElement))
            {
                return BadRequest("❌ Invalid request. `prescriptionId` is missing.");
            }

            int prescriptionId = prescriptionIdElement.GetInt32();
            var now = DateTime.UtcNow;

            var prescription = await _context.Prescriptions
                .Where(p => p.PatientId == patientId && p.PrescriptionId == prescriptionId)
                .FirstOrDefaultAsync();

            if (prescription == null)
                return NotFound("❌ Prescription not found.");

            if (!prescription.CanTakeDose(now))
                return BadRequest("❌ Cannot take dose at this time.");

            prescription.UpdateMissedDoses(now);
            prescription.DosesTaken += 1;
            prescription.CalculateNextDoseTime(now);

            await _context.SaveChangesAsync();
            return Ok(new { 
                message = "✅ Dose recorded successfully.",
                nextDoseTime = prescription.NextDoseTime,
                dosesTaken = prescription.DosesTaken,
                missedDoses = prescription.MissedDoses
            });
        }

        // Reset all doses for testing
        [HttpPost("reset")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ResetAllDoses()
        {
            try
            {
                var prescriptions = await _context.Prescriptions.ToListAsync();
                Console.WriteLine($"Found {prescriptions.Count} prescriptions to reset");
                
                foreach (var prescription in prescriptions)
                {
                    prescription.DosesTaken = 0;
                    prescription.MissedDoses = 0;
                    prescription.LastTakenTime = null;
                    prescription.FirstDoseTime = null;
                    prescription.NextDoseTime = null;
                    Console.WriteLine($"Reset prescription {prescription.PrescriptionId}");
                }
                
                await _context.SaveChangesAsync();
                Console.WriteLine("Successfully saved all changes");
                
                return Ok(new { 
                    message = "All doses have been reset.",
                    count = prescriptions.Count
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error resetting doses: {ex.Message}");
                return StatusCode(500, new { error = "Failed to reset doses", message = ex.Message });
            }
        }
    }
}