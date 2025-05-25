using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vytall.API.Data;
using Vytall.API.DTOs;
using Vytall.API.Models;

namespace Vytall.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class MedicationAdherenceController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MedicationAdherenceController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("patient/{patientId}")]
        public async Task<ActionResult<AdherenceSummaryDTO>> GetPatientAdherenceSummary(int patientId)
        {
            var adherence = await _context.MedicationAdherence
                .Where(a => a.PatientId == patientId)
                .ToListAsync();

            if (!adherence.Any())
                return NotFound();

            var summary = new AdherenceSummaryDTO
            {
                PatientId = patientId,
                TotalDoses = adherence.Count,
                TakenDoses = adherence.Count(a => a.WasTaken),
                MissedDoses = adherence.Count(a => !a.WasTaken),
                AdherenceRate = adherence.Any() ? 
                    (double)adherence.Count(a => a.WasTaken) / adherence.Count * 100 : 0,
                CurrentStreak = adherence
                    .OrderByDescending(a => a.ScheduledTime)
                    .TakeWhile(a => a.WasTaken)
                    .Count(),
                LongestStreak = adherence
                    .GroupBy(a => a.PrescriptionId)
                    .Select(g => g
                        .OrderBy(a => a.ScheduledTime)
                        .Aggregate(0, (current, next) => 
                            next.WasTaken ? current + 1 : 0))
                    .Max()
            };

            return summary;
        }

        [HttpPost]
        public async Task<ActionResult<MedicationAdherenceDTO>> RecordAdherence(CreateMedicationAdherenceDTO dto)
        {
            var adherence = new MedicationAdherence
            {
                PatientId = dto.PatientId,
                PrescriptionId = dto.PrescriptionId,
                ScheduledTime = dto.ScheduledTime,
                TakenTime = dto.TakenTime,
                WasTaken = dto.WasTaken,
                Notes = dto.Notes
            };

            _context.MedicationAdherence.Add(adherence);
            await _context.SaveChangesAsync();

            // Update streaks
            await UpdateStreaks(adherence.PatientId, adherence.PrescriptionId);

            // Check for achievements
            await CheckAndAwardAchievements(adherence.PatientId);

            return CreatedAtAction(
                nameof(GetAdherence),
                new { id = adherence.Id },
                MapToDTO(adherence));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MedicationAdherenceDTO>> GetAdherence(int id)
        {
            var adherence = await _context.MedicationAdherence.FindAsync(id);
            if (adherence == null)
                return NotFound();

            return MapToDTO(adherence);
        }

        [HttpGet("patient/{patientId}/achievements")]
        public async Task<ActionResult<List<AchievementDTO>>> GetPatientAchievements(int patientId)
        {
            var achievements = await _context.Achievements
                .Where(a => a.PatientId == patientId)
                .Select(a => new AchievementDTO
                {
                    Id = a.Id,
                    PatientId = a.PatientId,
                    Name = a.Name,
                    Description = a.Description,
                    Icon = a.Icon,
                    Progress = a.Progress,
                    Target = a.Target,
                    IsUnlocked = a.IsUnlocked,
                    UnlockedAt = a.UnlockedAt,
                    CreatedAt = a.CreatedAt,
                    UpdatedAt = a.UpdatedAt
                })
                .ToListAsync();

            return achievements;
        }

        [HttpGet("patient/{patientId}/badges")]
        public async Task<ActionResult<List<BadgeDTO>>> GetPatientBadges(int patientId)
        {
            var badges = await _context.Badges
                .Where(b => b.PatientId == patientId)
                .Select(b => new BadgeDTO
                {
                    Id = b.Id,
                    PatientId = b.PatientId,
                    Name = b.Name,
                    Description = b.Description,
                    Icon = b.Icon,
                    IsUnlocked = b.IsUnlocked,
                    UnlockedAt = b.UnlockedAt,
                    CreatedAt = b.CreatedAt,
                    UpdatedAt = b.UpdatedAt
                })
                .ToListAsync();

            return badges;
        }

        [HttpPost("achievements/{id}/progress")]
        public async Task<ActionResult<AchievementDTO>> UpdateAchievementProgress(
            int id, UpdateAchievementProgressDTO dto)
        {
            var achievement = await _context.Achievements.FindAsync(id);
            if (achievement == null)
                return NotFound();

            achievement.Progress = dto.Progress;
            if (achievement.Progress >= achievement.Target && !achievement.IsUnlocked)
            {
                achievement.IsUnlocked = true;
                achievement.UnlockedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();

            return MapToDTO(achievement);
        }

        [HttpPost("badges/{id}/unlock")]
        public async Task<ActionResult<BadgeDTO>> UnlockBadge(int id, UnlockBadgeDTO dto)
        {
            var badge = await _context.Badges.FindAsync(id);
            if (badge == null)
                return NotFound();

            badge.IsUnlocked = true;
            badge.UnlockedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return MapToDTO(badge);
        }

        private async Task UpdateStreaks(int patientId, int prescriptionId)
        {
            var adherence = await _context.MedicationAdherence
                .Where(a => a.PatientId == patientId && a.PrescriptionId == prescriptionId)
                .OrderByDescending(a => a.ScheduledTime)
                .ToListAsync();

            var currentStreak = 0;
            var longestStreak = 0;
            var tempStreak = 0;

            foreach (var record in adherence)
            {
                if (record.WasTaken)
                {
                    tempStreak++;
                    if (tempStreak > longestStreak)
                        longestStreak = tempStreak;
                }
                else
                {
                    tempStreak = 0;
                }

                if (record == adherence.First())
                    currentStreak = tempStreak;
            }

            var streak = await _context.AdherenceStreaks
                .FirstOrDefaultAsync(s => s.PatientId == patientId && s.PrescriptionId == prescriptionId);

            if (streak == null)
            {
                streak = new AdherenceStreak
                {
                    PatientId = patientId,
                    PrescriptionId = prescriptionId,
                    CurrentStreak = currentStreak,
                    LongestStreak = longestStreak
                };
                _context.AdherenceStreaks.Add(streak);
            }
            else
            {
                streak.CurrentStreak = currentStreak;
                streak.LongestStreak = longestStreak;
            }

            await _context.SaveChangesAsync();
        }

        private async Task CheckAndAwardAchievements(int patientId)
        {
            var adherence = await _context.MedicationAdherence
                .Where(a => a.PatientId == patientId)
                .ToListAsync();

            var streaks = await _context.AdherenceStreaks
                .Where(s => s.PatientId == patientId)
                .ToListAsync();

            // Check for streak achievements
            foreach (var streak in streaks)
            {
                if (streak.CurrentStreak >= 7) // 7-day streak
                {
                    await AwardAchievement(patientId, "7 Day Streak", 
                        "Maintained medication adherence for 7 consecutive days", 
                        "streak-7", streak.CurrentStreak, 7);
                }
                if (streak.CurrentStreak >= 30) // 30-day streak
                {
                    await AwardAchievement(patientId, "30 Day Streak", 
                        "Maintained medication adherence for 30 consecutive days", 
                        "streak-30", streak.CurrentStreak, 30);
                }
            }

            // Check for total doses achievements
            var totalDoses = adherence.Count;
            if (totalDoses >= 50) // 50 total doses
            {
                await AwardAchievement(patientId, "50 Doses", 
                    "Taken 50 total doses of medication", 
                    "doses-50", totalDoses, 50);
            }
            if (totalDoses >= 100) // 100 total doses
            {
                await AwardAchievement(patientId, "100 Doses", 
                    "Taken 100 total doses of medication", 
                    "doses-100", totalDoses, 100);
            }

            // Check for adherence rate achievements
            var adherenceRate = adherence.Any() ? 
                (double)adherence.Count(a => a.WasTaken) / adherence.Count * 100 : 0;
            if (adherenceRate >= 90) // 90% adherence
            {
                await AwardAchievement(patientId, "90% Adherence", 
                    "Maintained 90% or higher adherence rate", 
                    "adherence-90", adherenceRate, 90);
            }
        }

        private async Task AwardAchievement(
            int patientId, string name, string description, 
            string icon, double progress, double target)
        {
            var achievement = await _context.Achievements
                .FirstOrDefaultAsync(a => 
                    a.PatientId == patientId && 
                    a.Name == name);

            if (achievement == null)
            {
                achievement = new Achievement
                {
                    PatientId = patientId,
                    Name = name,
                    Description = description,
                    Icon = icon,
                    Progress = progress,
                    Target = target,
                    IsUnlocked = progress >= target,
                    UnlockedAt = progress >= target ? DateTime.UtcNow : null
                };
                _context.Achievements.Add(achievement);
            }
            else if (!achievement.IsUnlocked && progress >= target)
            {
                achievement.Progress = progress;
                achievement.IsUnlocked = true;
                achievement.UnlockedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
        }

        private static MedicationAdherenceDTO MapToDTO(MedicationAdherence adherence)
        {
            return new MedicationAdherenceDTO
            {
                Id = adherence.Id,
                PatientId = adherence.PatientId,
                PrescriptionId = adherence.PrescriptionId,
                ScheduledTime = adherence.ScheduledTime,
                TakenTime = adherence.TakenTime,
                WasTaken = adherence.WasTaken,
                Notes = adherence.Notes,
                CreatedAt = adherence.CreatedAt,
                UpdatedAt = adherence.UpdatedAt
            };
        }

        private static AchievementDTO MapToDTO(Achievement achievement)
        {
            return new AchievementDTO
            {
                Id = achievement.Id,
                PatientId = achievement.PatientId,
                Name = achievement.Name,
                Description = achievement.Description,
                Icon = achievement.Icon,
                Progress = achievement.Progress,
                Target = achievement.Target,
                IsUnlocked = achievement.IsUnlocked,
                UnlockedAt = achievement.UnlockedAt,
                CreatedAt = achievement.CreatedAt,
                UpdatedAt = achievement.UpdatedAt
            };
        }

        private static BadgeDTO MapToDTO(Badge badge)
        {
            return new BadgeDTO
            {
                Id = badge.Id,
                PatientId = badge.PatientId,
                Name = badge.Name,
                Description = badge.Description,
                Icon = badge.Icon,
                IsUnlocked = badge.IsUnlocked,
                UnlockedAt = badge.UnlockedAt,
                CreatedAt = badge.CreatedAt,
                UpdatedAt = badge.UpdatedAt
            };
        }
    }
} 