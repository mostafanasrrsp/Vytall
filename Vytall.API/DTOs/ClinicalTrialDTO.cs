using System;
using System.Collections.Generic;

namespace Vytall.API.DTOs
{
    public class ClinicalTrialDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Sponsor { get; set; }
        public string Phase { get; set; }
        public string Status { get; set; }
        public string Description { get; set; }
        public string Location { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public List<string> Conditions { get; set; }
        public List<string> Medications { get; set; }
        public string ContactEmail { get; set; }
        public string ContactPhone { get; set; }
        public string Website { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class CreateClinicalTrialDTO
    {
        public string Title { get; set; }
        public string Sponsor { get; set; }
        public string Phase { get; set; }
        public string Status { get; set; }
        public string Description { get; set; }
        public string Location { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public List<string> Conditions { get; set; }
        public List<string> Medications { get; set; }
        public string ContactEmail { get; set; }
        public string ContactPhone { get; set; }
        public string Website { get; set; }
    }

    public class TrialMatchingProfileDTO
    {
        public int PatientId { get; set; }
        public List<string> Conditions { get; set; }
        public List<string> CurrentMedications { get; set; }
        public string Location { get; set; }
        public int MaxDistance { get; set; }
        public List<string> ExcludedTrials { get; set; }
    }
} 