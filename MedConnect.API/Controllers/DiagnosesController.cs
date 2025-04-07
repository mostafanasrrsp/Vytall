using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MedConnect.API.Data;
using MedConnect.API.Models;
using System.Security.Claims;

namespace MedConnect.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // ✅ Ensures all actions require authentication by default
    public class DiagnosesController : ControllerBase
    {
        private readonly MedConnectContext _context;

        public DiagnosesController(MedConnectContext context)
        {
            _context = context;
        }

        // ✅ Only Physicians can access all diagnoses
        [HttpGet]
        [Authorize(Roles = "Physician, Admin, Facility")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllDiagnoses()
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userFacilityId = User.FindFirst("facilityId")?.Value;

            var query = _context.Diagnoses
                .Include(d => d.Patient)
                .Include(d => d.Physician)
                .AsQueryable();

            // If user is a facility, only return diagnoses for patients at their facility
            if (userRole == "Facility" && !string.IsNullOrEmpty(userFacilityId))
            {
                query = query.Where(d => d.Patient.FacilityId.ToString() == userFacilityId);
            }

            var diagnoses = await query
                .Select(d => new
                {
                    DiagnosisId = d.DiagnosisId,
                    PatientId = d.PatientId,
                    PhysicianId = d.PhysicianId,
                    AppointmentId = d.AppointmentId,
                    Patient = d.Patient.FirstName + " " + d.Patient.LastName,
                    Physician = d.Physician.FirstName + " " + d.Physician.LastName,
                    Details = d.Details,
                    DiagnosedOn = d.DiagnosedOn
                })
                .ToListAsync();

            return Ok(diagnoses);
        }

        // ✅ Patients & Physicians can access individual diagnoses
        [HttpGet("{id}")]
        [Authorize(Roles = "Physician, Patient, Admin")]
        public async Task<ActionResult<object>> GetDiagnosis(int id)
        {
            var diagnosis = await _context.Diagnoses
                .Include(d => d.Patient)
                .Include(d => d.Physician)
                .Where(d => d.DiagnosisId == id)
                .Select(d => new
                {
                    DiagnosisId = d.DiagnosisId,
                    PatientId = d.PatientId,
                    PhysicianId = d.PhysicianId,
                    AppointmentId = d.AppointmentId,
                    Patient = d.Patient.FirstName + " " + d.Patient.LastName,
                    Physician = d.Physician.FirstName + " " + d.Physician.LastName,
                    Details = d.Details,
                    DiagnosedOn = d.DiagnosedOn
                })
                .FirstOrDefaultAsync();

            if (diagnosis == null) return NotFound();

            return Ok(diagnosis);
        }

        // ✅ Only Physicians can add a new diagnosis
        [HttpPost]
        [Authorize(Roles = "Physician, Admin")]
        public async Task<IActionResult> AddDiagnosis([FromBody] DiagnosisDTO dto)
        {
            var patient = await _context.Patients.FindAsync(dto.PatientId);
            if (patient == null) return NotFound("Patient not found.");

            var physician = await _context.Physicians.FindAsync(dto.PhysicianId);
            if (physician == null) return NotFound("Physician not found.");

            var diagnosis = new Diagnosis
            {
                PatientId = dto.PatientId,
                PhysicianId = dto.PhysicianId,
                AppointmentId = dto.AppointmentId,
                Details = dto.Details,
                DiagnosedOn = DateTime.UtcNow
            };

            _context.Diagnoses.Add(diagnosis);
            await _context.SaveChangesAsync();

            return Ok(diagnosis);
        }

        // ✅ Only Physicians can update a diagnosis
        [HttpPut("{id}")]
        [Authorize(Roles = "Physician, Admin")]
        public async Task<IActionResult> UpdateDiagnosis(int id, [FromBody] DiagnosisDTO dto)
        {
            var diagnosis = await _context.Diagnoses.FindAsync(id);
            if (diagnosis == null) return NotFound("Diagnosis not found.");

            diagnosis.Details = dto.Details;
            diagnosis.AppointmentId = dto.AppointmentId;
            diagnosis.PatientId = dto.PatientId;
            diagnosis.PhysicianId = dto.PhysicianId;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ✅ Only Admins can delete a diagnosis
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteDiagnosis(int id)
        {
            var diagnosis = await _context.Diagnoses.FindAsync(id);
            if (diagnosis == null) return NotFound();

            _context.Diagnoses.Remove(diagnosis);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}