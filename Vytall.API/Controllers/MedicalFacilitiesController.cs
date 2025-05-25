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
    [Authorize(Roles = "Admin,Facility")] // Allow both Admin and Facility roles
    public class MedicalFacilitiesController : ControllerBase
    {
        private readonly VytallContext _context;

        public MedicalFacilitiesController(VytallContext context)
        {
            _context = context;
        }

        // GET all facilities (Admins only)
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<MedicalFacilityDTO>>> GetAllFacilities()
        {
            var facilities = await _context.MedicalFacilities
                .Select(f => new MedicalFacilityDTO
                {
                    FacilityId = f.FacilityId,
                    Name = f.Name,
                    Type = f.Type,
                    Address = f.Address,
                    Phone = f.Phone,
                    Email = f.Email,
                    OperatingHours = f.OperatingHours
                }).ToListAsync();

            return Ok(facilities);
        }

        // GET facility by ID (Admin or the facility itself)
        [HttpGet("{id}")]
        public async Task<ActionResult<MedicalFacilityDTO>> GetFacilityById(int id)
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userFacilityId = User.FindFirst("facilityId")?.Value;

            // If user is a facility, they can only view their own details
            if (userRole == "Facility" && userFacilityId != id.ToString())
            {
                return Forbid();
            }

            var facility = await _context.MedicalFacilities.FindAsync(id);
            if (facility == null) return NotFound();

            var dto = new MedicalFacilityDTO
            {
                FacilityId = facility.FacilityId,
                Name = facility.Name,
                Type = facility.Type,
                Address = facility.Address,
                Phone = facility.Phone,
                Email = facility.Email,
                OperatingHours = facility.OperatingHours
            };

            return Ok(dto);
        }

        // GET facility staff (Admin or the facility itself)
        [HttpGet("{id}/staff")]
        public async Task<ActionResult<object>> GetFacilityStaff(int id)
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userFacilityId = User.FindFirst("facilityId")?.Value;

            // If user is a facility, they can only view their own staff
            if (userRole == "Facility" && userFacilityId != id.ToString())
            {
                return Forbid();
            }

            var physicians = await _context.Physicians
                .Where(p => p.FacilityId == id)
                .Select(p => new
                {
                    Id = p.PhysicianId,
                    Name = p.FirstName + " " + p.LastName,
                    Role = "Physician",
                    Specialty = p.Specialization,
                    Contact = p.Email
                })
                .ToListAsync();

            var pharmacists = await _context.Pharmacists
                .Include(p => p.Pharmacy)
                .Where(p => p.Pharmacy.FacilityId == id)
                .Select(p => new
                {
                    Id = p.PharmacistId,
                    Name = p.FirstName + " " + p.LastName,
                    Role = "Pharmacist",
                    Specialty = "Pharmacy",
                    Contact = p.Email
                })
                .ToListAsync();

            return Ok(new
            {
                Physicians = physicians,
                Pharmacists = pharmacists
            });
        }

        // GET facility patients (Admin or the facility itself)
        [HttpGet("{id}/patients")]
        public async Task<ActionResult<object>> GetFacilityPatients(int id)
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userFacilityId = User.FindFirst("facilityId")?.Value;

            // If user is a facility, they can only view their own patients
            if (userRole == "Facility" && userFacilityId != id.ToString())
            {
                return Forbid();
            }

            var patients = await _context.Patients
                .Where(p => p.FacilityId == id)
                .Select(p => new
                {
                    Id = p.PatientId,
                    Name = p.FirstName + " " + p.LastName,
                    DateOfBirth = p.DateOfBirth,
                    Contact = p.Email,
                    Phone = p.Phone
                })
                .ToListAsync();

            return Ok(patients);
        }

        // CREATE a new facility (Admins only)
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<MedicalFacilityDTO>> CreateFacility(MedicalFacilityDTO dto)
        {
            var facility = new MedicalFacility
            {
                Name = dto.Name,
                Type = dto.Type,
                Address = dto.Address,
                Phone = dto.Phone,
                Email = dto.Email,
                OperatingHours = dto.OperatingHours
            };

            _context.MedicalFacilities.Add(facility);
            await _context.SaveChangesAsync();

            dto.FacilityId = facility.FacilityId;
            return CreatedAtAction(nameof(GetFacilityById), new { id = facility.FacilityId }, dto);
        }

        // UPDATE facility (Admin or the facility itself)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFacility(int id, MedicalFacilityDTO dto)
        {
            if (id != dto.FacilityId)
                return BadRequest();

            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userFacilityId = User.FindFirst("facilityId")?.Value;

            // If user is a facility, they can only update their own details
            if (userRole == "Facility" && userFacilityId != id.ToString())
            {
                return Forbid();
            }

            var facility = await _context.MedicalFacilities.FindAsync(id);
            if (facility == null)
                return NotFound();

            facility.Name = dto.Name;
            facility.Type = dto.Type;
            facility.Address = dto.Address;
            facility.Phone = dto.Phone;
            facility.Email = dto.Email;
            facility.OperatingHours = dto.OperatingHours;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FacilityExists(id))
                    return NotFound();
                throw;
            }

            return NoContent();
        }

        // DELETE facility (Admins only)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteFacility(int id)
        {
            var facility = await _context.MedicalFacilities.FindAsync(id);
            if (facility == null)
                return NotFound();

            _context.MedicalFacilities.Remove(facility);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FacilityExists(int id)
        {
            return _context.MedicalFacilities.Any(e => e.FacilityId == id);
        }
    }
}