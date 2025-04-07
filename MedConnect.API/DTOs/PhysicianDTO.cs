using System.ComponentModel.DataAnnotations;

namespace MedConnect.API.DTOs
{
    public class PhysicianDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Specialty { get; set; } = string.Empty;
        public string Contact { get; set; } = string.Empty;
        public int? FacilityId { get; set; }
    }

    public class CreatePhysicianDTO
{
    [Required]
    public required string FirstName { get; set; }

    [Required]
    public required string LastName { get; set; }

    [Required]
    public required string Specialization { get; set; }

    [Required, EmailAddress]
    public required string Email { get; set; }

    [Required, Phone]
    public required string Phone { get; set; }
}
public class UpdatePhysicianDTO
{
    [Required]
    public required string FirstName { get; set; }

    [Required]
    public required string LastName { get; set; }

    [Required]
    public required string Specialization { get; set; }

    [Required, EmailAddress]
    public required string Email { get; set; }

    [Required, Phone]
    public required string Phone { get; set; }
}
}

