using Microsoft.AspNetCore.Mvc;
using Vytall.API.DTOs;
using Vytall.API.Services;
using System.Threading.Tasks;

namespace Vytall.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly ReportService _reportService;

        public ReportsController(ReportService reportService)
        {
            _reportService = reportService;
        }

        [HttpPost("generate")]
        public async Task<IActionResult> GenerateReport([FromBody] ReportRequestDTO request)
        {
            var report = await _reportService.GenerateReportAsync(request);
            return Ok(report);
        }
    }
} 