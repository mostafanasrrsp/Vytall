using System.ComponentModel.DataAnnotations;

namespace Vytall.API.Models
{
   public class User
{
    public int Id { get; set; }

    [Required]
    public string Username { get; set; } = default!;

    [Required]
    public string PasswordHash { get; set; } = default!;

    [Required]
    public string Role { get; set; } = default!; // "Admin", "Physician", "Patient", "Pharmacist", "Facility", "Warehouse"

    // Optional foreign keys based on role
    public int? PatientId { get; set; }  // Null if not a Patient
    public int? PhysicianId { get; set; }  // Null if not a Physician
    public int? PharmacistId { get; set; }  // Null if not a Pharmacist
    public int? FacilityId { get; set; }  // Null if not a Facility
    public int? WarehouseId { get; set; }  // Null if not a Warehouse staff
}
}