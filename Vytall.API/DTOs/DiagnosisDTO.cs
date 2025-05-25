using System.ComponentModel.DataAnnotations;

namespace Vytall.API.DTOs
{
    public class DiagnosisDTO
    {
        public int DiagnosisId { get; set; }
        
        [Required]
        public int PatientId { get; set; }
        
        [Required]
        public int PhysicianId { get; set; }
        
        public int? AppointmentId { get; set; }
        
        [Required(ErrorMessage = "Diagnosis details are required.")]
        public string Details { get; set; } = string.Empty;
        
        public DateTime DiagnosedOn { get; set; }
    }
} 