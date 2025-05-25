using System;
using System.ComponentModel.DataAnnotations;

namespace Vytall.API.DTOs
{
    public class OTCMedicationDTO
    {
        public int OTCMedicationId { get; set; }
        public int PatientId { get; set; }
        public string PatientName { get; set; } = string.Empty;
        public string MedicationName { get; set; } = string.Empty;
        public string Dosage { get; set; } = string.Empty;
        public string Frequency { get; set; } = string.Empty;
        public string StartDate { get; set; } = string.Empty;
        public string? EndDate { get; set; }
        public string? Reason { get; set; }
        public string? Notes { get; set; }
        public bool IsActive { get; set; }
    }

    public class CreateOTCMedicationDTO
    {
        [Required]
        public int PatientId { get; set; }

        [Required]
        [StringLength(200)]
        public string MedicationName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Dosage { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Frequency { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Reason { get; set; }

        [StringLength(500)]
        public string? Notes { get; set; }
    }

    public class UpdateOTCMedicationDTO
    {
        [StringLength(200)]
        public string MedicationName { get; set; } = string.Empty;

        [StringLength(100)]
        public string Dosage { get; set; } = string.Empty;

        [StringLength(100)]
        public string Frequency { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Reason { get; set; }

        [StringLength(500)]
        public string? Notes { get; set; }

        public bool IsActive { get; set; }
        
        public DateTime? EndDate { get; set; }
    }
} 