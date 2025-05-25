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
using System;

namespace Vytall.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Patient, Physician, Admin")]
    public class WeightController : ControllerBase
    {
        private readonly VytallContext _context;

        public WeightController(VytallContext context)
        {
            _context = context;
        }

        // Helper: Check if physician is assigned to patient (via appointments)
        private bool IsPhysicianOfPatient(int physicianId, int patientId)
        {
            return _context.Appointments.Any(a => a.PhysicianId == physicianId && a.PatientId == patientId);
        }

        // GET ALL READINGS FOR A PATIENT
        [HttpGet("patient/{patientId}")]
        [Authorize(Roles = "Patient, Physician, Admin")]
        public async Task<ActionResult<IEnumerable<WeightDTO>>> GetPatientReadings(int patientId)
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

            var readings = await _context.Weights
                .Where(w => w.PatientId == patientId)
                .Include(w => w.Patient)
                .Select(w => new WeightDTO
                {
                    WeightId = w.WeightId,
                    PatientId = w.PatientId,
                    PatientName = w.Patient.FirstName + " " + w.Patient.LastName,
                    Value = w.Value,
                    Unit = w.Unit,
                    ReadingDate = w.ReadingDate,
                    Notes = w.Notes
                })
                .OrderByDescending(w => w.ReadingDate)
                .ToListAsync();

            return Ok(readings);
        }

        // GET SINGLE READING
        [HttpGet("{id}")]
        [Authorize(Roles = "Patient, Physician, Admin")]
        public async Task<ActionResult<WeightDTO>> GetReadingById(int id)
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var physicianIdClaim = User.FindFirst("physicianId")?.Value;

            var reading = await _context.Weights
                .Include(w => w.Patient)
                .FirstOrDefaultAsync(w => w.WeightId == id);

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

            var dto = new WeightDTO
            {
                WeightId = reading.WeightId,
                PatientId = reading.PatientId,
                PatientName = reading.Patient.FirstName + " " + reading.Patient.LastName,
                Value = reading.Value,
                Unit = reading.Unit,
                ReadingDate = reading.ReadingDate,
                Notes = reading.Notes
            };

            return Ok(dto);
        }

        // CREATE READING
        [HttpPost]
        [Authorize(Roles = "Patient, Physician, Admin")]
        public async Task<ActionResult<Weight>> CreateReading([FromBody] CreateWeightDTO dto)
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

            var reading = new Weight
            {
                PatientId = dto.PatientId,
                Value = dto.Value,
                Unit = dto.Unit,
                ReadingDate = DateTime.UtcNow,
                Notes = dto.Notes
            };

            _context.Weights.Add(reading);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetReadingById), new { id = reading.WeightId }, reading);
        }

        // UPDATE READING
        [HttpPut("{id}")]
        [Authorize(Roles = "Patient, Physician, Admin")]
        public async Task<IActionResult> UpdateReading(int id, [FromBody] UpdateWeightDTO dto)
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var physicianIdClaim = User.FindFirst("physicianId")?.Value;

            var reading = await _context.Weights.FindAsync(id);
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

            reading.Value = dto.Value;
            reading.Unit = dto.Unit;
            reading.Notes = dto.Notes;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE READING
        [HttpDelete("{id}")]
        [Authorize(Roles = "Patient, Physician, Admin")]
        public async Task<IActionResult> DeleteReading(int id)
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var physicianIdClaim = User.FindFirst("physicianId")?.Value;

            var reading = await _context.Weights.FindAsync(id);
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

            _context.Weights.Remove(reading);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
} 