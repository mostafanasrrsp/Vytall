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
    public class HeartRateController : ControllerBase
    {
        private readonly VytallContext _context;

        public HeartRateController(VytallContext context)
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
        public async Task<ActionResult<IEnumerable<HeartRateDTO>>> GetPatientReadings(int patientId)
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

            var readings = await _context.HeartRates
                .Where(hr => hr.PatientId == patientId)
                .Include(hr => hr.Patient)
                .Select(hr => new HeartRateDTO
                {
                    HeartRateId = hr.HeartRateId,
                    PatientId = hr.PatientId,
                    PatientName = hr.Patient.FirstName + " " + hr.Patient.LastName,
                    ReadingDate = hr.ReadingDate,
                    Rate = hr.Rate,
                    ArmUsed = hr.ArmUsed,
                    Notes = hr.Notes,
                    IsAfterMeal = hr.IsAfterMeal,
                    LastMealTime = hr.LastMealTime,
                    MedicationsTaken = hr.MedicationsTaken,
                    IsAfterExercise = hr.IsAfterExercise,
                    ExerciseType = hr.ExerciseType,
                    ExerciseDuration = hr.ExerciseDuration,
                    IsResting = hr.IsResting,
                    IsSleeping = hr.IsSleeping
                })
                .OrderByDescending(hr => hr.ReadingDate)
                .ToListAsync();

            return Ok(readings);
        }

        // ✅ GET SINGLE READING
        [HttpGet("{id}")]
        [Authorize(Roles = "Patient, Physician, Admin")]
        public async Task<ActionResult<HeartRateDTO>> GetReadingById(int id)
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var physicianIdClaim = User.FindFirst("physicianId")?.Value;

            var reading = await _context.HeartRates
                .Include(hr => hr.Patient)
                .FirstOrDefaultAsync(hr => hr.HeartRateId == id);

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

            var dto = new HeartRateDTO
            {
                HeartRateId = reading.HeartRateId,
                PatientId = reading.PatientId,
                PatientName = reading.Patient.FirstName + " " + reading.Patient.LastName,
                ReadingDate = reading.ReadingDate,
                Rate = reading.Rate,
                ArmUsed = reading.ArmUsed,
                Notes = reading.Notes,
                IsAfterMeal = reading.IsAfterMeal,
                LastMealTime = reading.LastMealTime,
                MedicationsTaken = reading.MedicationsTaken,
                IsAfterExercise = reading.IsAfterExercise,
                ExerciseType = reading.ExerciseType,
                ExerciseDuration = reading.ExerciseDuration,
                IsResting = reading.IsResting,
                IsSleeping = reading.IsSleeping
            };

            return Ok(dto);
        }

        // ✅ CREATE READING
        [HttpPost]
        [Authorize(Roles = "Patient, Physician, Admin")]
        public async Task<ActionResult<HeartRate>> CreateReading([FromBody] CreateHeartRateDTO dto)
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

            var reading = new HeartRate
            {
                PatientId = dto.PatientId,
                ReadingDate = DateTime.UtcNow,
                Rate = dto.Rate,
                ArmUsed = dto.ArmUsed,
                Notes = dto.Notes,
                IsAfterMeal = dto.IsAfterMeal,
                LastMealTime = dto.LastMealTime,
                MedicationsTaken = dto.MedicationsTaken,
                IsAfterExercise = dto.IsAfterExercise,
                ExerciseType = dto.ExerciseType,
                ExerciseDuration = dto.ExerciseDuration,
                IsResting = dto.IsResting,
                IsSleeping = dto.IsSleeping
            };

            _context.HeartRates.Add(reading);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetReadingById), new { id = reading.HeartRateId }, reading);
        }

        // ✅ UPDATE READING
        [HttpPut("{id}")]
        [Authorize(Roles = "Patient, Physician, Admin")]
        public async Task<IActionResult> UpdateReading(int id, [FromBody] UpdateHeartRateDTO dto)
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var physicianIdClaim = User.FindFirst("physicianId")?.Value;

            var reading = await _context.HeartRates.FindAsync(id);
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

            reading.Rate = dto.Rate;
            reading.ArmUsed = dto.ArmUsed;
            reading.Notes = dto.Notes;
            reading.IsAfterMeal = dto.IsAfterMeal;
            reading.LastMealTime = dto.LastMealTime;
            reading.MedicationsTaken = dto.MedicationsTaken;
            reading.IsAfterExercise = dto.IsAfterExercise;
            reading.ExerciseType = dto.ExerciseType;
            reading.ExerciseDuration = dto.ExerciseDuration;
            reading.IsResting = dto.IsResting;
            reading.IsSleeping = dto.IsSleeping;

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

            var reading = await _context.HeartRates.FindAsync(id);
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

            _context.HeartRates.Remove(reading);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
} 