using System.ComponentModel.DataAnnotations;

namespace Vytall.API.Models
{
    public class Pharmacy
    {
        [Key]
        public int PharmacyId { get; set; }

        [Required(ErrorMessage = "Pharmacy name is required.")]
        [StringLength(200, ErrorMessage = "Pharmacy name must be at most 200 characters.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Address is required.")]
        [StringLength(300, ErrorMessage = "Address must be at most 300 characters.")]
        public string Address { get; set; } = string.Empty;

        [Required(ErrorMessage = "Phone is required.")]
        [Phone(ErrorMessage = "Invalid phone number.")]
        [StringLength(20)]
        public string Phone { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email address.")]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Facility ID is required.")]
        public int FacilityId { get; set; }
        public MedicalFacility? Facility { get; set; }  // Navigation property

        // Navigation property
        public ICollection<Pharmacist>? Pharmacists { get; set; }
    }
}