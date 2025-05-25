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
    public class TrialParticipationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TrialParticipationsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/TrialParticipations/patient/{patientId}
        [HttpGet("patient/{patientId}")]
        public async Task<ActionResult<IEnumerable<TrialParticipationDTO>>> GetPatientParticipations(int patientId)
        {
            // Verify ownership or healthcare provider access
            var isHealthcareProvider = User.IsInRole("HealthcareProvider");
            var isAdmin = User.IsInRole("Admin");
            var currentPatientId = int.Parse(User.FindFirst("PatientId")?.Value);

            if (!isHealthcareProvider && !isAdmin && currentPatientId != patientId)
            {
                return Forbid();
            }

            var participations = await _context.TrialParticipations
                .Where(p => p.PatientId == patientId)
                .Include(p => p.ClinicalTrial)
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

        // GET: api/TrialParticipations/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<TrialParticipationDTO>> GetTrialParticipation(int id)
        {
            var participation = await _context.TrialParticipations
                .Include(p => p.ClinicalTrial)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (participation == null)
            {
                return NotFound();
            }

            // Verify ownership or healthcare provider access
            var isHealthcareProvider = User.IsInRole("HealthcareProvider");
            var isAdmin = User.IsInRole("Admin");
            var currentPatientId = int.Parse(User.FindFirst("PatientId")?.Value);

            if (!isHealthcareProvider && !isAdmin && currentPatientId != participation.PatientId)
            {
                return Forbid();
            }

            return new TrialParticipationDTO
            {
                Id = participation.Id,
                PatientId = participation.PatientId,
                ClinicalTrialId = participation.ClinicalTrialId,
                Status = participation.Status,
                EnrollmentDate = participation.EnrollmentDate,
                CompletionDate = participation.CompletionDate,
                WithdrawalDate = participation.WithdrawalDate,
                WithdrawalReason = participation.WithdrawalReason,
                IsEligible = participation.IsEligible,
                EligibilityNotes = participation.EligibilityNotes,
                CurrentVisitNumber = participation.CurrentVisitNumber,
                NextVisitDate = participation.NextVisitDate,
                VisitNotes = participation.VisitNotes,
                HasCompletedAllVisits = participation.HasCompletedAllVisits,
                HasReportedAdverseEvents = participation.HasReportedAdverseEvents,
                AdverseEventDetails = participation.AdverseEventDetails,
                CreatedAt = participation.CreatedAt,
                UpdatedAt = participation.UpdatedAt
            };
        }

        // POST: api/TrialParticipations
        [HttpPost]
        [Authorize(Roles = "Admin,HealthcareProvider")]
        public async Task<ActionResult<TrialParticipationDTO>> CreateTrialParticipation(CreateTrialParticipationDTO dto)
        {
            // Verify trial exists and is active
            var trial = await _context.ClinicalTrials.FindAsync(dto.ClinicalTrialId);
            if (trial == null || !trial.IsActive)
            {
                return BadRequest("Clinical trial not found or inactive");
            }

            // Check if patient is already participating
            var existingParticipation = await _context.TrialParticipations
                .FirstOrDefaultAsync(p => p.PatientId == dto.PatientId && p.ClinicalTrialId == dto.ClinicalTrialId);

            if (existingParticipation != null)
            {
                return BadRequest("Patient is already participating in this trial");
            }

            var participation = new TrialParticipation
            {
                PatientId = dto.PatientId,
                ClinicalTrialId = dto.ClinicalTrialId,
                Status = dto.Status,
                EnrollmentDate = DateTime.UtcNow,
                EligibilityNotes = dto.EligibilityNotes,
                IsEligible = true,
                CurrentVisitNumber = 1,
                CreatedAt = DateTime.UtcNow
            };

            _context.TrialParticipations.Add(participation);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTrialParticipation), new { id = participation.Id }, new TrialParticipationDTO
            {
                Id = participation.Id,
                PatientId = participation.PatientId,
                ClinicalTrialId = participation.ClinicalTrialId,
                Status = participation.Status,
                EnrollmentDate = participation.EnrollmentDate,
                CompletionDate = participation.CompletionDate,
                WithdrawalDate = participation.WithdrawalDate,
                WithdrawalReason = participation.WithdrawalReason,
                IsEligible = participation.IsEligible,
                EligibilityNotes = participation.EligibilityNotes,
                CurrentVisitNumber = participation.CurrentVisitNumber,
                NextVisitDate = participation.NextVisitDate,
                VisitNotes = participation.VisitNotes,
                HasCompletedAllVisits = participation.HasCompletedAllVisits,
                HasReportedAdverseEvents = participation.HasReportedAdverseEvents,
                AdverseEventDetails = participation.AdverseEventDetails,
                CreatedAt = participation.CreatedAt,
                UpdatedAt = participation.UpdatedAt
            });
        }

        // PUT: api/TrialParticipations/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,HealthcareProvider")]
        public async Task<IActionResult> UpdateTrialParticipation(int id, UpdateTrialParticipationDTO dto)
        {
            var participation = await _context.TrialParticipations.FindAsync(id);

            if (participation == null)
            {
                return NotFound();
            }

            participation.Status = dto.Status;
            participation.VisitNotes = dto.VisitNotes;
            participation.CurrentVisitNumber = dto.CurrentVisitNumber;
            participation.NextVisitDate = dto.NextVisitDate;
            participation.HasCompletedAllVisits = dto.HasCompletedAllVisits;
            participation.HasReportedAdverseEvents = dto.HasReportedAdverseEvents;
            participation.AdverseEventDetails = dto.AdverseEventDetails;
            participation.WithdrawalDate = dto.WithdrawalDate;
            participation.WithdrawalReason = dto.WithdrawalReason;
            participation.UpdatedAt = DateTime.UtcNow;

            if (dto.Status == "Completed")
            {
                participation.CompletionDate = DateTime.UtcNow;
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TrialParticipationExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/TrialParticipations/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,HealthcareProvider")]
        public async Task<IActionResult> DeleteTrialParticipation(int id)
        {
            var participation = await _context.TrialParticipations.FindAsync(id);

            if (participation == null)
            {
                return NotFound();
            }

            participation.Status = "Withdrawn";
            participation.WithdrawalDate = DateTime.UtcNow;
            participation.WithdrawalReason = "Withdrawn by healthcare provider";
            participation.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TrialParticipationExists(int id)
        {
            return _context.TrialParticipations.Any(e => e.Id == id);
        }
    }
} 