using System.ComponentModel.DataAnnotations;

namespace MedConnect.API.Models
{
    public class Pharmacist
    {
        [Key]
        public int PharmacistId { get; set; }
        
        [Required(ErrorMessage = "First name is required.")]
        [StringLength(100, ErrorMessage = "First name must be at most 100 characters.")]
        public string FirstName { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Last name is required.")]
        [StringLength(100, ErrorMessage = "Last name must be at most 100 characters.")]
        public string LastName { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email address.")]
        public required string Email { get; set; }
        
        [Required(ErrorMessage = "Phone is required.")]
        [Phone(ErrorMessage = "Invalid phone number.")]
        public required string Phone { get; set; }    

        public int? FacilityId { get; set; }  // The facility where the pharmacist works
        public MedicalFacility? Facility { get; set; }  // Navigation property
    }
}