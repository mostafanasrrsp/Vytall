using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Vytall.API.DTOs;
using Vytall.API.Services;
using Vytall.API.Models;

namespace Vytall.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PatientSatisfactionSurveysController : ControllerBase
    {
        private readonly PatientSatisfactionSurveyService _service;

        public PatientSatisfactionSurveysController(PatientSatisfactionSurveyService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<ActionResult<PatientSatisfactionSurveyDTO>> SubmitSurvey([FromBody] PatientSatisfactionSurveyCreateDTO dto)
        {
            var result = await _service.CreateSurveyAsync(dto);
            return Ok(result);
        }

        [HttpGet]
        public async Task<ActionResult<List<PatientSatisfactionSurveyDTO>>> GetSurveys([FromQuery] int? patientId, [FromQuery] SurveyType? surveyType)
        {
            var results = await _service.GetSurveysAsync(patientId, surveyType);
            return Ok(results);
        }
    }
} 