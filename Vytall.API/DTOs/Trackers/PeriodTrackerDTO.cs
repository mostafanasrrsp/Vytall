using System;
using System.ComponentModel.DataAnnotations;

namespace Vytall.API.DTOs.Trackers
{
    public class PeriodTrackerDTO
    {
        public int PeriodTrackerId { get; set; }
        public int PatientId { get; set; }
        public string PatientName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string? Notes { get; set; }
        public int? FlowIntensity { get; set; }
        public string? Symptoms { get; set; }
        public bool IsUsingContraception { get; set; }
        public string? ContraceptionType { get; set; }
        public bool IsPregnant { get; set; }
        public bool IsBreastfeeding { get; set; }
        public string? MedicationsTaken { get; set; }
        public int? CycleLength { get; set; }
        public int? PeriodLength { get; set; }
    }

    public class CreatePeriodTrackerDTO
    {
        [Required]
        public int PatientId { get; set; }

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

        [Range(21, 45, ErrorMessage = "Cycle length must be between 21 and 45 days")]
        public int? CycleLength { get; set; }

        [Range(2, 10, ErrorMessage = "Period length must be between 2 and 10 days")]
        public int? PeriodLength { get; set; }
    }

    public class UpdatePeriodTrackerDTO
    {
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

        [Range(21, 45, ErrorMessage = "Cycle length must be between 21 and 45 days")]
        public int? CycleLength { get; set; }

        [Range(2, 10, ErrorMessage = "Period length must be between 2 and 10 days")]
        public int? PeriodLength { get; set; }
    }
} 