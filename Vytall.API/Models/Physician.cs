using System.ComponentModel.DataAnnotations;

namespace Vytall.API.Models
{
    public class Physician
    {
        [Key]
        public int PhysicianId { get; set; }
        
        [Required(ErrorMessage = "First name is required.")]
        [StringLength(100, ErrorMessage = "First name must be at most 100 characters.")]
        public required string FirstName { get; set; }
        
        [Required(ErrorMessage = "Last name is required.")]
        [StringLength(100, ErrorMessage = "Last name must be at most 100 characters.")]
        public required string LastName { get; set; }
        
        [Required(ErrorMessage = "Specialization is required.")]
        [StringLength(100, ErrorMessage = "Specialization must be at most 100 characters.")]
        public required string Specialization { get; set; }
        
        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email address.")]
        public required string Email { get; set; }
        
        [Required(ErrorMessage = "Phone is required.")]
        [Phone(ErrorMessage = "Invalid phone number.")]
        public required string Phone { get; set; }

        public int? FacilityId { get; set; }  // The facility where the physician works
        public MedicalFacility? Facility { get; set; }  // Navigation property
    }
}