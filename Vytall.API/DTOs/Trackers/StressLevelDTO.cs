using System;
using System.ComponentModel.DataAnnotations;

namespace Vytall.API.DTOs.Trackers
{
    public class StressLevelDTO
    {
        public int StressLevelId { get; set; }
        public int PatientId { get; set; }
        public string PatientName { get; set; }
        public DateTime ReadingDate { get; set; }
        public int Level { get; set; }
        public string? Notes { get; set; }
        public string? Trigger { get; set; }
        public string? CopingMechanism { get; set; }
        public bool IsAfterExercise { get; set; }
        public bool IsAfterMeditation { get; set; }
        public bool IsAfterSleep { get; set; }
        public string? MedicationsTaken { get; set; }
        public int? SleepHours { get; set; }
        public bool IsWorkDay { get; set; }
    }

    public class CreateStressLevelDTO
    {
        [Required]
        public int PatientId { get; set; }

        [Required]
        [Range(1, 10, ErrorMessage = "Stress level must be between 1 and 10")]
        public int Level { get; set; }

        [StringLength(500)]
        public string? Notes { get; set; }

        [StringLength(100)]
        public string? Trigger { get; set; }

        [StringLength(100)]
        public string? CopingMechanism { get; set; }

        public bool IsAfterExercise { get; set; }
        public bool IsAfterMeditation { get; set; }
        public bool IsAfterSleep { get; set; }

        [StringLength(100)]
        public string? MedicationsTaken { get; set; }

        [Range(0, 24, ErrorMessage = "Sleep hours must be between 0 and 24")]
        public int? SleepHours { get; set; }

        public bool IsWorkDay { get; set; }
    }

    public class UpdateStressLevelDTO
    {
        [Range(1, 10, ErrorMessage = "Stress level must be between 1 and 10")]
        public int Level { get; set; }

        [StringLength(500)]
        public string? Notes { get; set; }

        [StringLength(100)]
        public string? Trigger { get; set; }

        [StringLength(100)]
        public string? CopingMechanism { get; set; }

        public bool IsAfterExercise { get; set; }
        public bool IsAfterMeditation { get; set; }
        public bool IsAfterSleep { get; set; }

        [StringLength(100)]
        public string? MedicationsTaken { get; set; }

        [Range(0, 24, ErrorMessage = "Sleep hours must be between 0 and 24")]
        public int? SleepHours { get; set; }

        public bool IsWorkDay { get; set; }
    }
} 