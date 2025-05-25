using Microsoft.AspNetCore.Mvc;
using Vytall.API.DTOs;
using Vytall.API.Services;

namespace Vytall.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DrugInteractionsController : ControllerBase
    {
        private readonly DrugInteractionService _service;

        public DrugInteractionsController()
        {
            // Path relative to the API project root
            var dataFilePath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "drug_interactions.json");
            _service = new DrugInteractionService(dataFilePath);
        }

        [HttpPost("check")]
        public ActionResult<DrugInteractionResultDTO> CheckInteractions([FromBody] DrugInteractionRequestDTO request)
        {
            if (request?.Drugs == null || !request.Drugs.Any())
                return BadRequest("No drugs provided.");

            var interactions = _service.CheckInteractions(request.Drugs);
            return Ok(new DrugInteractionResultDTO { Interactions = interactions });
        }
    }
} 