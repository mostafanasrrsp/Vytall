using System;
using System.Collections.Generic;

namespace Vytall.API.DTOs
{
    public class MedicationAdherenceDTO
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public int PrescriptionId { get; set; }
        public DateTime ScheduledTime { get; set; }
        public DateTime? TakenTime { get; set; }
        public bool WasTaken { get; set; }
        public bool WasOnTime { get; set; }
        public string Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class CreateMedicationAdherenceDTO
    {
        public int PatientId { get; set; }
        public int PrescriptionId { get; set; }
        public DateTime ScheduledTime { get; set; }
        public DateTime? TakenTime { get; set; }
        public bool WasTaken { get; set; }
        public string Notes { get; set; }
    }

    public class AdherenceStreakDTO
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public int CurrentStreak { get; set; }
        public int LongestStreak { get; set; }
        public DateTime LastDoseDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class AchievementDTO
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Icon { get; set; }
        public double Progress { get; set; }
        public double Target { get; set; }
        public bool IsUnlocked { get; set; }
        public DateTime? UnlockedAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class BadgeDTO
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Icon { get; set; }
        public bool IsUnlocked { get; set; }
        public DateTime? UnlockedAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class AdherenceSummaryDTO
    {
        public int PatientId { get; set; }
        public int TotalDoses { get; set; }
        public int TakenDoses { get; set; }
        public int MissedDoses { get; set; }
        public double AdherenceRate { get; set; }
        public int CurrentStreak { get; set; }
        public int LongestStreak { get; set; }
    }

    public class UpdateAchievementProgressDTO
    {
        public double Progress { get; set; }
    }

    public class UnlockBadgeDTO
    {
        // No properties needed for now, but we can add validation or additional data if needed
    }
} 