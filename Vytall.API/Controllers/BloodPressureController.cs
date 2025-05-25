using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vytall.API.Data;
using Vytall.API.Models;
using Vytall.API.DTOs.Trackers;
using System.Security.Claims;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Vytall.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Patient, Physician, Admin")] // 🚀 Restrict Controller Access
    public class BloodPressureController : ControllerBase
    {
        private readonly VytallContext _context;

        public BloodPressureController(VytallContext context)
        {
            _context = context;
        }

        // Helper: Check if physician is assigned to patient (via appointments)
        private bool IsPhysicianOfPatient(int physicianId, int patientId)
        {
            return _context.Appointments.Any(a => a.PhysicianId == physicianId && a.PatientId == patientId);
        }

        // ✅ GET ALL READINGS FOR A PATIENT
        [HttpGet("patient/{patientId}")]
        [Authorize(Roles = "Patient, Physician, Admin")]
        public async Task<ActionResult<IEnumerable<BloodPressureDTO>>> GetPatientReadings(int patientId)
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var physicianIdClaim = User.FindFirst("physicianId")?.Value;

            if (userRole == "Patient" && userId != patientId.ToString())
            {
                return Forbid();
            }
            if (userRole == "Physician")
            {
                if (!int.TryParse(physicianIdClaim, out int physicianId) || !IsPhysicianOfPatient(physicianId, patientId))
                    return Forbid();
            }

            var readings = await _context.BloodPressures
                .Where(bp => bp.PatientId == patientId)
                .Include(bp => bp.Patient)
                .Select(bp => new BloodPressureDTO
                {
                    BloodPressureId = bp.BloodPressureId,
                    PatientId = bp.PatientId,
                    PatientName = bp.Patient.FirstName + " " + bp.Patient.LastName,
                    ReadingDate = bp.ReadingDate,
                    Systolic = bp.Systolic,
                    Diastolic = bp.Diastolic,
                    HeartRate = bp.HeartRate,
                    ArmUsed = bp.ArmUsed,
                    Notes = bp.Notes,
                    IsAfterMeal = bp.IsAfterMeal,
                    IsAfterExercise = bp.IsAfterExercise,
                    IsAfterMedication = bp.IsAfterMedication,
                    MedicationTaken = bp.MedicationTaken
                })
                .OrderByDescending(bp => bp.ReadingDate)
                .ToListAsync();

            return Ok(readings);
        }

        // ✅ GET SINGLE READING
        [HttpGet("{id}")]
        [Authorize(Roles = "Patient, Physician, Admin")]
        public async Task<ActionResult<BloodPressureDTO>> GetReadingById(int id)
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var physicianIdClaim = User.FindFirst("physicianId")?.Value;

            var reading = await _context.BloodPressures
                .Include(bp => bp.Patient)
                .FirstOrDefaultAsync(bp => bp.BloodPressureId == id);

            if (reading == null) return NotFound();

            if (userRole == "Patient" && userId != reading.PatientId.ToString())
            {
                return Forbid();
            }
            if (userRole == "Physician")
            {
                if (!int.TryParse(physicianIdClaim, out int physicianId) || !IsPhysicianOfPatient(physicianId, reading.PatientId))
                    return Forbid();
            }

            var dto = new BloodPressureDTO
            {
                BloodPressureId = reading.BloodPressureId,
                PatientId = reading.PatientId,
                PatientName = reading.Patient.FirstName + " " + reading.Patient.LastName,
                ReadingDate = reading.ReadingDate,
                Systolic = reading.Systolic,
                Diastolic = reading.Diastolic,
                HeartRate = reading.HeartRate,
                ArmUsed = reading.ArmUsed,
                Notes = reading.Notes,
                IsAfterMeal = reading.IsAfterMeal,
                IsAfterExercise = reading.IsAfterExercise,
                IsAfterMedication = reading.IsAfterMedication,
                MedicationTaken = reading.MedicationTaken
            };

            return Ok(dto);
        }

        // ✅ CREATE READING
        [HttpPost]
        [Authorize(Roles = "Patient, Physician, Admin")]
        public async Task<ActionResult<BloodPressure>> CreateReading([FromBody] CreateBloodPressureDTO dto)
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var physicianIdClaim = User.FindFirst("physicianId")?.Value;

            if (userRole == "Patient" && userId != dto.PatientId.ToString())
            {
                return Forbid();
            }
            if (userRole == "Physician")
            {
                if (!int.TryParse(physicianIdClaim, out int physicianId) || !IsPhysicianOfPatient(physicianId, dto.PatientId))
                    return Forbid();
            }

            var reading = new BloodPressure
            {
                PatientId = dto.PatientId,
                ReadingDate = DateTime.UtcNow,
                Systolic = dto.Systolic,
                Diastolic = dto.Diastolic,
                HeartRate = dto.HeartRate,
                ArmUsed = dto.ArmUsed,
                Notes = dto.Notes,
                IsAfterMeal = dto.IsAfterMeal,
                IsAfterExercise = dto.IsAfterExercise,
                IsAfterMedication = dto.IsAfterMedication,
                MedicationTaken = dto.MedicationTaken
            };

            _context.BloodPressures.Add(reading);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetReadingById), new { id = reading.BloodPressureId }, reading);
        }

        // ✅ UPDATE READING
        [HttpPut("{id}")]
        [Authorize(Roles = "Patient, Physician, Admin")]
        public async Task<IActionResult> UpdateReading(int id, [FromBody] UpdateBloodPressureDTO dto)
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var physicianIdClaim = User.FindFirst("physicianId")?.Value;

            var reading = await _context.BloodPressures.FindAsync(id);
            if (reading == null) return NotFound();

            if (userRole == "Patient" && userId != reading.PatientId.ToString())
            {
                return Forbid();
            }
            if (userRole == "Physician")
            {
                if (!int.TryParse(physicianIdClaim, out int physicianId) || !IsPhysicianOfPatient(physicianId, reading.PatientId))
                    return Forbid();
            }

            reading.Systolic = dto.Systolic;
            reading.Diastolic = dto.Diastolic;
            reading.HeartRate = dto.HeartRate;
            reading.ArmUsed = dto.ArmUsed;
            reading.Notes = dto.Notes;
            reading.IsAfterMeal = dto.IsAfterMeal;
            reading.IsAfterExercise = dto.IsAfterExercise;
            reading.IsAfterMedication = dto.IsAfterMedication;
            reading.MedicationTaken = dto.MedicationTaken;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ❌ DELETE READING
        [HttpDelete("{id}")]
        [Authorize(Roles = "Patient, Physician, Admin")]
        public async Task<IActionResult> DeleteReading(int id)
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var physicianIdClaim = User.FindFirst("physicianId")?.Value;

            var reading = await _context.BloodPressures.FindAsync(id);
            if (reading == null) return NotFound();

            if (userRole == "Patient" && userId != reading.PatientId.ToString())
            {
                return Forbid();
            }
            if (userRole == "Physician")
            {
                if (!int.TryParse(physicianIdClaim, out int physicianId) || !IsPhysicianOfPatient(physicianId, reading.PatientId))
                    return Forbid();
            }

            _context.BloodPressures.Remove(reading);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
} 