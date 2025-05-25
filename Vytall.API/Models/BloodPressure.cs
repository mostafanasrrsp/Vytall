using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vytall.API.Models
{
    public class BloodPressure
    {
        [Key]
        public int BloodPressureId { get; set; }

        [Required]
        public int PatientId { get; set; }
        public Patient Patient { get; set; }

        [Required]
        public DateTime ReadingDate { get; set; }

        [Required]
        [Range(60, 250, ErrorMessage = "Systolic pressure must be between 60 and 250 mmHg")]
        public int Systolic { get; set; }

        [Required]
        [Range(40, 150, ErrorMessage = "Diastolic pressure must be between 40 and 150 mmHg")]
        public int Diastolic { get; set; }

        [Required]
        [Range(40, 200, ErrorMessage = "Heart rate must be between 40 and 200 bpm")]
        public int HeartRate { get; set; }

        [StringLength(50)]
        public string? ArmUsed { get; set; }

        [StringLength(500)]
        public string? Notes { get; set; }

        public bool IsAfterMeal { get; set; }
        public bool IsAfterExercise { get; set; }
        public bool IsAfterMedication { get; set; }

        [StringLength(100)]
        public string? MedicationTaken { get; set; }
    }
} 