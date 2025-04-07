using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace MedConnect.API.Models
{
       public class Dispensing
    {
        [Key]
        public int Id { get; set; }

        // Foreign Key for Pharmacist
        [ForeignKey("Pharmacist")]
        public int PharmacistId { get; set; }
        public Pharmacist? Pharmacist { get; set; }  // Nullable to avoid initialization issues

        // Foreign Key for Prescription
        [ForeignKey("Prescription")]
        public int PrescriptionId { get; set; }
        public Prescription? Prescription { get; set; }  // Nullable to avoid initialization issues

        [Required]
        public DateTime DispensedOn { get; set; } = DateTime.UtcNow;

        [StringLength(250)]
        public string? Notes { get; set; } = string.Empty;  // Initialized to empty string to avoid null warning

        [Required]
    [Range(1, 1000)]
    public int Quantity { get; set; }
    }

 
public class DispenseDTO
{
    [Required]
    public int PharmacistId { get; set; }  // ✅ NEW: Pharmacist ID passed directly

    [Required(ErrorMessage = "PrescriptionId is required.")]
    [Range(1, int.MaxValue, ErrorMessage = "PrescriptionId must be a positive integer.")]
    public int PrescriptionId { get; set; }

    [Required(ErrorMessage = "Quantity is required.")]
    [Range(1, 1000, ErrorMessage = "Quantity must be at least 1.")]
    public int Quantity { get; set; }

    [StringLength(250, ErrorMessage = "Dispensing notes cannot exceed 250 characters.")]
    public string? DispensingNotes { get; set; } // ✅ Nullable
}

}