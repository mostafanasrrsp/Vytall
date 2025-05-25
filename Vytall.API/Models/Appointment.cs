using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Vytall.API.Models
{
    public class Appointment
    {
        [Key]
        public int AppointmentId { get; set; }

        // Foreign key for Patient
        [Required(ErrorMessage = "PatientId is required.")]
        [ForeignKey("Patient")]
        public int PatientId { get; set; }

        // Navigation property, ignored during deserialization
        [JsonIgnore]
        public Patient? Patient { get; set; }

        // Foreign key for Physician
        [Required(ErrorMessage = "PhysicianId is required.")]
        [ForeignKey("Physician")]
        public int PhysicianId { get; set; }

        // Navigation property, ignored during deserialization
        [JsonIgnore]
        public Physician? Physician { get; set; }

        [ForeignKey("MedicalFacility")]
        public int? FacilityId { get; set; } // Make FacilityId nullable temporarily

        [JsonIgnore]
        public MedicalFacility? MedicalFacility { get; set; }

        [Required(ErrorMessage = "Appointment time is required.")]
        public DateTime AppointmentTime { get; set; }

        [Required(ErrorMessage = "Status is required.")]
        [StringLength(50, ErrorMessage = "Status cannot exceed 50 characters.")]
        public string Status { get; set; } = string.Empty;

        [StringLength(250, ErrorMessage = "Reason cannot exceed 250 characters.")]
        public string? Reason { get; set; }
    }
}