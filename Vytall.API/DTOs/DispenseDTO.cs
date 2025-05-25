using System.ComponentModel.DataAnnotations;

namespace Vytall.API.DTOs
{
    public class DispenseDTO
    {
        public int DispensingId { get; set; }
        
        [Required(ErrorMessage = "PrescriptionId is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "PrescriptionId must be a positive integer.")]
        public int PrescriptionId { get; set; }
        
        [Required]
        public int PharmacistId { get; set; }
        
        [Required(ErrorMessage = "Quantity is required.")]
        [Range(1, 1000, ErrorMessage = "Quantity must be at least 1.")]
        public int Quantity { get; set; }
        
        [StringLength(250, ErrorMessage = "Dispensing notes cannot exceed 250 characters.")]
        public string? DispensingNotes { get; set; }
        
        public DateTime DispensingDate { get; set; }
    }
} 