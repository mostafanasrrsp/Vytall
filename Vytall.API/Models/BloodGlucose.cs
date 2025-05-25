using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vytall.API.Models
{
    public class BloodGlucose
    {
        [Key]
        public int BloodGlucoseId { get; set; }

        [Required]
        public int PatientId { get; set; }
        public Patient Patient { get; set; }

        [Required]
        public DateTime ReadingDate { get; set; }

        [Required]
        [Range(40, 600, ErrorMessage = "Blood glucose must be between 40 and 600 mg/dL")]
        public int GlucoseLevel { get; set; }

        [Required]
        public ReadingType Type { get; set; }

        [StringLength(500)]
        public string? Notes { get; set; }

        public bool IsBeforeMeal { get; set; }
        public bool IsAfterMeal { get; set; }
        public DateTime? LastMealTime { get; set; }

        [StringLength(100)]
        public string? MedicationsTaken { get; set; }

        public bool IsAfterExercise { get; set; }
        public string? ExerciseType { get; set; }
        public int? ExerciseDuration { get; set; } // in minutes
    }

    public enum ReadingType
    {
        Fasting,
        BeforeMeal,
        AfterMeal,
        BeforeBed,
        Random
    }
} 