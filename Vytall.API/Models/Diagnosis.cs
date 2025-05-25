using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Vytall.API.Models
{
    public class Diagnosis
    {
        [Key]
        public int DiagnosisId { get; set; }

        [ForeignKey("Patient")]
        public int PatientId { get; set; }
        public Patient? Patient { get; set; }

        [ForeignKey("Physician")]
        public int PhysicianId { get; set; }
        public Physician? Physician { get; set; }

        // Optional: Appointment reference, nullable
        [ForeignKey("Appointment")]
        public int? AppointmentId { get; set; }
        public Appointment? Appointment { get; set; }

        [Required(ErrorMessage = "Diagnosis details are required.")]
        [StringLength(1000, ErrorMessage = "Diagnosis cannot exceed 1000 characters.")]
        public required string Details { get; set; }

        public DateTime DiagnosedOn { get; set; } = DateTime.UtcNow;
    }
}