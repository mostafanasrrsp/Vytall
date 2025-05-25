namespace Vytall.API.DTOs
{
    public class MedicalRecordDTO
    {
        public int MedicalRecordId { get; set; }
        public int PatientId { get; set; }
        public string RecordType { get; set; } = default!;
        public string Details { get; set; } = default!;
        public string? ImageUrl { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime? RecordDate { get; set; }

        public int? PhysicianId { get; set; } 
    public string? PhysicianName { get; set; } 
    }
}