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
    public class PeriodTrackerController : ControllerBase
    {
        private readonly VytallContext _context;

        public PeriodTrackerController(VytallContext context)
        {
            _context = context;
        }

        // Helper: Check if physician is assigned to patient (via appointments)
        private bool IsPhysicianOfPatient(int physicianId, int patientId)
        {
            return _context.Appointments.Any(a => a.PhysicianId == physicianId && a.PatientId == patientId);
        }

        // ✅ GET ALL PERIODS FOR A PATIENT
        [HttpGet("patient/{patientId}")]
        [Authorize(Roles = "Patient, Physician, Admin")]
        public async Task<ActionResult<IEnumerable<PeriodTrackerDTO>>> GetPatientPeriods(int patientId)
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

            var periods = await _context.PeriodTrackers
                .Where(pt => pt.PatientId == patientId)
                .Include(pt => pt.Patient)
                .Select(pt => new PeriodTrackerDTO
                {
                    PeriodTrackerId = pt.PeriodTrackerId,
                    PatientId = pt.PatientId,
                    PatientName = pt.Patient.FirstName + " " + pt.Patient.LastName,
                    StartDate = pt.StartDate,
                    EndDate = pt.EndDate,
                    Notes = pt.Notes,
                    FlowIntensity = pt.FlowIntensity,
                    Symptoms = pt.Symptoms,
                    IsUsingContraception = pt.IsUsingContraception,
                    ContraceptionType = pt.ContraceptionType,
                    IsPregnant = pt.IsPregnant,
                    IsBreastfeeding = pt.IsBreastfeeding,
                    MedicationsTaken = pt.MedicationsTaken,
                    CycleLength = pt.CycleLength,
                    PeriodLength = pt.PeriodLength
                })
                .OrderByDescending(pt => pt.StartDate)
                .ToListAsync();

            return Ok(periods);
        }

        // ✅ GET SINGLE PERIOD
        [HttpGet("{id}")]
        [Authorize(Roles = "Patient, Physician, Admin")]
        public async Task<ActionResult<PeriodTrackerDTO>> GetPeriodById(int id)
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var physicianIdClaim = User.FindFirst("physicianId")?.Value;

            var period = await _context.PeriodTrackers
                .Include(pt => pt.Patient)
                .FirstOrDefaultAsync(pt => pt.PeriodTrackerId == id);

            if (period == null) return NotFound();

            if (userRole == "Patient" && userId != period.PatientId.ToString())
            {
                return Forbid();
            }
            if (userRole == "Physician")
            {
                if (!int.TryParse(physicianIdClaim, out int physicianId) || !IsPhysicianOfPatient(physicianId, period.PatientId))
                    return Forbid();
            }

            var dto = new PeriodTrackerDTO
            {
                PeriodTrackerId = period.PeriodTrackerId,
                PatientId = period.PatientId,
                PatientName = period.Patient.FirstName + " " + period.Patient.LastName,
                StartDate = period.StartDate,
                EndDate = period.EndDate,
                Notes = period.Notes,
                FlowIntensity = period.FlowIntensity,
                Symptoms = period.Symptoms,
                IsUsingContraception = period.IsUsingContraception,
                ContraceptionType = period.ContraceptionType,
                IsPregnant = period.IsPregnant,
                IsBreastfeeding = period.IsBreastfeeding,
                MedicationsTaken = period.MedicationsTaken,
                CycleLength = period.CycleLength,
                PeriodLength = period.PeriodLength
            };

            return Ok(dto);
        }

        // ✅ CREATE PERIOD
        [HttpPost]
        [Authorize(Roles = "Patient, Physician, Admin")]
        public async Task<ActionResult<PeriodTracker>> CreatePeriod([FromBody] CreatePeriodTrackerDTO dto)
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

            var period = new PeriodTracker
            {
                PatientId = dto.PatientId,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Notes = dto.Notes,
                FlowIntensity = dto.FlowIntensity,
                Symptoms = dto.Symptoms,
                IsUsingContraception = dto.IsUsingContraception,
                ContraceptionType = dto.ContraceptionType,
                IsPregnant = dto.IsPregnant,
                IsBreastfeeding = dto.IsBreastfeeding,
                MedicationsTaken = dto.MedicationsTaken,
                CycleLength = dto.CycleLength,
                PeriodLength = dto.PeriodLength
            };

            _context.PeriodTrackers.Add(period);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPeriodById), new { id = period.PeriodTrackerId }, period);
        }

        // ✅ UPDATE PERIOD
        [HttpPut("{id}")]
        [Authorize(Roles = "Patient, Physician, Admin")]
        public async Task<IActionResult> UpdatePeriod(int id, [FromBody] UpdatePeriodTrackerDTO dto)
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var physicianIdClaim = User.FindFirst("physicianId")?.Value;

            var period = await _context.PeriodTrackers.FindAsync(id);
            if (period == null) return NotFound();

            if (userRole == "Patient" && userId != period.PatientId.ToString())
            {
                return Forbid();
            }
            if (userRole == "Physician")
            {
                if (!int.TryParse(physicianIdClaim, out int physicianId) || !IsPhysicianOfPatient(physicianId, period.PatientId))
                    return Forbid();
            }

            period.EndDate = dto.EndDate;
            period.Notes = dto.Notes;
            period.FlowIntensity = dto.FlowIntensity;
            period.Symptoms = dto.Symptoms;
            period.IsUsingContraception = dto.IsUsingContraception;
            period.ContraceptionType = dto.ContraceptionType;
            period.IsPregnant = dto.IsPregnant;
            period.IsBreastfeeding = dto.IsBreastfeeding;
            period.MedicationsTaken = dto.MedicationsTaken;
            period.CycleLength = dto.CycleLength;
            period.PeriodLength = dto.PeriodLength;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ❌ DELETE PERIOD
        [HttpDelete("{id}")]
        [Authorize(Roles = "Patient, Physician, Admin")]
        public async Task<IActionResult> DeletePeriod(int id)
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var physicianIdClaim = User.FindFirst("physicianId")?.Value;

            var period = await _context.PeriodTrackers.FindAsync(id);
            if (period == null) return NotFound();

            if (userRole == "Patient" && userId != period.PatientId.ToString())
            {
                return Forbid();
            }
            if (userRole == "Physician")
            {
                if (!int.TryParse(physicianIdClaim, out int physicianId) || !IsPhysicianOfPatient(physicianId, period.PatientId))
                    return Forbid();
            }

            _context.PeriodTrackers.Remove(period);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
} 