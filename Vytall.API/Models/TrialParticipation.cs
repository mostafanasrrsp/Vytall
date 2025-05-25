using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vytall.API.Models
{
    public class TrialParticipation
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ClinicalTrialId { get; set; }

        [Required]
        public int PatientId { get; set; }

        [Required]
        [StringLength(50)]
        public string Status { get; set; }

        public DateTime EnrollmentDate { get; set; }

        public DateTime? CompletionDate { get; set; }

        public DateTime? WithdrawalDate { get; set; }

        [StringLength(500)]
        public string WithdrawalReason { get; set; }

        public bool IsEligible { get; set; }

        [StringLength(500)]
        public string EligibilityNotes { get; set; }

        public int CurrentVisitNumber { get; set; }

        public DateTime? NextVisitDate { get; set; }

        [StringLength(500)]
        public string VisitNotes { get; set; }

        public bool HasCompletedAllVisits { get; set; }

        public bool HasReportedAdverseEvents { get; set; }

        [StringLength(500)]
        public string AdverseEventDetails { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        [ForeignKey("ClinicalTrialId")]
        public virtual ClinicalTrial ClinicalTrial { get; set; }

        [ForeignKey("PatientId")]
        public virtual Patient Patient { get; set; }
    }
} 