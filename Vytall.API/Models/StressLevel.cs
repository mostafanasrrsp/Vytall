using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vytall.API.Models
{
    public class StressLevel
    {
        [Key]
        public int StressLevelId { get; set; }

        [Required]
        public int PatientId { get; set; }
        public Patient Patient { get; set; }

        [Required]
        public DateTime ReadingDate { get; set; }

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

        public int? SleepHours { get; set; }
        public bool IsWorkDay { get; set; }
    }
} 