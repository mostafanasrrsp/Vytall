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
    [Authorize(Roles = "Admin, Facility")] // ✅ Only Admins and Facilities can access this controller
    public class PharmacistsController : ControllerBase
    {
        private readonly VytallContext _context;

        public PharmacistsController(VytallContext context)
        {
            _context = context;
        }

        // ✅ GET all pharmacists (Admins and Facilities)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PharmacistDTO>>> GetAllPharmacists()
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userFacilityId = User.FindFirst("facilityId")?.Value;

            var query = _context.Pharmacists
                .Include(p => p.Pharmacy)
                .AsQueryable();

            // If user is a facility, only return pharmacists at their facility
            if (userRole == "Facility")
            {
                query = query.Where(p => p.PharmacyId.ToString() == userFacilityId);
            }

            var pharmacists = await query
                .Select(p => new PharmacistDTO
                {
                    PharmacistId = p.PharmacistId,
                    FirstName = p.FirstName,
                    LastName = p.LastName,
                    Email = p.Email,
                    PhoneNumber = p.Phone,
                    LicenseNumber = p.LicenseNumber,
                    PharmacyId = p.PharmacyId,
                    PharmacyName = p.Pharmacy.Name
                })
                .ToListAsync();

            return Ok(pharmacists);
        }

        // ✅ GET a specific pharmacist (Admins only)
        [HttpGet("{id}")]
        public async Task<ActionResult<PharmacistDTO>> GetPharmacistById(int id)
        {
            var pharmacist = await _context.Pharmacists
                .Include(p => p.Pharmacy)
                .FirstOrDefaultAsync(p => p.PharmacistId == id);

            if (pharmacist == null) return NotFound("Pharmacist not found.");

            var result = new PharmacistDTO
            {
                PharmacistId = pharmacist.PharmacistId,
                FirstName = pharmacist.FirstName,
                LastName = pharmacist.LastName,
                Email = pharmacist.Email,
                PhoneNumber = pharmacist.Phone,
                LicenseNumber = pharmacist.LicenseNumber,
                PharmacyId = pharmacist.PharmacyId,
                PharmacyName = pharmacist.Pharmacy?.Name
            };

            return Ok(result);
        }

        // ✅ CREATE a new pharmacist (Admins only)
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<PharmacistDTO>> CreatePharmacist(PharmacistDTO pharmacistDto)
        {
            var pharmacist = new Pharmacist
            {
                FirstName = pharmacistDto.FirstName,
                LastName = pharmacistDto.LastName,
                Email = pharmacistDto.Email,
                Phone = pharmacistDto.PhoneNumber,
                LicenseNumber = pharmacistDto.LicenseNumber,
                PharmacyId = pharmacistDto.PharmacyId
            };

            _context.Pharmacists.Add(pharmacist);
            await _context.SaveChangesAsync();

            pharmacistDto.PharmacistId = pharmacist.PharmacistId;
            return CreatedAtAction(nameof(GetPharmacistById), new { id = pharmacist.PharmacistId }, pharmacistDto);
        }

        // ✅ UPDATE a pharmacist (Admins only)
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdatePharmacist(int id, PharmacistDTO pharmacistDto)
        {
            if (id != pharmacistDto.PharmacistId) return BadRequest();

            var pharmacist = await _context.Pharmacists.FindAsync(id);
            if (pharmacist == null) return NotFound();

            pharmacist.FirstName = pharmacistDto.FirstName;
            pharmacist.LastName = pharmacistDto.LastName;
            pharmacist.Email = pharmacistDto.Email;
            pharmacist.Phone = pharmacistDto.PhoneNumber;
            pharmacist.LicenseNumber = pharmacistDto.LicenseNumber;
            pharmacist.PharmacyId = pharmacistDto.PharmacyId;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Pharmacists.Any(p => p.PharmacistId == id))
                    return NotFound();
                throw;
            }

            return NoContent();
        }

        // ✅ DELETE a pharmacist (Admins only)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeletePharmacist(int id)
        {
            var pharmacist = await _context.Pharmacists.FindAsync(id);
            if (pharmacist == null) return NotFound();

            _context.Pharmacists.Remove(pharmacist);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}