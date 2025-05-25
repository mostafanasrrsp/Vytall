using System.ComponentModel.DataAnnotations;

namespace Vytall.API.Models
{
    public class Pharmacist
    {
        [Key]
        public int PharmacistId { get; set; }
        
        [Required(ErrorMessage = "First name is required.")]
        [StringLength(50, ErrorMessage = "First name must be at most 50 characters.")]
        public string FirstName { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Last name is required.")]
        [StringLength(50, ErrorMessage = "Last name must be at most 50 characters.")]
        public string LastName { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email address.")]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Phone is required.")]
        [Phone(ErrorMessage = "Invalid phone number.")]
        [StringLength(20)]
        public string Phone { get; set; } = string.Empty;

        [Required(ErrorMessage = "License number is required.")]
        [StringLength(50)]
        public string LicenseNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "Pharmacy ID is required.")]
        public int PharmacyId { get; set; }
        public Pharmacy? Pharmacy { get; set; }  // Navigation property
    }
}