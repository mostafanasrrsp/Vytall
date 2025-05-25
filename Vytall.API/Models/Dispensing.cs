using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Vytall.API.Models
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
}