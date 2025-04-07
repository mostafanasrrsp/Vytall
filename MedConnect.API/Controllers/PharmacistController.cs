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
    [Authorize(Roles = "Admin, Facility")] // ✅ Only Admins and Facilities can access this controller
    public class PharmacistsController : ControllerBase
    {
        private readonly MedConnectContext _context;

        public PharmacistsController(MedConnectContext context)
        {
            _context = context;
        }

        // ✅ GET all pharmacists (Admins and Facilities)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetAllPharmacists()
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userFacilityId = User.FindFirst("facilityId")?.Value;

            var query = _context.Pharmacists.AsQueryable();

            // If user is a facility, only return pharmacists at their facility
            if (userRole == "Facility")
            {
                query = query.Where(p => p.FacilityId.ToString() == userFacilityId);
            }

            var pharmacists = await query
                .Select(p => new PharmacistDTO
                {
                    Id = p.PharmacistId,
                    Name = p.FirstName + " " + p.LastName,
                    Contact = $"{p.Email} | {p.Phone}"
                })
                .ToListAsync();

            return Ok(pharmacists);
        }

        // ✅ GET a specific pharmacist (Admins only)
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetPharmacistById(int id)
        {
            var pharmacist = await _context.Pharmacists.FindAsync(id);
            if (pharmacist == null) return NotFound("Pharmacist not found.");

            var result = new PharmacistDTO
            {
                Id = pharmacist.PharmacistId,
                Name = pharmacist.FirstName + " " + pharmacist.LastName,
                Contact = pharmacist.Email + " | " + pharmacist.Phone
            };

            return Ok(result);
        }

        // ✅ CREATE a new pharmacist (Admins only)
        [HttpPost]
        public async Task<ActionResult<Pharmacist>> CreatePharmacist(Pharmacist pharmacist)
        {
            _context.Pharmacists.Add(pharmacist);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetPharmacistById), new { id = pharmacist.PharmacistId }, pharmacist);
        }

        // ✅ UPDATE a pharmacist (Admins only)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePharmacist(int id, Pharmacist pharmacist)
        {
            if (id != pharmacist.PharmacistId) return BadRequest();

            _context.Entry(pharmacist).State = EntityState.Modified;
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