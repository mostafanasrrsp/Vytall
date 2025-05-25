using System;

namespace Vytall.API.DTOs
{
    public class TrialParticipationDTO
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public int ClinicalTrialId { get; set; }
        public string Status { get; set; }
        public DateTime EnrollmentDate { get; set; }
        public DateTime? CompletionDate { get; set; }
        public DateTime? WithdrawalDate { get; set; }
        public string WithdrawalReason { get; set; }
        public bool IsEligible { get; set; }
        public string EligibilityNotes { get; set; }
        public int CurrentVisitNumber { get; set; }
        public DateTime? NextVisitDate { get; set; }
        public string VisitNotes { get; set; }
        public bool HasCompletedAllVisits { get; set; }
        public bool HasReportedAdverseEvents { get; set; }
        public string AdverseEventDetails { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class CreateTrialParticipationDTO
    {
        public int PatientId { get; set; }
        public int ClinicalTrialId { get; set; }
        public string Status { get; set; }
        public string EligibilityNotes { get; set; }
    }

    public class UpdateTrialParticipationDTO
    {
        public string Status { get; set; }
        public string VisitNotes { get; set; }
        public int CurrentVisitNumber { get; set; }
        public DateTime? NextVisitDate { get; set; }
        public bool HasCompletedAllVisits { get; set; }
        public bool HasReportedAdverseEvents { get; set; }
        public string AdverseEventDetails { get; set; }
        public DateTime? WithdrawalDate { get; set; }
        public string WithdrawalReason { get; set; }
    }
} 