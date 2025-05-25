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
    public class StressLevelController : ControllerBase
    {
        private readonly VytallContext _context;

        public StressLevelController(VytallContext context)
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
        public async Task<ActionResult<IEnumerable<StressLevelDTO>>> GetPatientReadings(int patientId)
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

            var readings = await _context.StressLevels
                .Where(sl => sl.PatientId == patientId)
                .Include(sl => sl.Patient)
                .Select(sl => new StressLevelDTO
                {
                    StressLevelId = sl.StressLevelId,
                    PatientId = sl.PatientId,
                    PatientName = sl.Patient.FirstName + " " + sl.Patient.LastName,
                    ReadingDate = sl.ReadingDate,
                    Level = sl.Level,
                    Notes = sl.Notes,
                    Trigger = sl.Trigger,
                    CopingMechanism = sl.CopingMechanism,
                    IsAfterExercise = sl.IsAfterExercise,
                    IsAfterMeditation = sl.IsAfterMeditation,
                    IsAfterSleep = sl.IsAfterSleep,
                    MedicationsTaken = sl.MedicationsTaken,
                    SleepHours = sl.SleepHours,
                    IsWorkDay = sl.IsWorkDay
                })
                .OrderByDescending(sl => sl.ReadingDate)
                .ToListAsync();

            return Ok(readings);
        }

        // ✅ GET SINGLE READING
        [HttpGet("{id}")]
        [Authorize(Roles = "Patient, Physician, Admin")]
        public async Task<ActionResult<StressLevelDTO>> GetReadingById(int id)
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var physicianIdClaim = User.FindFirst("physicianId")?.Value;

            var reading = await _context.StressLevels
                .Include(sl => sl.Patient)
                .FirstOrDefaultAsync(sl => sl.StressLevelId == id);

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

            var dto = new StressLevelDTO
            {
                StressLevelId = reading.StressLevelId,
                PatientId = reading.PatientId,
                PatientName = reading.Patient.FirstName + " " + reading.Patient.LastName,
                ReadingDate = reading.ReadingDate,
                Level = reading.Level,
                Notes = reading.Notes,
                Trigger = reading.Trigger,
                CopingMechanism = reading.CopingMechanism,
                IsAfterExercise = reading.IsAfterExercise,
                IsAfterMeditation = reading.IsAfterMeditation,
                IsAfterSleep = reading.IsAfterSleep,
                MedicationsTaken = reading.MedicationsTaken,
                SleepHours = reading.SleepHours,
                IsWorkDay = reading.IsWorkDay
            };

            return Ok(dto);
        }

        // ✅ CREATE READING
        [HttpPost]
        [Authorize(Roles = "Patient, Physician, Admin")]
        public async Task<ActionResult<StressLevel>> CreateReading([FromBody] CreateStressLevelDTO dto)
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

            var reading = new StressLevel
            {
                PatientId = dto.PatientId,
                ReadingDate = DateTime.UtcNow,
                Level = dto.Level,
                Notes = dto.Notes,
                Trigger = dto.Trigger,
                CopingMechanism = dto.CopingMechanism,
                IsAfterExercise = dto.IsAfterExercise,
                IsAfterMeditation = dto.IsAfterMeditation,
                IsAfterSleep = dto.IsAfterSleep,
                MedicationsTaken = dto.MedicationsTaken,
                SleepHours = dto.SleepHours,
                IsWorkDay = dto.IsWorkDay
            };

            _context.StressLevels.Add(reading);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetReadingById), new { id = reading.StressLevelId }, reading);
        }

        // ✅ UPDATE READING
        [HttpPut("{id}")]
        [Authorize(Roles = "Patient, Physician, Admin")]
        public async Task<IActionResult> UpdateReading(int id, [FromBody] UpdateStressLevelDTO dto)
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var physicianIdClaim = User.FindFirst("physicianId")?.Value;

            var reading = await _context.StressLevels.FindAsync(id);
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

            reading.Level = dto.Level;
            reading.Notes = dto.Notes;
            reading.Trigger = dto.Trigger;
            reading.CopingMechanism = dto.CopingMechanism;
            reading.IsAfterExercise = dto.IsAfterExercise;
            reading.IsAfterMeditation = dto.IsAfterMeditation;
            reading.IsAfterSleep = dto.IsAfterSleep;
            reading.MedicationsTaken = dto.MedicationsTaken;
            reading.SleepHours = dto.SleepHours;
            reading.IsWorkDay = dto.IsWorkDay;

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

            var reading = await _context.StressLevels.FindAsync(id);
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

            _context.StressLevels.Remove(reading);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
} 