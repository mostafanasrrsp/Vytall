using System.ComponentModel.DataAnnotations;

namespace Vytall.API.DTOs
{
    public class MedicalFacilityDTO
    {
        public int FacilityId { get; set; } // Needed for edit operations

        [Required(ErrorMessage = "Facility name is required.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Facility type is required (Clinic or Hospital).")]
        public string Type { get; set; } = string.Empty;

        [Required(ErrorMessage = "Facility address is required.")]
        public string Address { get; set; } = string.Empty;

        [Required(ErrorMessage = "Contact phone is required.")]
        [Phone(ErrorMessage = "Enter a valid phone number.")]
        public string Phone { get; set; } = string.Empty;

        [EmailAddress(ErrorMessage = "Please enter a valid email address.")]
        public string? Email { get; set; }

        [Required(ErrorMessage = "Operating hours information is required.")]
        public string OperatingHours { get; set; } = string.Empty;
    }
}