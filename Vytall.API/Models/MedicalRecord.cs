using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Vytall.API.Models
{
    public class MedicalRecord
    {
        [Key]
        public int MedicalRecordId { get; set; }

        [Required(ErrorMessage = "PatientId is required.")]
        public int PatientId { get; set; }

        // Navigation property to Patient (optional, if you want to include patient details)
        [ForeignKey("PatientId")]
        public Patient? Patient { get; set; }

        [ForeignKey("PhysicianId")]
        public Physician? Physician { get; set; }

        [Required(ErrorMessage = "Record type is required.")]
        [StringLength(100)]
        public string RecordType { get; set; } = default!;

        [Required(ErrorMessage = "Details are required.")]
        public string Details { get; set; } = default!;

        // For image attachments, store URL(s) or file path(s); for now a simple string field
        public string? ImageUrl { get; set; }

        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;

        public DateTime? RecordDate { get; set; }

        public int? PhysicianId { get; set; }
        public string? PhysicianName { get; set; }
    }
}