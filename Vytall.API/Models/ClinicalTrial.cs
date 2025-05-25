using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vytall.API.Models
{
    public class ClinicalTrial
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; }

        [Required]
        [StringLength(200)]
        public string Sponsor { get; set; }

        [Required]
        [StringLength(50)]
        public string Phase { get; set; }

        [Required]
        [StringLength(50)]
        public string Status { get; set; }

        [Required]
        [StringLength(500)]
        public string Description { get; set; }

        [Required]
        [StringLength(200)]
        public string Location { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        [StringLength(50)]
        public string Duration { get; set; }

        [StringLength(100)]
        public string Compensation { get; set; }

        // Eligibility Criteria
        [StringLength(50)]
        public string AgeRange { get; set; }

        [StringLength(50)]
        public string Gender { get; set; }

        public List<string> Conditions { get; set; }

        public string ExcludedConditions { get; set; } // JSON array of excluded conditions

        public List<string> Medications { get; set; }

        public string ExcludedMedications { get; set; } // JSON array of excluded medications

        // Contact Information
        [StringLength(100)]
        public string ContactName { get; set; }

        [StringLength(100)]
        [EmailAddress]
        public string ContactEmail { get; set; }

        [StringLength(20)]
        [Phone]
        public string ContactPhone { get; set; }

        [StringLength(200)]
        public string Website { get; set; }

        public bool IsActive { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation property for trial participants
        public virtual ICollection<TrialParticipation> Participations { get; set; }
    }
} 