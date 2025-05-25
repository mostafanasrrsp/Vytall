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
    public class BloodGlucoseController : ControllerBase
    {
        private readonly VytallContext _context;

        public BloodGlucoseController(VytallContext context)
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
        public async Task<ActionResult<IEnumerable<BloodGlucoseDTO>>> GetPatientReadings(int patientId)
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

            var readings = await _context.BloodGlucoses
                .Where(bg => bg.PatientId == patientId)
                .Include(bg => bg.Patient)
                .Select(bg => new BloodGlucoseDTO
                {
                    BloodGlucoseId = bg.BloodGlucoseId,
                    PatientId = bg.PatientId,
                    PatientName = bg.Patient.FirstName + " " + bg.Patient.LastName,
                    ReadingDate = bg.ReadingDate,
                    GlucoseLevel = bg.GlucoseLevel,
                    Type = bg.Type,
                    Notes = bg.Notes,
                    IsBeforeMeal = bg.IsBeforeMeal,
                    IsAfterMeal = bg.IsAfterMeal,
                    LastMealTime = bg.LastMealTime,
                    MedicationsTaken = bg.MedicationsTaken,
                    IsAfterExercise = bg.IsAfterExercise,
                    ExerciseType = bg.ExerciseType,
                    ExerciseDuration = bg.ExerciseDuration
                })
                .OrderByDescending(bg => bg.ReadingDate)
                .ToListAsync();

            return Ok(readings);
        }

        // ✅ GET SINGLE READING
        [HttpGet("{id}")]
        [Authorize(Roles = "Patient, Physician, Admin")]
        public async Task<ActionResult<BloodGlucoseDTO>> GetReadingById(int id)
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var physicianIdClaim = User.FindFirst("physicianId")?.Value;

            var reading = await _context.BloodGlucoses
                .Include(bg => bg.Patient)
                .FirstOrDefaultAsync(bg => bg.BloodGlucoseId == id);

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

            var dto = new BloodGlucoseDTO
            {
                BloodGlucoseId = reading.BloodGlucoseId,
                PatientId = reading.PatientId,
                PatientName = reading.Patient.FirstName + " " + reading.Patient.LastName,
                ReadingDate = reading.ReadingDate,
                GlucoseLevel = reading.GlucoseLevel,
                Type = reading.Type,
                Notes = reading.Notes,
                IsBeforeMeal = reading.IsBeforeMeal,
                IsAfterMeal = reading.IsAfterMeal,
                LastMealTime = reading.LastMealTime,
                MedicationsTaken = reading.MedicationsTaken,
                IsAfterExercise = reading.IsAfterExercise,
                ExerciseType = reading.ExerciseType,
                ExerciseDuration = reading.ExerciseDuration
            };

            return Ok(dto);
        }

        // ✅ CREATE READING
        [HttpPost]
        [Authorize(Roles = "Patient, Physician, Admin")]
        public async Task<ActionResult<BloodGlucose>> CreateReading([FromBody] CreateBloodGlucoseDTO dto)
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

            var reading = new BloodGlucose
            {
                PatientId = dto.PatientId,
                ReadingDate = DateTime.UtcNow,
                GlucoseLevel = dto.GlucoseLevel,
                Type = dto.Type,
                Notes = dto.Notes,
                IsBeforeMeal = dto.IsBeforeMeal,
                IsAfterMeal = dto.IsAfterMeal,
                LastMealTime = dto.LastMealTime,
                MedicationsTaken = dto.MedicationsTaken,
                IsAfterExercise = dto.IsAfterExercise,
                ExerciseType = dto.ExerciseType,
                ExerciseDuration = dto.ExerciseDuration
            };

            _context.BloodGlucoses.Add(reading);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetReadingById), new { id = reading.BloodGlucoseId }, reading);
        }

        // ✅ UPDATE READING
        [HttpPut("{id}")]
        [Authorize(Roles = "Patient, Physician, Admin")]
        public async Task<IActionResult> UpdateReading(int id, [FromBody] UpdateBloodGlucoseDTO dto)
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var physicianIdClaim = User.FindFirst("physicianId")?.Value;

            var reading = await _context.BloodGlucoses.FindAsync(id);
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

            reading.GlucoseLevel = dto.GlucoseLevel;
            reading.Type = dto.Type;
            reading.Notes = dto.Notes;
            reading.IsBeforeMeal = dto.IsBeforeMeal;
            reading.IsAfterMeal = dto.IsAfterMeal;
            reading.LastMealTime = dto.LastMealTime;
            reading.MedicationsTaken = dto.MedicationsTaken;
            reading.IsAfterExercise = dto.IsAfterExercise;
            reading.ExerciseType = dto.ExerciseType;
            reading.ExerciseDuration = dto.ExerciseDuration;

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

            var reading = await _context.BloodGlucoses.FindAsync(id);
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

            _context.BloodGlucoses.Remove(reading);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
} 