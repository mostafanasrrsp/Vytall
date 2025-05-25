namespace Vytall.API.DTOs
{
    public class AppointmentDTO
    {
        public int AppointmentId { get; set; }

        public int PatientId { get; set; }

        public int PhysicianId { get; set; }

        public int? FacilityId { get; set; } // Nullable for optional facility
        
        public string? PhysicianName { get; set; }

        public string? PatientName { get; set; } // <-- new


        public string AppointmentTime { get; set; } = string.Empty; // ISO 8601 String

        public string Status { get; set; } = string.Empty;

        public string? Reason { get; set; } // Optional field
    }
}