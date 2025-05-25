using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Vytall.API.Models
{
    public class MedicalFacility
    {
        [Key]
        public int FacilityId { get; set; }

        [Required(ErrorMessage = "Facility name is required.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Facility type is required (Clinic or Hospital).")]
        public string Type { get; set; } = string.Empty;  // "Clinic" or "Hospital"

        [Required(ErrorMessage = "Facility address is required.")]
        public string Address { get; set; } = string.Empty;

        [Required(ErrorMessage = "Contact phone is required.")]
        [Phone(ErrorMessage = "Enter a valid phone number.")]
        public string Phone { get; set; } = string.Empty;

        [EmailAddress(ErrorMessage = "Please enter a valid email address.")]
        public string? Email { get; set; }

        [Required(ErrorMessage = "Operating hours information is required.")]
        public string OperatingHours { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}