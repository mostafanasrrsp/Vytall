using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MedConnect.API.Data;
using MedConnect.API.Models;
using MedConnect.API.DTOs;
using System.Text.Json;
using System.Security.Claims;

namespace MedConnect.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin, Physician, Pharmacist, Patient, Facility")]

    public class PhysiciansController : ControllerBase
    {
        private readonly MedConnectContext _context;

        public PhysiciansController(MedConnectContext context)
        {
            _context = context;
        }

        // ✅ GET ALL PHYSICIANS 
        [HttpGet]
        [Authorize(Roles = "Admin, Physician, Patient, Facility")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllPhysicians()
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userFacilityId = User.FindFirst("facilityId")?.Value;

            var query = _context.Physicians.AsQueryable();

            // If user is a facility, only return physicians at their facility
            if (userRole == "Facility" && !string.IsNullOrEmpty(userFacilityId))
            {
                if (!int.TryParse(userFacilityId, out int facilityId))
                {
                    return BadRequest("Invalid facility ID format");
                }
                query = query.Where(p => p.FacilityId == facilityId);
            }

            var physicians = await query
                .Select(p => new PhysicianDTO
                {
                    Id = p.PhysicianId,
                    Name = p.FirstName + " " + p.LastName,
                    Specialty = p.Specialization,
                    Contact = $"{p.Email} | {p.Phone}",
                    FacilityId = p.FacilityId
                })
                .ToListAsync();

            return Ok(physicians);
        }

        // ✅ GET SINGLE PHYSICIAN (Admins Only)
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<PhysicianDTO>> GetPhysicianById(int id)
        {
            var physician = await _context.Physicians
                .Where(p => p.PhysicianId == id)
                .Select(p => new PhysicianDTO
                {
                    Name = p.FirstName + " " + p.LastName,
                    Specialty = p.Specialization,
                    Contact = $"{p.Email} | {p.Phone}"
                })
                .FirstOrDefaultAsync();

            if (physician == null) return NotFound();

            return Ok(physician);
        }

        // ✅ GET PRESCRIPTIONS BY PHYSICIAN (Physician can only fetch their own prescriptions)
        [HttpGet("{id}/prescriptions")]
        [Authorize(Roles = "Physician, Admin")]
        public async Task<ActionResult<IEnumerable<object>>> GetPrescriptionsByPhysician(int id)
        {
            var physician = await _context.Physicians.FindAsync(id);
            if (physician == null) return NotFound("Physician not found.");

            var prescriptions = await _context.Prescriptions
                .Where(p => p.PhysicianId == id)
                .Include(p => p.Patient)
                .Select(p => new
                {
                    PrescriptionId = p.PrescriptionId,
                    PatientId = p.PatientId,
                    PhysicianId = p.PhysicianId,
                    PatientName = p.Patient.FirstName + " " + p.Patient.LastName,
                    MedicationDetails = p.MedicationDetails,
                    Dosage = p.Dosage,
                    Frequency = p.Frequency,
                    IssuedDate = p.IssuedDate.ToString("yyyy-MM-dd"),
                    ExpirationDate = p.ExpirationDate.ToString("yyyy-MM-dd")
                })
                .ToListAsync();

            return Ok(prescriptions);
        }

        // ✅ GET UNDISPENSED PRESCRIPTIONS (Pharmacists & Admins Only)
        [HttpGet("undispensed-prescriptions")]
        [Authorize(Roles = "Pharmacist, Admin")]
        public async Task<ActionResult<IEnumerable<object>>> GetUndispensedPrescriptions()
        {
            var prescriptions = await _context.Prescriptions
                .Where(p => !p.IsDispensed)
                .Include(p => p.Patient)
                .Select(p => new
                {
                    PrescriptionId = p.PrescriptionId,
                    PatientId = p.PatientId,
                    PatientName = p.Patient.FirstName + " " + p.Patient.LastName,
                    MedicationDetails = p.MedicationDetails,
                    Dosage = p.Dosage,
                    Frequency = p.Frequency,
                    IssuedDate = p.IssuedDate.ToString("yyyy-MM-dd"),
                    ExpirationDate = p.ExpirationDate.ToString("yyyy-MM-dd")
                })
                .ToListAsync();

            return Ok(prescriptions);
        }

        // ✅ CREATE PRESCRIPTION (Physicians & Admins Only)
        [HttpPost("{id}/prescribe")]
        [Authorize(Roles = "Physician, Admin")]
        public async Task<IActionResult> PrescribeMedication(int id, [FromBody] PrescriptionDTO prescriptionDto)
        {
            var physician = await _context.Physicians.FindAsync(id);
            if (physician == null) return NotFound("Physician not found.");

            var patient = await _context.Patients.FindAsync(prescriptionDto.PatientId);
            if (patient == null) return NotFound("Patient not found.");

            var prescription = new Prescription
            {
                PatientId = prescriptionDto.PatientId,
                PhysicianId = id,
                MedicationDetails = prescriptionDto.MedicationDetails,
                Dosage = prescriptionDto.Dosage,
                Frequency = prescriptionDto.Frequency,
                IssuedDate = DateTime.UtcNow,
                ExpirationDate = prescriptionDto.ExpirationDate
            };

            _context.Prescriptions.Add(prescription);
            await _context.SaveChangesAsync();

            return Ok(prescription);
        }

        // ✅ UPDATE PRESCRIPTION (Physicians & Admins Only)
        [HttpPut("prescriptions/{id}")]
        [Authorize(Roles = "Physician, Admin")]
        public async Task<IActionResult> UpdatePrescription(int id, [FromBody] PrescriptionDTO dto)
        {
            var prescription = await _context.Prescriptions.FindAsync(id);
            if (prescription == null) return NotFound("Prescription not found.");

            prescription.PatientId = dto.PatientId;
            prescription.MedicationDetails = dto.MedicationDetails;
            prescription.Dosage = dto.Dosage;
            prescription.Frequency = dto.Frequency;
            prescription.ExpirationDate = dto.ExpirationDate;
            prescription.PhysicianId = dto.PhysicianId;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ✅ DELETE PRESCRIPTION (Admins Only)
        [HttpDelete("prescriptions/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeletePrescription(int id)
        {
            var prescription = await _context.Prescriptions.FindAsync(id);
            if (prescription == null) return NotFound("Prescription not found.");

            _context.Prescriptions.Remove(prescription);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ✅ CREATE PHYSICIAN (Admins Only)
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Physician>> CreatePhysician([FromBody] CreatePhysicianDTO dto)
        {
            var physician = new Physician
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Specialization = dto.Specialization,
                Email = dto.Email,
                Phone = dto.Phone
            };

            _context.Physicians.Add(physician);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPhysicianById), new { id = physician.PhysicianId }, physician);
        }

        // ✅ UPDATE PHYSICIAN (Admins Only)
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdatePhysician(int id, [FromBody] UpdatePhysicianDTO dto)
        {
            var physician = await _context.Physicians.FindAsync(id);
            if (physician == null) return NotFound("Physician not found.");

            physician.FirstName = dto.FirstName;
            physician.LastName = dto.LastName;
            physician.Specialization = dto.Specialization;
            physician.Email = dto.Email;
            physician.Phone = dto.Phone;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ✅ DELETE PHYSICIAN (Admins Only)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeletePhysician(int id)
        {
            var physician = await _context.Physicians.FindAsync(id);
            if (physician == null) return NotFound();

            _context.Physicians.Remove(physician);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

 
}

