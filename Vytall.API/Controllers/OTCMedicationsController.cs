using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vytall.API.Data;
using Vytall.API.DTOs;
using Vytall.API.Models;
using System.Security.Claims;

namespace Vytall.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class OTCMedicationsController : ControllerBase
    {
        private readonly VytallContext _context;

        public OTCMedicationsController(VytallContext context)
        {
            _context = context;
        }

        private static string GetPatientName(Patient? patient)
        {
            if (patient == null) return string.Empty;
            return $"{patient.FirstName} {patient.LastName}";
        }

        // GET: api/OTCMedications/patient/{patientId}
        [HttpGet("patient/{patientId}")]
        public async Task<ActionResult<IEnumerable<OTCMedicationDTO>>> GetPatientOTCMedications(int patientId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            // Verify access rights
            if (userRole == "Patient" && userId != patientId.ToString())
            {
                return Forbid();
            }

            var medications = await _context.OTCMedications
                .Include(m => m.Patient)
                .Where(m => m.PatientId == patientId)
                .Select(m => new OTCMedicationDTO
                {
                    OTCMedicationId = m.OTCMedicationId,
                    PatientId = m.PatientId,
                    PatientName = GetPatientName(m.Patient),
                    MedicationName = m.MedicationName,
                    Dosage = m.Dosage,
                    Frequency = m.Frequency,
                    StartDate = m.StartDate.ToString("yyyy-MM-dd"),
                    EndDate = m.EndDate.HasValue ? m.EndDate.Value.ToString("yyyy-MM-dd") : null,
                    Reason = m.Reason,
                    Notes = m.Notes,
                    IsActive = m.IsActive
                })
                .ToListAsync();

            return Ok(medications);
        }

        // GET: api/OTCMedications/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<OTCMedicationDTO>> GetOTCMedication(int id)
        {
            var medication = await _context.OTCMedications
                .Include(m => m.Patient)
                .FirstOrDefaultAsync(m => m.OTCMedicationId == id);

            if (medication == null)
            {
                return NotFound();
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            // Verify access rights
            if (userRole == "Patient" && userId != medication.PatientId.ToString())
            {
                return Forbid();
            }

            var dto = new OTCMedicationDTO
            {
                OTCMedicationId = medication.OTCMedicationId,
                PatientId = medication.PatientId,
                PatientName = GetPatientName(medication.Patient),
                MedicationName = medication.MedicationName,
                Dosage = medication.Dosage,
                Frequency = medication.Frequency,
                StartDate = medication.StartDate.ToString("yyyy-MM-dd"),
                EndDate = medication.EndDate.HasValue ? medication.EndDate.Value.ToString("yyyy-MM-dd") : null,
                Reason = medication.Reason,
                Notes = medication.Notes,
                IsActive = medication.IsActive
            };

            return Ok(dto);
        }

        // POST: api/OTCMedications
        [HttpPost]
        public async Task<ActionResult<OTCMedicationDTO>> CreateOTCMedication(CreateOTCMedicationDTO dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            // Verify access rights
            if (userRole == "Patient" && userId != dto.PatientId.ToString())
            {
                return Forbid();
            }

            var medication = new OTCMedication
            {
                PatientId = dto.PatientId,
                MedicationName = dto.MedicationName,
                Dosage = dto.Dosage,
                Frequency = dto.Frequency,
                Reason = dto.Reason,
                Notes = dto.Notes,
                StartDate = DateTime.UtcNow,
                IsActive = true
            };

            _context.OTCMedications.Add(medication);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOTCMedication), new { id = medication.OTCMedicationId }, dto);
        }

        // PUT: api/OTCMedications/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOTCMedication(int id, UpdateOTCMedicationDTO dto)
        {
            var medication = await _context.OTCMedications.FindAsync(id);
            if (medication == null)
            {
                return NotFound();
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            // Verify access rights
            if (userRole == "Patient" && userId != medication.PatientId.ToString())
            {
                return Forbid();
            }

            medication.MedicationName = dto.MedicationName;
            medication.Dosage = dto.Dosage;
            medication.Frequency = dto.Frequency;
            medication.Reason = dto.Reason;
            medication.Notes = dto.Notes;
            medication.IsActive = dto.IsActive;
            medication.EndDate = dto.EndDate;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OTCMedicationExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/OTCMedications/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOTCMedication(int id)
        {
            var medication = await _context.OTCMedications.FindAsync(id);
            if (medication == null)
            {
                return NotFound();
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            // Verify access rights
            if (userRole == "Patient" && userId != medication.PatientId.ToString())
            {
                return Forbid();
            }

            _context.OTCMedications.Remove(medication);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OTCMedicationExists(int id)
        {
            return _context.OTCMedications.Any(e => e.OTCMedicationId == id);
        }
    }
} 