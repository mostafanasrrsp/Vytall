using System;
using Vytall.API.Models;

namespace Vytall.API.DTOs
{
    public class PatientSatisfactionSurveyCreateDTO
    {
        public int PatientId { get; set; }
        public int Rating { get; set; }
        public string? Comments { get; set; }
        public SurveyType SurveyType { get; set; }
    }

    public class PatientSatisfactionSurveyDTO
    {
        public int SurveyId { get; set; }
        public int PatientId { get; set; }
        public DateTime DateSubmitted { get; set; }
        public int Rating { get; set; }
        public string? Comments { get; set; }
        public SurveyType SurveyType { get; set; }
    }
} 