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
    [Authorize(Roles = "Pharmacist, Admin")] // 🚀 Restrict Controller Access
    public class DispensingsController : ControllerBase
    {
        private readonly MedConnectContext _context;

        public DispensingsController(MedConnectContext context)
        {
            _context = context;
        }

        // ✅ GET: ALL DISPENSINGS (Pharmacists/Admins)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetAllDispensings()
        {
            var dispensings = await _context.Dispensings
                .Include(d => d.Prescription)
                .Select(d => new
                {
                    DispensingId = d.Id,
                    PharmacistId = d.PharmacistId,
                    PrescriptionId = d.PrescriptionId,
                    Medication = d.Prescription.MedicationDetails,
                    Patient = d.Prescription.Patient.FirstName + " " + d.Prescription.Patient.LastName,
                    DispensedOn = d.DispensedOn,
                    Notes = d.Notes,
                    Quantity = d.Quantity
                })
                .ToListAsync();

            return Ok(dispensings);
        }

        // ✅ GET: SINGLE DISPENSING (Pharmacists/Admins)
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetDispensingById(int id)
        {
            var dispensing = await _context.Dispensings
                .Include(d => d.Prescription)
                .Where(d => d.Id == id)
                .Select(d => new
                {
                    DispensingId = d.Id,
                    PharmacistId = d.PharmacistId,
                    PrescriptionId = d.PrescriptionId,
                    DispensedOn = d.DispensedOn,
                    Notes = d.Notes,
                    Quantity = d.Quantity
                })
                .FirstOrDefaultAsync();

            if (dispensing == null) return NotFound();

            return Ok(dispensing);
        }

        // ✅ UPDATE DISPENSING (Pharmacists/Admins)
        [HttpPut("{id}")]
        [Authorize(Roles = "Pharmacist, Admin")] // 🚀 Only Pharmacists/Admins can update
        public async Task<IActionResult> UpdateDispensing(int id, [FromBody] DispenseDTO request)
        {
            if (id <= 0) return BadRequest("Invalid Dispensing ID.");
            if (request.PharmacistId < 1) return BadRequest("Invalid Pharmacist ID.");
            if (request.PrescriptionId < 1) return BadRequest("Invalid Prescription ID.");
            if (request.Quantity < 1) return BadRequest("Quantity must be at least 1.");

            var dispensing = await _context.Dispensings.FindAsync(id);
            if (dispensing == null) return NotFound("Dispensing not found.");

            // Update fields
            dispensing.PharmacistId = request.PharmacistId;
            dispensing.PrescriptionId = request.PrescriptionId;
            dispensing.Notes = string.IsNullOrWhiteSpace(request.DispensingNotes) ? null : request.DispensingNotes;
            dispensing.Quantity = request.Quantity;

            _context.Entry(dispensing).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Dispensings.Any(e => e.Id == id)) return NotFound();
                throw;
            }

            return NoContent();
        }

        // ❌ DELETE DISPENSING (Admins Only)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")] // 🚀 Only Admins can delete
        public async Task<IActionResult> DeleteDispensing(int id)
        {
            var dispensing = await _context.Dispensings.FindAsync(id);
            if (dispensing == null) return NotFound();

            _context.Dispensings.Remove(dispensing);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ✅ DISPENSE MEDICATION (Pharmacists/Admins)
        [HttpPost]
        [Authorize(Roles = "Pharmacist, Admin")] // 🚀 Only Pharmacists/Admins can dispense
        public async Task<IActionResult> DispenseMedication([FromBody] DispenseDTO request)
        {
            if (request.PharmacistId < 1) return BadRequest("Invalid Pharmacist ID.");
            if (request.PrescriptionId < 1) return BadRequest("Invalid Prescription ID.");
            if (request.Quantity < 1) return BadRequest("Quantity must be at least 1.");

            var pharmacist = await _context.Pharmacists.FindAsync(request.PharmacistId);
            if (pharmacist == null) return NotFound("Pharmacist not found.");

            var prescription = await _context.Prescriptions.FindAsync(request.PrescriptionId);
            if (prescription == null) return NotFound("Prescription not found.");

            var dispensing = new Dispensing
            {
                PharmacistId = request.PharmacistId,
                PrescriptionId = request.PrescriptionId,
                Notes = string.IsNullOrWhiteSpace(request.DispensingNotes) ? null : request.DispensingNotes,
                DispensedOn = DateTime.UtcNow,
                Quantity = request.Quantity
            };

            _context.Dispensings.Add(dispensing);

            prescription.IsDispensed = true;
            _context.Entry(prescription).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Medication dispensed successfully.",
                DispensingId = dispensing.Id,
                QuantityDispensed = request.Quantity
            });
        }
    }
}