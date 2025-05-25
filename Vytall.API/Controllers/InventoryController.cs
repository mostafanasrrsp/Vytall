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
    [Authorize(Roles = "Pharmacist, Admin")]
    public class InventoryController : ControllerBase
    {
        private readonly VytallContext _context;

        public InventoryController(VytallContext context)
        {
            _context = context;
        }

        // GET: api/inventory
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetInventory()
        {
            var inventory = await _context.PharmacyInventories
                .Select(i => new {
                    i.InventoryId,
                    i.MedicationName,
                    i.Quantity,
                    i.LastUpdated
                })
                .ToListAsync();
            return Ok(inventory);
        }
    }
} 