using System;
using System.ComponentModel.DataAnnotations;

namespace Vytall.API.DTOs.Trackers
{
    public class HeartRateDTO
    {
        public int HeartRateId { get; set; }
        public int PatientId { get; set; }
        public string PatientName { get; set; }
        public DateTime ReadingDate { get; set; }
        public int Rate { get; set; }
        public string ArmUsed { get; set; }
        public string? Notes { get; set; }
        public bool IsAfterMeal { get; set; }
        public DateTime? LastMealTime { get; set; }
        public string? MedicationsTaken { get; set; }
        public bool IsAfterExercise { get; set; }
        public string? ExerciseType { get; set; }
        public int? ExerciseDuration { get; set; }
        public bool IsResting { get; set; }
        public bool IsSleeping { get; set; }
    }

    public class CreateHeartRateDTO
    {
        [Required]
        public int PatientId { get; set; }

        [Required]
        [Range(40, 200, ErrorMessage = "Heart rate must be between 40 and 200 bpm")]
        public int Rate { get; set; }

        [Required]
        [StringLength(50)]
        public string ArmUsed { get; set; }

        [StringLength(500)]
        public string? Notes { get; set; }

        public bool IsAfterMeal { get; set; }
        public DateTime? LastMealTime { get; set; }

        [StringLength(100)]
        public string? MedicationsTaken { get; set; }

        public bool IsAfterExercise { get; set; }
        public string? ExerciseType { get; set; }
        public int? ExerciseDuration { get; set; }

        public bool IsResting { get; set; }
        public bool IsSleeping { get; set; }
    }

    public class UpdateHeartRateDTO
    {
        [Range(40, 200, ErrorMessage = "Heart rate must be between 40 and 200 bpm")]
        public int Rate { get; set; }

        [StringLength(50)]
        public string ArmUsed { get; set; }

        [StringLength(500)]
        public string? Notes { get; set; }

        public bool IsAfterMeal { get; set; }
        public DateTime? LastMealTime { get; set; }

        [StringLength(100)]
        public string? MedicationsTaken { get; set; }

        public bool IsAfterExercise { get; set; }
        public string? ExerciseType { get; set; }
        public int? ExerciseDuration { get; set; }

        public bool IsResting { get; set; }
        public bool IsSleeping { get; set; }
    }
} 