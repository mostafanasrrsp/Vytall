using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vytall.API.Models
{
    public class MedicationAdherence
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int PatientId { get; set; }

        [ForeignKey("PatientId")]
        public virtual Patient Patient { get; set; }

        [Required]
        public int PrescriptionId { get; set; }

        [ForeignKey("PrescriptionId")]
        public virtual Prescription Prescription { get; set; }

        public DateTime ScheduledTime { get; set; }

        public DateTime? TakenTime { get; set; }

        public bool WasTaken { get; set; }

        public bool WasOnTime { get; set; }

        [StringLength(500)]
        public string Notes { get; set; }

        public int CurrentStreak { get; set; }

        public int LongestStreak { get; set; }

        public int TotalDoses { get; set; }

        public int MissedDoses { get; set; }

        public decimal AdherenceRate { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
    }
} 