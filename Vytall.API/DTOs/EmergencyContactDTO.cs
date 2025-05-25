using System;

namespace Vytall.API.DTOs
{
    public class EmergencyContactDTO
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public string Name { get; set; }
        public string Relationship { get; set; }
        public string PhoneNumber { get; set; }
        public bool IsPrimary { get; set; }
        public string Notes { get; set; }
        public string EmergencyInstructions { get; set; }
        public bool CanMakeMedicalDecisions { get; set; }
        public bool NotifyOnEmergency { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class CreateEmergencyContactDTO
    {
        public string Name { get; set; }
        public string Relationship { get; set; }
        public string PhoneNumber { get; set; }
        public bool IsPrimary { get; set; }
        public string Notes { get; set; }
        public string EmergencyInstructions { get; set; }
        public bool CanMakeMedicalDecisions { get; set; }
        public bool NotifyOnEmergency { get; set; }
    }

    public class UpdateEmergencyContactDTO
    {
        public string Name { get; set; }
        public string Relationship { get; set; }
        public string PhoneNumber { get; set; }
        public bool IsPrimary { get; set; }
        public string Notes { get; set; }
        public string EmergencyInstructions { get; set; }
        public bool CanMakeMedicalDecisions { get; set; }
        public bool NotifyOnEmergency { get; set; }
    }
} 