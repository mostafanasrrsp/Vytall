using System;
using System.ComponentModel.DataAnnotations;

namespace MedConnect.API.Models
{
    public class Patient
    {
        [Key]
        public int PatientId { get; set; }
        
        [Required(ErrorMessage = "First name is required.")]
        [StringLength(100, ErrorMessage = "First name must be at most 100 characters.")]
        public required string FirstName { get; set; }
        
        [Required(ErrorMessage = "Last name is required.")]
        [StringLength(100, ErrorMessage = "Last name must be at most 100 characters.")]
        public required string LastName { get; set; }
        
        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email address.")]
        public required string Email { get; set; }
        
        [Required(ErrorMessage = "Phone number is required.")]
        [Phone(ErrorMessage = "Invalid phone number.")]
        public required string Phone { get; set; }
        
        [Required(ErrorMessage = "Date of birth is required.")]
        public DateTime DateOfBirth { get; set; }
        
        [StringLength(500, ErrorMessage = "Medical history must be at most 500 characters.")]
        public string? MedicalHistory { get; set; }

        public int? FacilityId { get; set; }  // The facility where the patient is registered
        public MedicalFacility? Facility { get; set; }  // Navigation property
    }
}