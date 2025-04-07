using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MedConnect.API.Data;
using MedConnect.API.Models;
using MedConnect.API.DTOs;
using System.Security.Claims;

namespace MedConnect.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Physician, Admin, Facility")] // 🚀 Restrict Controller Access
    public class PatientsController : ControllerBase
    {
        private readonly MedConnectContext _context;

        public PatientsController(MedConnectContext context)
        {
            _context = context;
        }

        // ✅ GET ALL PATIENTS (Admins, Physicians, and Facilities)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PatientDTO>>> GetAllPatients()
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userFacilityId = User.FindFirst("facilityId")?.Value;

            var query = _context.Patients.AsQueryable();

            // If user is a facility, only return patients at their facility
            if (userRole == "Facility")
            {
                query = query.Where(p => p.FacilityId.ToString() == userFacilityId);
            }

            var patients = await query
                .Select(p => new PatientDTO
                {
                    Id = p.PatientId,
                    Name = p.FirstName + " " + p.LastName,
                    Contact = $"{p.Email} | {p.Phone}",
                    DateOfBirth = p.DateOfBirth.ToString("yyyy-MM-dd"),
                    MedicalHistory = p.MedicalHistory
                })
                .ToListAsync();

            return Ok(patients);
        }

        // ✅ GET SINGLE PATIENT (Admins & Physicians)
        [HttpGet("{id}")]
        public async Task<ActionResult<PatientDTO>> GetPatientById(int id)
        {
            var p = await _context.Patients.FindAsync(id);
            if (p == null) return NotFound();

            var dto = new PatientDTO
            {
                Id = p.PatientId,
                Name = p.FirstName + " " + p.LastName,
                Contact = $"{p.Email} | {p.Phone}",
                DateOfBirth = p.DateOfBirth.ToString("yyyy-MM-dd"),
                MedicalHistory = p.MedicalHistory
            };

            return Ok(dto);
        }

        // ✅ CREATE PATIENT (Admins Only)
        [HttpPost]
        [Authorize(Roles = "Admin")] // 🚀 Only Admins can create
        public async Task<ActionResult<Patient>> CreatePatient([FromBody] CreatePatientDTO dto)
        {
            var patient = new Patient
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Phone = dto.Phone,
                DateOfBirth = dto.DateOfBirth,
                MedicalHistory = dto.MedicalHistory
            };

            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPatientById), new { id = patient.PatientId }, patient);
        }
        //Prescription Reminders
        [HttpGet("patient/{patientId}/reminders")]
        [Authorize(Roles = "Patient")]
        public async Task<ActionResult<IEnumerable<object>>> GetPrescriptionReminders(int patientId)
        {
            var now = DateTime.UtcNow;

            var prescriptions = await _context.Prescriptions
                .Where(p => p.PatientId == patientId && p.ExpirationDate > now)
                .Select(p => new
                {
                    p.PrescriptionId,
                    p.MedicationDetails,
                    p.TotalDoses,
                    p.DosesTaken,
                    p.NextDoseTime,
                    p.FrequencyIntervalHours
                })
                .ToListAsync();

            return Ok(prescriptions);
        }

        // ✅ UPDATE PATIENT (Admins Only)
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")] // 🚀 Only Admins can update
        public async Task<IActionResult> UpdatePatient(int id, [FromBody] UpdatePatientDTO dto)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null) return NotFound();

            // Update fields
            patient.FirstName = dto.FirstName;
            patient.LastName = dto.LastName;
            patient.Email = dto.Email;
            patient.Phone = dto.Phone;
            patient.DateOfBirth = dto.DateOfBirth;
            patient.MedicalHistory = dto.MedicalHistory;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ❌ DELETE PATIENT (Admins Only)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")] // 🚀 Only Admins can delete
        public async Task<IActionResult> DeletePatient(int id)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null) return NotFound();

            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}