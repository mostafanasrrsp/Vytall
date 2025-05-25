using System.Collections.Generic;
using Vytall.API.Models;

namespace Vytall.API.DTOs
{
    public class SurveyTypeDistribution
    {
        public SurveyType SurveyType { get; set; }
        public int Count { get; set; }
    }

    public class SurveyAnalyticsDTO
    {
        public int TotalSurveys { get; set; }
        public double AverageRating { get; set; }
        public List<SurveyTypeDistribution> Distribution { get; set; }
    }
} 