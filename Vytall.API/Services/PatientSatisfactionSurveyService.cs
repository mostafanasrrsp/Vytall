using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Vytall.API.Data;
using Vytall.API.DTOs;
using Vytall.API.Models;

namespace Vytall.API.Services
{
    public class PatientSatisfactionSurveyService
    {
        private readonly VytallContext _context;

        public PatientSatisfactionSurveyService(VytallContext context)
        {
            _context = context;
        }

        public async Task<PatientSatisfactionSurveyDTO> CreateSurveyAsync(PatientSatisfactionSurveyCreateDTO dto)
        {
            var survey = new PatientSatisfactionSurvey
            {
                PatientId = dto.PatientId,
                Rating = dto.Rating,
                Comments = dto.Comments,
                SurveyType = dto.SurveyType,
                DateSubmitted = DateTime.UtcNow
            };
            _context.PatientSatisfactionSurveys.Add(survey);
            await _context.SaveChangesAsync();
            return new PatientSatisfactionSurveyDTO
            {
                SurveyId = survey.SurveyId,
                PatientId = survey.PatientId,
                DateSubmitted = survey.DateSubmitted,
                Rating = survey.Rating,
                Comments = survey.Comments,
                SurveyType = survey.SurveyType
            };
        }

        public async Task<List<PatientSatisfactionSurveyDTO>> GetSurveysAsync(int? patientId = null, SurveyType? surveyType = null)
        {
            var query = _context.PatientSatisfactionSurveys.AsQueryable();
            if (patientId.HasValue)
                query = query.Where(s => s.PatientId == patientId.Value);
            if (surveyType.HasValue)
                query = query.Where(s => s.SurveyType == surveyType.Value);
            var surveys = await query.OrderByDescending(s => s.DateSubmitted).ToListAsync();
            return surveys.Select(s => new PatientSatisfactionSurveyDTO
            {
                SurveyId = s.SurveyId,
                PatientId = s.PatientId,
                DateSubmitted = s.DateSubmitted,
                Rating = s.Rating,
                Comments = s.Comments,
                SurveyType = s.SurveyType
            }).ToList();
        }

        public async Task<SurveyAnalyticsDTO> GetSurveyAnalyticsAsync()
        {
            var surveys = await _context.PatientSatisfactionSurveys.ToListAsync();
            var total = surveys.Count;
            var avgRating = total > 0 ? surveys.Average(s => s.Rating) : 0.0;
            var distribution = surveys.GroupBy(s => s.SurveyType)
                                    .Select(g => new SurveyTypeDistribution { SurveyType = g.Key, Count = g.Count() })
                                    .ToList();
            return new SurveyAnalyticsDTO { TotalSurveys = total, AverageRating = avgRating, Distribution = distribution };
        }
    }
} 