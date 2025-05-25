using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vytall.API.Models
{
    public class HeartRate
    {
        [Key]
        public int HeartRateId { get; set; }

        [Required]
        public int PatientId { get; set; }
        public Patient Patient { get; set; }

        [Required]
        public DateTime ReadingDate { get; set; }

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
        public int? ExerciseDuration { get; set; } // in minutes

        public bool IsResting { get; set; }
        public bool IsSleeping { get; set; }
    }
} 