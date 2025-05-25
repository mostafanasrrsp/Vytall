using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Vytall.API.Models
{
    public class Prescription
    {
        [Key]
        public int PrescriptionId { get; set; }
        
        [ForeignKey("Patient")]
        [Required(ErrorMessage = "PatientId is required.")]
        public int PatientId { get; set; }
        public Patient? Patient { get; set; }
        
        [ForeignKey("Physician")]
        [Required(ErrorMessage = "PhysicianId is required.")]
        public int PhysicianId { get; set; }
        public Physician? Physician { get; set; }
        
        [Required(ErrorMessage = "Medication details are required.")]
        [StringLength(500)]
        public required string MedicationDetails { get; set; }

        [Required(ErrorMessage = "Dosage is required.")]
        [StringLength(100)]
        public required string Dosage { get; set; }  

        [Required(ErrorMessage = "Frequency is required.")]
        [StringLength(100)]
        public required string Frequency { get; set; }  

        [Required(ErrorMessage = "Issued date is required.")]
        public DateTime IssuedDate { get; set; }
        
        [Required(ErrorMessage = "Expiration date is required.")]
        public DateTime ExpirationDate { get; set; }

        public bool IsDispensed { get; set; } = false;

        // Enhanced dose tracking
        public int TotalDoses { get; set; } = 30;
        public int DosesTaken { get; set; } = 0;
        public DateTime? NextDoseTime { get; set; }
        public int FrequencyIntervalHours { get; set; }
        public DateTime? FirstDoseTime { get; set; }
        public int MissedDoses { get; set; } = 0;
        public DateTime? LastTakenTime { get; set; }
        public bool AllowEarlyDose { get; set; } = false;
        public int EarlyDoseThresholdMinutes { get; set; } = 30;

        // Helper method to calculate if a dose can be taken
        public bool CanTakeDose(DateTime currentTime)
        {
            if (DosesTaken >= TotalDoses) return false;
            if (NextDoseTime == null) return true;
            
            var timeUntilNextDose = NextDoseTime.Value - currentTime;
            return timeUntilNextDose.TotalMinutes <= EarlyDoseThresholdMinutes || AllowEarlyDose;
        }

        // Helper method to calculate missed doses
        public void UpdateMissedDoses(DateTime currentTime)
        {
            if (NextDoseTime == null || LastTakenTime == null) return;

            var expectedDoses = (int)((currentTime - LastTakenTime.Value).TotalHours / FrequencyIntervalHours);
            if (expectedDoses > 1)
            {
                MissedDoses += expectedDoses - 1;
            }
        }

        // Helper method to calculate next dose time
        public void CalculateNextDoseTime(DateTime currentTime)
        {
            if (FirstDoseTime == null)
            {
                FirstDoseTime = currentTime;
                NextDoseTime = currentTime.AddHours(FrequencyIntervalHours);
            }
            else
            {
                NextDoseTime = currentTime.AddHours(FrequencyIntervalHours);
            }
            LastTakenTime = currentTime;
        }
    }
}