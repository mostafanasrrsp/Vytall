using System.ComponentModel.DataAnnotations;

namespace Vytall.API.DTOs
{
    public class PrescriptionDTO
    {
        public int PrescriptionId { get; set; }
        
        [Required(ErrorMessage = "PatientId is required.")]
        public int PatientId { get; set; }
        
        [Required(ErrorMessage = "PhysicianId is required.")]
        public int PhysicianId { get; set; }
        
        [Required(ErrorMessage = "Medication details are required.")]
        [StringLength(500)]
        public string MedicationDetails { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Dosage is required.")]
        [StringLength(100)]
        public string Dosage { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Frequency is required.")]
        [StringLength(100)]
        public string Frequency { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Issued date is required.")]
        public DateTime IssuedDate { get; set; }
        
        [Required(ErrorMessage = "Expiration date is required.")]
        public DateTime ExpirationDate { get; set; }
        
        public bool IsDispensed { get; set; }
        
        public string? PatientName { get; set; }
        public string? PhysicianName { get; set; }
        public string? Status { get; set; }
    }
} 