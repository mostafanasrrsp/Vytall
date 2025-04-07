using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MedConnect.API.Data;
using MedConnect.API.Models;
using MedConnect.API.DTOs;

namespace MedConnect.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")] // ✅ Only Admins can access this controller
    public class PharmaciesController : ControllerBase
    {
        private readonly MedConnectContext _context;

        public PharmaciesController(MedConnectContext context)
        {
            _context = context;
        }

        // ✅ GET all pharmacies (Admins only)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PharmacyDTO>>> GetAllPharmacies()
        {
            var pharmacies = await _context.Pharmacies
                .Select(p => new PharmacyDTO
                {
                    PharmacyId = p.PharmacyId,
                    PharmacyName = p.PharmacyName,
                    Address = p.Address,
                    Email = p.Email,
                    Phone = p.Phone
                })
                .ToListAsync();

            return Ok(pharmacies);
        }

        // ✅ GET a specific pharmacy (Admins only)
        [HttpGet("{id}")]
        public async Task<ActionResult<PharmacyDTO>> GetPharmacyById(int id)
        {
            var pharmacy = await _context.Pharmacies.FindAsync(id);
            if (pharmacy == null) return NotFound();

            var result = new PharmacyDTO
            {
                PharmacyId = pharmacy.PharmacyId,
                PharmacyName = pharmacy.PharmacyName,
                Address = pharmacy.Address,
                Email = pharmacy.Email,
                Phone = pharmacy.Phone
            };

            return Ok(result);
        }

        // ✅ CREATE a new pharmacy (Admins only)
        [HttpPost]
        public async Task<ActionResult<Pharmacy>> CreatePharmacy(Pharmacy pharmacy)
        {
            _context.Pharmacies.Add(pharmacy);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetPharmacyById), new { id = pharmacy.PharmacyId }, pharmacy);
        }

        // ✅ UPDATE a pharmacy (Admins only)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePharmacy(int id, Pharmacy pharmacy)
        {
            if (id != pharmacy.PharmacyId) return BadRequest();

            _context.Entry(pharmacy).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ✅ DELETE a pharmacy (Admins only)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePharmacy(int id)
        {
            var pharmacy = await _context.Pharmacies.FindAsync(id);
            if (pharmacy == null) return NotFound();

            _context.Pharmacies.Remove(pharmacy);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}