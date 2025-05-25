using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vytall.API.Data;
using Vytall.API.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Vytall.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Patient, Physician, Admin")]
    public class VitalsController : ControllerBase
    {
        private readonly VytallContext _context;

        public VitalsController(VytallContext context)
        {
            _context = context;
        }

        // GET: api/vitals/patient/{patientId}
        [HttpGet("patient/{patientId}")]
        public async Task<ActionResult<object>> GetPatientVitals(int patientId)
        {
            var weights = await _context.Weights.Where(w => w.PatientId == patientId).ToListAsync();
            var bloodPressures = await _context.BloodPressures.Where(bp => bp.PatientId == patientId).ToListAsync();
            var heartRates = await _context.HeartRates.Where(hr => hr.PatientId == patientId).ToListAsync();
            var bloodGlucoses = await _context.BloodGlucoses.Where(bg => bg.PatientId == patientId).ToListAsync();
            var stressLevels = await _context.StressLevels.Where(sl => sl.PatientId == patientId).ToListAsync();

            return Ok(new {
                Weights = weights,
                BloodPressures = bloodPressures,
                HeartRates = heartRates,
                BloodGlucoses = bloodGlucoses,
                StressLevels = stressLevels
            });
        }
    }
} 