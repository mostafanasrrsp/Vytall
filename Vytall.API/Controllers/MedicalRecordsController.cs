using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vytall.API.Data;
using Vytall.API.Models;
using Vytall.API.DTOs;
using System.Security.Claims;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Vytall.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin, Physician, Patient, Facility")]
    public class MedicalRecordsController : ControllerBase
    {
        private readonly VytallContext _context;

        public MedicalRecordsController(VytallContext context)
        {
            _context = context;
        }

        private MedicalRecordDTO MapToDTO(MedicalRecord record)
        {
            return new MedicalRecordDTO
            {
                MedicalRecordId = record.MedicalRecordId,
                PatientId = record.PatientId,
                RecordType = record.RecordType,
                Details = record.Details,
                ImageUrl = record.ImageUrl,
                CreatedOn = record.CreatedOn,
                RecordDate = record.RecordDate,
                PhysicianId = record.PhysicianId,
                // If a Physician is attached via navigation, build the name; otherwise, use stored name.
                PhysicianName = record.Physician != null
                    ? "Dr. " + record.Physician.FirstName + " " + record.Physician.LastName
                    : record.PhysicianName
            };
        }

        private MedicalRecord MapToEntity(MedicalRecordDTO dto)
        {
            return new MedicalRecord
            {
                MedicalRecordId = dto.MedicalRecordId,
                PatientId = dto.PatientId,
                RecordType = dto.RecordType,
                Details = dto.Details,
                ImageUrl = dto.ImageUrl,
                CreatedOn = dto.CreatedOn,
                RecordDate = dto.RecordDate,
                PhysicianId = dto.PhysicianId,
                PhysicianName = dto.PhysicianName
            };
        }

        // GET ALL (Admins, Physicians, and Facilities)
        [HttpGet]
        [Authorize(Roles = "Admin, Physician, Facility")]
        public async Task<ActionResult<IEnumerable<MedicalRecordDTO>>> GetAllRecords()
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userFacilityId = User.FindFirst("facilityId")?.Value;

            var query = _context.MedicalRecords
                .Include(r => r.Patient)
                .Include(r => r.Physician)
                .AsQueryable();

            // If user is a facility, only return records for patients at that facility
            if (userRole == "Facility")
            {
                query = query.Where(r => r.Patient.FacilityId.ToString() == userFacilityId);
            }

            var records = await query
                .Select(r => new MedicalRecordDTO
                {
                    MedicalRecordId = r.MedicalRecordId,
                    PatientId = r.PatientId,
                    RecordType = r.RecordType,
                    Details = r.Details,
                    CreatedOn = r.CreatedOn,
                    RecordDate = r.RecordDate,
                    PhysicianId = r.PhysicianId,
                    PhysicianName = r.Physician != null
                        ? "Dr. " + r.Physician.FirstName + " " + r.Physician.LastName
                        : r.PhysicianName
                })
                .ToListAsync();

            return Ok(records);
        }

        // GET RECORD BY Patient ID (Physicians, Admins, Facilities can view, Patients can view their own)
        [HttpGet("patient/{patientId}")]
        [Authorize(Roles = "Admin, Patient, Facility")]
        public async Task<ActionResult<IEnumerable<MedicalRecordDTO>>> GetRecordsByPatient(int patientId)
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userPatientId = User.FindFirst("patientId")?.Value;
            var userFacilityId = User.FindFirst("facilityId")?.Value;

            // Check permissions
            if (userRole == "Patient" && userPatientId != patientId.ToString())
                return Forbid();

            // If user is a facility, verify the patient belongs to their facility
            if (userRole == "Facility")
            {
                var patient = await _context.Patients.FindAsync(patientId);
                if (patient == null || patient.FacilityId.ToString() != userFacilityId)
                    return Forbid();
            }

            var records = await _context.MedicalRecords
                .Where(r => r.PatientId == patientId)
                .Include(r => r.Physician)
                .Select(r => new MedicalRecordDTO
                {
                    MedicalRecordId = r.MedicalRecordId,
                    PatientId = r.PatientId,
                    RecordType = r.RecordType,
                    Details = r.Details,
                    ImageUrl = r.ImageUrl,
                    CreatedOn = r.CreatedOn,
                    RecordDate = r.RecordDate,
                    PhysicianId = r.PhysicianId,
                    PhysicianName = r.Physician != null
                        ? "Dr. " + r.Physician.FirstName + " " + r.Physician.LastName
                        : r.PhysicianName
                })
                .ToListAsync();

            return Ok(records);
        }

        // GET record by its unique ID
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin, Physician, Patient, Facility")]
        public async Task<ActionResult<MedicalRecordDTO>> GetRecord(int id)
        {
            var record = await _context.MedicalRecords
                .Include(r => r.Patient)
                .Include(r => r.Physician)
                .FirstOrDefaultAsync(r => r.MedicalRecordId == id);

            if (record == null)
                return NotFound();

            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userPatientId = User.FindFirst("patientId")?.Value;
            var userFacilityId = User.FindFirst("facilityId")?.Value;

            // Check permissions
            if (userRole == "Patient" && userPatientId != record.PatientId.ToString())
                return Forbid();

            // If user is a facility, verify the patient belongs to their facility
            if (userRole == "Facility")
            {
                var patient = await _context.Patients.FindAsync(record.PatientId);
                if (patient == null || patient.FacilityId.ToString() != userFacilityId)
                    return Forbid();
            }

            return Ok(MapToDTO(record));
        }

        // CREATE RECORD (Patients, Admins, Facilities)
        [HttpPost]
        [Authorize(Roles = "Admin, Patient, Facility")]
        public async Task<ActionResult<MedicalRecordDTO>> CreateRecord(MedicalRecordDTO dto)
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userPatientId = User.FindFirst("patientId")?.Value;
            var userFacilityId = User.FindFirst("facilityId")?.Value;

            // Patients can only create records for themselves
            if (userRole == "Patient" && userPatientId != dto.PatientId.ToString())
                return Forbid();

            // If user is a facility, verify the patient belongs to their facility
            if (userRole == "Facility")
            {
                var patient = await _context.Patients.FindAsync(dto.PatientId);
                if (patient == null || patient.FacilityId.ToString() != userFacilityId)
                    return Forbid();
            }

            var record = MapToEntity(dto);
            _context.MedicalRecords.Add(record);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRecord), new { id = record.MedicalRecordId }, MapToDTO(record));
        }

        // UPDATE RECORD (Patients can edit their own, Admins and Facilities can edit all)
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin, Patient, Facility")]
        public async Task<IActionResult> UpdateRecord(int id, MedicalRecordDTO dto)
        {
            if (id != dto.MedicalRecordId)
                return BadRequest();

            var record = await _context.MedicalRecords.FindAsync(id);
            if (record == null)
                return NotFound();

            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userPatientId = User.FindFirst("patientId")?.Value;
            var userFacilityId = User.FindFirst("facilityId")?.Value;

            // Patients can only update their own records
            if (userRole == "Patient" && userPatientId != record.PatientId.ToString())
                return Forbid();

            // If user is a facility, verify the patient belongs to their facility
            if (userRole == "Facility")
            {
                var patient = await _context.Patients.FindAsync(record.PatientId);
                if (patient == null || patient.FacilityId.ToString() != userFacilityId)
                    return Forbid();
            }

            // Apply updates
            record.PatientId = dto.PatientId;
            record.RecordType = dto.RecordType;
            record.Details = dto.Details;
            record.ImageUrl = dto.ImageUrl;
            record.RecordDate = dto.RecordDate;
            record.PhysicianId = dto.PhysicianId;
            record.PhysicianName = dto.PhysicianName;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE RECORD (Patients can delete their own, Admins and Facilities can delete any)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin, Patient, Facility")]
        public async Task<IActionResult> DeleteRecord(int id)
        {
            var record = await _context.MedicalRecords.FindAsync(id);
            if (record == null)
                return NotFound();

            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userPatientId = User.FindFirst("patientId")?.Value;
            var userFacilityId = User.FindFirst("facilityId")?.Value;

            // Patients can only delete their own records
            if (userRole == "Patient" && userPatientId != record.PatientId.ToString())
                return Forbid();

            // If user is a facility, verify the patient belongs to their facility
            if (userRole == "Facility")
            {
                var patient = await _context.Patients.FindAsync(record.PatientId);
                if (patient == null || patient.FacilityId.ToString() != userFacilityId)
                    return Forbid();
            }

            _context.MedicalRecords.Remove(record);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}