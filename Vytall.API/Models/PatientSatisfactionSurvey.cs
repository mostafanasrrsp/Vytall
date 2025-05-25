using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vytall.API.Models
{
    public enum SurveyType
    {
        Medication,
        Delivery,
        General
    }

    public class PatientSatisfactionSurvey
    {
        [Key]
        public int SurveyId { get; set; }

        [ForeignKey("Patient")]
        public int PatientId { get; set; }
        public Patient? Patient { get; set; }

        public DateTime DateSubmitted { get; set; } = DateTime.UtcNow;

        [Range(1, 5)]
        public int Rating { get; set; }

        [StringLength(1000)]
        public string? Comments { get; set; }

        public SurveyType SurveyType { get; set; }
    }
} 