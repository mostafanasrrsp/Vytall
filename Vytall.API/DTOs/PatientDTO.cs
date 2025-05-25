namespace Vytall.API.DTOs
{
    public class PatientDTO
    {
        public int Id { get; set; } // ✅ Expose only necessary ID
        public string Name { get; set; } = string.Empty; // ✅ Full name
        public string Contact { get; set; } = string.Empty; // ✅ Email | Phone
        public string DateOfBirth { get; set; } = string.Empty; // As string for frontend formatting
        public string? MedicalHistory { get; set; } // Optional
    }

    public class CreatePatientDTO
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        public required string Phone { get; set; }
        public required DateTime DateOfBirth { get; set; }
        public string? MedicalHistory { get; set; }
    }

    public class UpdatePatientDTO
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        public required string Phone { get; set; }
        public required DateTime DateOfBirth { get; set; }
        public string? MedicalHistory { get; set; }
    }
}