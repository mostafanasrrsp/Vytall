using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vytall.API.Models
{
    public class PeriodTracker
    {
        [Key]
        public int PeriodTrackerId { get; set; }

        [Required]
        public int PatientId { get; set; }
        public Patient Patient { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [StringLength(500)]
        public string? Notes { get; set; }

        [Range(1, 10, ErrorMessage = "Flow intensity must be between 1 and 10")]
        public int? FlowIntensity { get; set; }

        [StringLength(100)]
        public string? Symptoms { get; set; }

        public bool IsUsingContraception { get; set; }
        public string? ContraceptionType { get; set; }

        public bool IsPregnant { get; set; }
        public bool IsBreastfeeding { get; set; }

        [StringLength(100)]
        public string? MedicationsTaken { get; set; }

        public int? CycleLength { get; set; } // in days
        public int? PeriodLength { get; set; } // in days
    }
} 