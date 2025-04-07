using System.ComponentModel.DataAnnotations;

namespace MedConnect.API.Models
{
    public class Pharmacy
    {
        [Key]
        public int PharmacyId { get; set; }

        [Required(ErrorMessage = "Pharmacy name is required.")]
        [StringLength(200, ErrorMessage = "Pharmacy name must be at most 200 characters.")]
        public required string PharmacyName { get; set; }

        [Required(ErrorMessage = "Address is required.")]
        [StringLength(300, ErrorMessage = "Address must be at most 300 characters.")]
        public required string Address { get; set; }

        [Required(ErrorMessage = "Phone is required.")]
        [Phone(ErrorMessage = "Invalid phone number.")]
        public required string Phone { get; set; }

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email address.")]
        public required string Email { get; set; }

        // Optional relationship (future proof)
        public ICollection<Pharmacist>? Pharmacists { get; set; }
    }
}