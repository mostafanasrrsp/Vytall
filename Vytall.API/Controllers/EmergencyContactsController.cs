using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vytall.API.Data;
using Vytall.API.Models;
using Vytall.API.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace Vytall.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class EmergencyContactsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EmergencyContactsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/EmergencyContacts/patient/{patientId}
        [HttpGet("patient/{patientId}")]
        public async Task<ActionResult<IEnumerable<EmergencyContactDTO>>> GetPatientEmergencyContacts(int patientId)
        {
            var contacts = await _context.EmergencyContacts
                .Where(ec => ec.PatientId == patientId)
                .Select(ec => new EmergencyContactDTO
                {
                    Id = ec.Id,
                    PatientId = ec.PatientId,
                    Name = ec.Name,
                    Relationship = ec.Relationship,
                    PhoneNumber = ec.PhoneNumber,
                    IsPrimary = ec.IsPrimary,
                    Notes = ec.Notes,
                    EmergencyInstructions = ec.EmergencyInstructions,
                    CanMakeMedicalDecisions = ec.CanMakeMedicalDecisions,
                    NotifyOnEmergency = ec.NotifyOnEmergency,
                    CreatedAt = ec.CreatedAt,
                    UpdatedAt = ec.UpdatedAt
                })
                .ToListAsync();

            return Ok(contacts);
        }

        // GET: api/EmergencyContacts/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<EmergencyContactDTO>> GetEmergencyContact(int id)
        {
            var contact = await _context.EmergencyContacts.FindAsync(id);

            if (contact == null)
            {
                return NotFound();
            }

            return new EmergencyContactDTO
            {
                Id = contact.Id,
                PatientId = contact.PatientId,
                Name = contact.Name,
                Relationship = contact.Relationship,
                PhoneNumber = contact.PhoneNumber,
                IsPrimary = contact.IsPrimary,
                Notes = contact.Notes,
                EmergencyInstructions = contact.EmergencyInstructions,
                CanMakeMedicalDecisions = contact.CanMakeMedicalDecisions,
                NotifyOnEmergency = contact.NotifyOnEmergency,
                CreatedAt = contact.CreatedAt,
                UpdatedAt = contact.UpdatedAt
            };
        }

        // POST: api/EmergencyContacts
        [HttpPost]
        public async Task<ActionResult<EmergencyContactDTO>> CreateEmergencyContact(CreateEmergencyContactDTO dto)
        {
            var contact = new EmergencyContact
            {
                PatientId = int.Parse(User.FindFirst("PatientId")?.Value),
                Name = dto.Name,
                Relationship = dto.Relationship,
                PhoneNumber = dto.PhoneNumber,
                IsPrimary = dto.IsPrimary,
                Notes = dto.Notes,
                EmergencyInstructions = dto.EmergencyInstructions,
                CanMakeMedicalDecisions = dto.CanMakeMedicalDecisions,
                NotifyOnEmergency = dto.NotifyOnEmergency,
                CreatedAt = DateTime.UtcNow
            };

            _context.EmergencyContacts.Add(contact);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEmergencyContact), new { id = contact.Id }, new EmergencyContactDTO
            {
                Id = contact.Id,
                PatientId = contact.PatientId,
                Name = contact.Name,
                Relationship = contact.Relationship,
                PhoneNumber = contact.PhoneNumber,
                IsPrimary = contact.IsPrimary,
                Notes = contact.Notes,
                EmergencyInstructions = contact.EmergencyInstructions,
                CanMakeMedicalDecisions = contact.CanMakeMedicalDecisions,
                NotifyOnEmergency = contact.NotifyOnEmergency,
                CreatedAt = contact.CreatedAt,
                UpdatedAt = contact.UpdatedAt
            });
        }

        // PUT: api/EmergencyContacts/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmergencyContact(int id, UpdateEmergencyContactDTO dto)
        {
            var contact = await _context.EmergencyContacts.FindAsync(id);

            if (contact == null)
            {
                return NotFound();
            }

            // Verify ownership
            if (contact.PatientId != int.Parse(User.FindFirst("PatientId")?.Value))
            {
                return Forbid();
            }

            contact.Name = dto.Name;
            contact.Relationship = dto.Relationship;
            contact.PhoneNumber = dto.PhoneNumber;
            contact.IsPrimary = dto.IsPrimary;
            contact.Notes = dto.Notes;
            contact.EmergencyInstructions = dto.EmergencyInstructions;
            contact.CanMakeMedicalDecisions = dto.CanMakeMedicalDecisions;
            contact.NotifyOnEmergency = dto.NotifyOnEmergency;
            contact.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmergencyContactExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/EmergencyContacts/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmergencyContact(int id)
        {
            var contact = await _context.EmergencyContacts.FindAsync(id);

            if (contact == null)
            {
                return NotFound();
            }

            // Verify ownership
            if (contact.PatientId != int.Parse(User.FindFirst("PatientId")?.Value))
            {
                return Forbid();
            }

            _context.EmergencyContacts.Remove(contact);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EmergencyContactExists(int id)
        {
            return _context.EmergencyContacts.Any(e => e.Id == id);
        }
    }
} 