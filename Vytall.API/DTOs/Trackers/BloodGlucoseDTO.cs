using System;
using System.ComponentModel.DataAnnotations;
using Vytall.API.Models;

namespace Vytall.API.DTOs.Trackers
{
    public class BloodGlucoseDTO
    {
        public int BloodGlucoseId { get; set; }
        public int PatientId { get; set; }
        public string PatientName { get; set; }
        public DateTime ReadingDate { get; set; }
        public int GlucoseLevel { get; set; }
        public ReadingType Type { get; set; }
        public string? Notes { get; set; }
        public bool IsBeforeMeal { get; set; }
        public bool IsAfterMeal { get; set; }
        public DateTime? LastMealTime { get; set; }
        public string? MedicationsTaken { get; set; }
        public bool IsAfterExercise { get; set; }
        public string? ExerciseType { get; set; }
        public int? ExerciseDuration { get; set; }
    }

    public class CreateBloodGlucoseDTO
    {
        [Required]
        public int PatientId { get; set; }

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
        public int? ExerciseDuration { get; set; }
    }

    public class UpdateBloodGlucoseDTO
    {
        [Range(40, 600, ErrorMessage = "Blood glucose must be between 40 and 600 mg/dL")]
        public int GlucoseLevel { get; set; }

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
        public int? ExerciseDuration { get; set; }
    }
} 