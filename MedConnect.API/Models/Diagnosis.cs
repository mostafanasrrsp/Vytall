using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MedConnect.API.Models
{
    public class Diagnosis
    {
        [Key]
        public int DiagnosisId { get; set; }

        [ForeignKey("Patient")]
        public int PatientId { get; set; }
        public Patient? Patient { get; set; }

        [ForeignKey("Physician")]
        public int PhysicianId { get; set; }
        public Physician? Physician { get; set; }

        // Optional: Appointment reference, nullable
        [ForeignKey("Appointment")]
        public int? AppointmentId { get; set; }
        public Appointment? Appointment { get; set; }

        [Required(ErrorMessage = "Diagnosis details are required.")]
        [StringLength(1000, ErrorMessage = "Diagnosis cannot exceed 1000 characters.")]
        public required string Details { get; set; }

        public DateTime DiagnosedOn { get; set; } = DateTime.UtcNow;
    }

    public class DiagnosisDTO
{
    [Required]
    public int PatientId { get; set; }
    [Required]
     public int PhysicianId { get; set; }
    public int? AppointmentId { get; set; } // Optional appointment reference

    [Required(ErrorMessage = "Diagnosis details are required.")]
    public required string Details { get; set; }
}

}