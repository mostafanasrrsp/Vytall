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
    public class ClinicalTrialsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClinicalTrialsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/ClinicalTrials
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClinicalTrialDTO>>> GetClinicalTrials(
            [FromQuery] string? phase = null,
            [FromQuery] string? status = null,
            [FromQuery] string? condition = null,
            [FromQuery] bool activeOnly = true)
        {
            var query = _context.ClinicalTrials.AsQueryable();

            if (!string.IsNullOrEmpty(phase))
                query = query.Where(t => t.Phase == phase);

            if (!string.IsNullOrEmpty(status))
                query = query.Where(t => t.Status == status);

            if (!string.IsNullOrEmpty(condition))
                query = query.Where(t => t.Conditions.Contains(condition));

            if (activeOnly)
                query = query.Where(t => t.IsActive);

            var trials = await query
                .Select(t => new ClinicalTrialDTO
                {
                    Id = t.Id,
                    Title = t.Title,
                    Sponsor = t.Sponsor,
                    Phase = t.Phase,
                    Status = t.Status,
                    Description = t.Description,
                    Location = t.Location,
                    StartDate = t.StartDate,
                    EndDate = t.EndDate,
                    Conditions = t.Conditions,
                    Medications = t.Medications,
                    ContactEmail = t.ContactEmail,
                    ContactPhone = t.ContactPhone,
                    Website = t.Website,
                    IsActive = t.IsActive,
                    CreatedAt = t.CreatedAt,
                    UpdatedAt = t.UpdatedAt
                })
                .ToListAsync();

            return Ok(trials);
        }

        // GET: api/ClinicalTrials/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ClinicalTrialDTO>> GetClinicalTrial(int id)
        {
            var trial = await _context.ClinicalTrials.FindAsync(id);

            if (trial == null)
            {
                return NotFound();
            }

            return new ClinicalTrialDTO
            {
                Id = trial.Id,
                Title = trial.Title,
                Sponsor = trial.Sponsor,
                Phase = trial.Phase,
                Status = trial.Status,
                Description = trial.Description,
                Location = trial.Location,
                StartDate = trial.StartDate,
                EndDate = trial.EndDate,
                Conditions = trial.Conditions,
                Medications = trial.Medications,
                ContactEmail = trial.ContactEmail,
                ContactPhone = trial.ContactPhone,
                Website = trial.Website,
                IsActive = trial.IsActive,
                CreatedAt = trial.CreatedAt,
                UpdatedAt = trial.UpdatedAt
            };
        }

        // POST: api/ClinicalTrials
        [HttpPost]
        [Authorize(Roles = "Admin,HealthcareProvider")]
        public async Task<ActionResult<ClinicalTrialDTO>> CreateClinicalTrial(CreateClinicalTrialDTO dto)
        {
            var trial = new ClinicalTrial
            {
                Title = dto.Title,
                Sponsor = dto.Sponsor,
                Phase = dto.Phase,
                Status = dto.Status,
                Description = dto.Description,
                Location = dto.Location,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Conditions = dto.Conditions,
                Medications = dto.Medications,
                ContactEmail = dto.ContactEmail,
                ContactPhone = dto.ContactPhone,
                Website = dto.Website,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.ClinicalTrials.Add(trial);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetClinicalTrial), new { id = trial.Id }, new ClinicalTrialDTO
            {
                Id = trial.Id,
                Title = trial.Title,
                Sponsor = trial.Sponsor,
                Phase = trial.Phase,
                Status = trial.Status,
                Description = trial.Description,
                Location = trial.Location,
                StartDate = trial.StartDate,
                EndDate = trial.EndDate,
                Conditions = trial.Conditions,
                Medications = trial.Medications,
                ContactEmail = trial.ContactEmail,
                ContactPhone = trial.ContactPhone,
                Website = trial.Website,
                IsActive = trial.IsActive,
                CreatedAt = trial.CreatedAt,
                UpdatedAt = trial.UpdatedAt
            });
        }

        // PUT: api/ClinicalTrials/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,HealthcareProvider")]
        public async Task<IActionResult> UpdateClinicalTrial(int id, CreateClinicalTrialDTO dto)
        {
            var trial = await _context.ClinicalTrials.FindAsync(id);

            if (trial == null)
            {
                return NotFound();
            }

            trial.Title = dto.Title;
            trial.Sponsor = dto.Sponsor;
            trial.Phase = dto.Phase;
            trial.Status = dto.Status;
            trial.Description = dto.Description;
            trial.Location = dto.Location;
            trial.StartDate = dto.StartDate;
            trial.EndDate = dto.EndDate;
            trial.Conditions = dto.Conditions;
            trial.Medications = dto.Medications;
            trial.ContactEmail = dto.ContactEmail;
            trial.ContactPhone = dto.ContactPhone;
            trial.Website = dto.Website;
            trial.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClinicalTrialExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/ClinicalTrials/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteClinicalTrial(int id)
        {
            var trial = await _context.ClinicalTrials.FindAsync(id);

            if (trial == null)
            {
                return NotFound();
            }

            trial.IsActive = false;
            trial.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/ClinicalTrials/{id}/participants
        [HttpGet("{id}/participants")]
        [Authorize(Roles = "Admin,HealthcareProvider")]
        public async Task<ActionResult<IEnumerable<TrialParticipationDTO>>> GetTrialParticipants(int id)
        {
            var participations = await _context.TrialParticipations
                .Where(p => p.ClinicalTrialId == id)
                .Select(p => new TrialParticipationDTO
                {
                    Id = p.Id,
                    PatientId = p.PatientId,
                    ClinicalTrialId = p.ClinicalTrialId,
                    Status = p.Status,
                    EnrollmentDate = p.EnrollmentDate,
                    CompletionDate = p.CompletionDate,
                    WithdrawalDate = p.WithdrawalDate,
                    WithdrawalReason = p.WithdrawalReason,
                    IsEligible = p.IsEligible,
                    EligibilityNotes = p.EligibilityNotes,
                    CurrentVisitNumber = p.CurrentVisitNumber,
                    NextVisitDate = p.NextVisitDate,
                    VisitNotes = p.VisitNotes,
                    HasCompletedAllVisits = p.HasCompletedAllVisits,
                    HasReportedAdverseEvents = p.HasReportedAdverseEvents,
                    AdverseEventDetails = p.AdverseEventDetails,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt
                })
                .ToListAsync();

            return Ok(participations);
        }

        private bool ClinicalTrialExists(int id)
        {
            return _context.ClinicalTrials.Any(e => e.Id == id);
        }
    }
} 