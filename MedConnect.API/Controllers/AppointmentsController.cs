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
    [Authorize(Roles = "Physician, Admin, Patient, Facility")]
    public class AppointmentsController : ControllerBase
    {
        private readonly MedConnectContext _context;

        public AppointmentsController(MedConnectContext context)
        {
            _context = context;
        }

        // ✅ GET: ALL Appointments (Restricted to Physicians, Admins, and Facilities)
        [HttpGet]
        [Authorize(Roles = "Physician, Admin, Facility")]
        public async Task<ActionResult<IEnumerable<AppointmentDTO>>> GetAllAppointments()
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userFacilityId = User.FindFirst("facilityId")?.Value;

            var query = _context.Appointments
                .Include(a => a.Physician)
                .Include(a => a.Patient)
                .AsQueryable();

            // If user is a facility, only return appointments for patients at their facility
            if (userRole == "Facility")
            {
                var facilityPatients = _context.Patients
                    .Where(p => p.FacilityId.ToString() == userFacilityId)
                    .Select(p => p.PatientId);

                query = query.Where(a => facilityPatients.Contains(a.PatientId));
            }

            var appointments = await query
                .Select(a => new AppointmentDTO
                {
                    AppointmentId = a.AppointmentId,
                    PatientId = a.PatientId,
                    PatientName = a.Patient != null
                        ? $"{a.Patient.FirstName} {a.Patient.LastName}"
                        : "Unknown",
                    PhysicianId = a.PhysicianId,
                    PhysicianName = a.Physician != null
                        ? $"{a.Physician.FirstName} {a.Physician.LastName}"
                        : "Unknown",
                    FacilityId = a.FacilityId,
                    AppointmentTime = a.AppointmentTime.ToString("o"),
                    Status = a.Status,
                    Reason = a.Reason
                })
                .ToListAsync();

            return Ok(appointments);
        }

        // ✅ GET: Appointments for a **Specific Patient** (Patients and Facilities)
        [HttpGet("patient/{patientId}")]
        [Authorize(Roles = "Patient, Facility")]
        public async Task<ActionResult<IEnumerable<AppointmentDTO>>> GetAppointmentsForPatient(int patientId)
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userFacilityId = User.FindFirst("facilityId")?.Value;

            // If user is a facility, verify the patient belongs to their facility
            if (userRole == "Facility")
            {
                var patient = await _context.Patients.FindAsync(patientId);
                if (patient == null || patient.FacilityId.ToString() != userFacilityId)
                {
                    return Forbid();
                }
            }

            var appointments = await _context.Appointments
                .Where(a => a.PatientId == patientId)
                .Include(a => a.Physician)
                .Include(a => a.Patient)
                .Select(a => new AppointmentDTO
                {
                    AppointmentId = a.AppointmentId,
                    PatientId = a.PatientId,
                    PatientName = a.Patient != null
                        ? $"{a.Patient.FirstName} {a.Patient.LastName}"
                        : "Unknown",
                    PhysicianId = a.PhysicianId,
                    PhysicianName = a.Physician != null
                        ? $"{a.Physician.FirstName} {a.Physician.LastName}"
                        : "Unknown",
                    FacilityId = a.FacilityId,
                    AppointmentTime = a.AppointmentTime.ToString("o"),
                    Status = a.Status,
                    Reason = a.Reason
                })
                .ToListAsync();

            return Ok(appointments);
        }

        // ✅ GET: Single Appointment by ID
        [HttpGet("{id}")]
        [Authorize(Roles = "Physician, Admin, Patient, Facility")]
        public async Task<ActionResult<AppointmentDTO>> GetAppointmentById(int id)
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userFacilityId = User.FindFirst("facilityId")?.Value;

            var appointment = await _context.Appointments
                .Include(a => a.Physician)
                .Include(a => a.Patient)
                .FirstOrDefaultAsync(a => a.AppointmentId == id);

            if (appointment == null)
                return NotFound();

            // If user is a facility, verify the appointment belongs to their facility
            if (userRole == "Facility" && appointment.FacilityId.ToString() != userFacilityId)
            {
                return Forbid();
            }

            return Ok(new AppointmentDTO
            {
                AppointmentId = appointment.AppointmentId,
                PatientId = appointment.PatientId,
                PhysicianId = appointment.PhysicianId,
                FacilityId = appointment.FacilityId,
                AppointmentTime = appointment.AppointmentTime.ToString("o"),
                Status = appointment.Status,
                Reason = appointment.Reason,
                PhysicianName = appointment.Physician != null
                    ? $"{appointment.Physician.FirstName} {appointment.Physician.LastName}"
                    : "Unknown",
                PatientName = appointment.Patient != null
                    ? $"{appointment.Patient.FirstName} {appointment.Patient.LastName}"
                    : "Unknown"
            });
        }

        // ✅ GET Appointments for Diagnosis (Restricted to Physicians & Admins)
        [HttpGet("available-for-diagnosis")]
        [Authorize(Roles = "Admin, Physician, Patient")]
        public async Task<ActionResult<IEnumerable<object>>> GetAppointmentsForDiagnosis()
        {
            var appointments = await _context.Appointments
                .Include(a => a.Physician)
                .Include(a => a.Patient)
                .Select(a => new
                {
                    Id = a.AppointmentId,
                    PatientId = a.PatientId,
                    PatientName = a.Patient != null
                        ? $"{a.Patient.FirstName} {a.Patient.LastName}"
                        : "Unknown",
                    PhysicianId = a.PhysicianId,
                    PhysicianName = a.Physician != null
                        ? $"Dr. {a.Physician.FirstName} {a.Physician.LastName}"
                        : "Unknown",
                    AppointmentTime = a.AppointmentTime.ToString("yyyy-MM-dd HH:mm"),
                    Status = a.Status,
                    Reason = a.Reason
                })
                .ToListAsync();

            return Ok(appointments);
        }

        // ✅ CREATE Appointment (Patients and Facilities)
        [HttpPost]
        [Authorize(Roles = "Patient, Facility")]
        public async Task<ActionResult<AppointmentDTO>> CreateAppointment(AppointmentDTO dto)
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userFacilityId = User.FindFirst("facilityId")?.Value;

            // Log incoming data
            Console.WriteLine($"Creating appointment with PhysicianId: {dto.PhysicianId}, PatientId: {dto.PatientId}");

            // If user is a facility
            if (userRole == "Facility")
            {
                // Set the facility ID from the token
                dto.FacilityId = int.Parse(userFacilityId!);
                Console.WriteLine($"Facility ID set to: {dto.FacilityId}");

                // Verify the patient belongs to this facility
                var patient = await _context.Patients.FindAsync(dto.PatientId);
                if (patient == null || patient.FacilityId != dto.FacilityId)
                {
                    return BadRequest("Patient does not belong to this facility.");
                }
                Console.WriteLine($"Patient found and verified: {patient.FirstName} {patient.LastName}");

                // Check if physician exists in database
                var physicianExists = await _context.Physicians.AnyAsync();
                Console.WriteLine($"Any physicians in database: {physicianExists}");

                // List all physicians for debugging
                var allPhysicians = await _context.Physicians
                    .Select(p => new { p.PhysicianId, Name = p.FirstName + " " + p.LastName })
                    .ToListAsync();
                Console.WriteLine("Available physicians:");
                foreach (var p in allPhysicians)
                {
                    Console.WriteLine($"ID: {p.PhysicianId}, Name: {p.Name}");
                }

                // Verify the physician exists (but don't restrict by facility)
                var physician = await _context.Physicians.FindAsync(dto.PhysicianId);
                if (physician == null)
                {
                    Console.WriteLine($"Physician with ID {dto.PhysicianId} not found");
                    return BadRequest($"Physician with ID {dto.PhysicianId} not found.");
                }
                Console.WriteLine($"Physician found: {physician.FirstName} {physician.LastName}");
            }

            var appointment = new Appointment
            {
                PatientId = dto.PatientId,
                PhysicianId = dto.PhysicianId,
                FacilityId = dto.FacilityId ?? 0,
                AppointmentTime = DateTime.Parse(dto.AppointmentTime),
                Status = dto.Status,
                Reason = dto.Reason
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            // Return the created appointment with full details
            var createdAppointment = await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Physician)
                .FirstOrDefaultAsync(a => a.AppointmentId == appointment.AppointmentId);

            if (createdAppointment == null)
                return StatusCode(500, "Created appointment could not be retrieved.");

            var responseDto = new AppointmentDTO
            {
                AppointmentId = createdAppointment.AppointmentId,
                PatientId = createdAppointment.PatientId,
                PatientName = createdAppointment.Patient != null
                    ? $"{createdAppointment.Patient.FirstName} {createdAppointment.Patient.LastName}"
                    : "Unknown",
                PhysicianId = createdAppointment.PhysicianId,
                PhysicianName = createdAppointment.Physician != null
                    ? $"{createdAppointment.Physician.FirstName} {createdAppointment.Physician.LastName}"
                    : "Unknown",
                FacilityId = createdAppointment.FacilityId,
                AppointmentTime = createdAppointment.AppointmentTime.ToString("o"),
                Status = createdAppointment.Status,
                Reason = createdAppointment.Reason
            };

            return CreatedAtAction(nameof(GetAppointmentById), new { id = appointment.AppointmentId }, responseDto);
        }

        // ✅ UPDATE Appointment (Physicians, Admins, and Facilities)
        [HttpPut("{id}")]
        [Authorize(Roles = "Physician, Admin, Facility")]
        public async Task<IActionResult> UpdateAppointment(int id, AppointmentDTO dto)
        {
            if (id != dto.AppointmentId)
                return BadRequest("Appointment ID mismatch.");

            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userFacilityId = User.FindFirst("facilityId")?.Value;

            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
                return NotFound();

            // If user is a facility, verify they're updating an appointment for their facility
            if (userRole == "Facility" && appointment.FacilityId.ToString() != userFacilityId)
            {
                return Forbid();
            }

            appointment.FacilityId = dto.FacilityId;
            appointment.AppointmentTime = DateTime.Parse(dto.AppointmentTime);
            appointment.Status = dto.Status;
            appointment.Reason = dto.Reason;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ✅ DELETE Appointment (Admins Only)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")] // 🚀 Only Admins can delete
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
                return NotFound();

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}