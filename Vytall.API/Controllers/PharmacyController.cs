using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vytall.API.Data;
using Vytall.API.Models;
using Vytall.API.DTOs;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Vytall.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")] // ✅ Only Admins can access this controller
    public class PharmaciesController : ControllerBase
    {
        private readonly VytallContext _context;

        public PharmaciesController(VytallContext context)
        {
            _context = context;
        }

        // ✅ GET all pharmacies (Admins only)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PharmacyDTO>>> GetAllPharmacies()
        {
            var pharmacies = await _context.Pharmacies
                .Include(p => p.Facility)
                .Select(p => new PharmacyDTO
                {
                    PharmacyId = p.PharmacyId,
                    Name = p.Name,
                    Address = p.Address,
                    Email = p.Email,
                    Phone = p.Phone,
                    FacilityId = p.FacilityId,
                    FacilityName = p.Facility.Name
                })
                .ToListAsync();

            return Ok(pharmacies);
        }

        // ✅ GET a specific pharmacy (Admins only)
        [HttpGet("{id}")]
        public async Task<ActionResult<PharmacyDTO>> GetPharmacyById(int id)
        {
            var pharmacy = await _context.Pharmacies
                .Include(p => p.Facility)
                .FirstOrDefaultAsync(p => p.PharmacyId == id);

            if (pharmacy == null) return NotFound();

            var result = new PharmacyDTO
            {
                PharmacyId = pharmacy.PharmacyId,
                Name = pharmacy.Name,
                Address = pharmacy.Address,
                Email = pharmacy.Email,
                Phone = pharmacy.Phone,
                FacilityId = pharmacy.FacilityId,
                FacilityName = pharmacy.Facility?.Name
            };

            return Ok(result);
        }

        // ✅ CREATE a new pharmacy (Admins only)
        [HttpPost]
        public async Task<ActionResult<PharmacyDTO>> CreatePharmacy(PharmacyDTO pharmacyDto)
        {
            var pharmacy = new Pharmacy
            {
                Name = pharmacyDto.Name,
                Address = pharmacyDto.Address,
                Email = pharmacyDto.Email,
                Phone = pharmacyDto.Phone,
                FacilityId = pharmacyDto.FacilityId
            };

            _context.Pharmacies.Add(pharmacy);
            await _context.SaveChangesAsync();

            pharmacyDto.PharmacyId = pharmacy.PharmacyId;
            return CreatedAtAction(nameof(GetPharmacyById), new { id = pharmacy.PharmacyId }, pharmacyDto);
        }

        // ✅ UPDATE a pharmacy (Admins only)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePharmacy(int id, PharmacyDTO pharmacyDto)
        {
            if (id != pharmacyDto.PharmacyId) return BadRequest();

            var pharmacy = await _context.Pharmacies.FindAsync(id);
            if (pharmacy == null) return NotFound();

            pharmacy.Name = pharmacyDto.Name;
            pharmacy.Address = pharmacyDto.Address;
            pharmacy.Email = pharmacyDto.Email;
            pharmacy.Phone = pharmacyDto.Phone;
            pharmacy.FacilityId = pharmacyDto.FacilityId;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Pharmacies.Any(p => p.PharmacyId == id))
                    return NotFound();
                throw;
            }

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