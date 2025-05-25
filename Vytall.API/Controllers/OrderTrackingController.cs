using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vytall.API.Data;
using Vytall.API.Models;
using Vytall.API.DTOs.Trackers;
using System.Security.Claims;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Vytall.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Patient, Pharmacist, Admin")] // 🚀 Restrict Controller Access
    public class OrderTrackingController : ControllerBase
    {
        private readonly VytallContext _context;

        public OrderTrackingController(VytallContext context)
        {
            _context = context;
        }

        // Helper: Check if physician is assigned to patient (via appointments)
        private bool IsPhysicianOfPatient(int physicianId, int patientId)
        {
            return _context.Appointments.Any(a => a.PhysicianId == physicianId && a.PatientId == patientId);
        }

        // ✅ GET ALL ORDERS FOR A PATIENT
        [HttpGet("patient/{patientId}")]
        public async Task<ActionResult<IEnumerable<OrderTrackingDTO>>> GetPatientOrders(int patientId)
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            // Patients can only view their own orders
            if (userRole == "Patient" && userId != patientId.ToString())
            {
                return Forbid();
            }

            var orders = await _context.OrderTrackings
                .Where(o => o.PatientId == patientId)
                .Include(o => o.Patient)
                .Include(o => o.Pharmacy)
                .Select(o => new OrderTrackingDTO
                {
                    OrderTrackingId = o.OrderTrackingId,
                    PatientId = o.PatientId,
                    PatientName = o.Patient.FirstName + " " + o.Patient.LastName,
                    PharmacyId = o.PharmacyId,
                    PharmacyName = o.Pharmacy.Name,
                    OrderDate = o.OrderDate,
                    Status = o.Status,
                    Notes = o.Notes,
                    EstimatedDeliveryDate = o.EstimatedDeliveryDate,
                    ActualDeliveryDate = o.ActualDeliveryDate,
                    TrackingNumber = o.TrackingNumber
                })
                .ToListAsync();

            return Ok(orders);
        }

        // ✅ GET SINGLE ORDER
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderTrackingDTO>> GetOrderById(int id)
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var order = await _context.OrderTrackings
                .Include(o => o.Patient)
                .Include(o => o.Pharmacy)
                .FirstOrDefaultAsync(o => o.OrderTrackingId == id);

            if (order == null) return NotFound();

            // Patients can only view their own orders
            if (userRole == "Patient" && userId != order.PatientId.ToString())
            {
                return Forbid();
            }

            var dto = new OrderTrackingDTO
            {
                OrderTrackingId = order.OrderTrackingId,
                PatientId = order.PatientId,
                PatientName = order.Patient.FirstName + " " + order.Patient.LastName,
                PharmacyId = order.PharmacyId,
                PharmacyName = order.Pharmacy.Name,
                OrderDate = order.OrderDate,
                Status = order.Status,
                Notes = order.Notes,
                EstimatedDeliveryDate = order.EstimatedDeliveryDate,
                ActualDeliveryDate = order.ActualDeliveryDate,
                TrackingNumber = order.TrackingNumber
            };

            return Ok(dto);
        }

        // ✅ CREATE ORDER
        [HttpPost]
        public async Task<ActionResult<OrderTracking>> CreateOrder([FromBody] CreateOrderTrackingDTO dto)
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            // Patients can only create orders for themselves
            if (userRole == "Patient" && userId != dto.PatientId.ToString())
            {
                return Forbid();
            }

            var order = new OrderTracking
            {
                PatientId = dto.PatientId,
                PharmacyId = dto.PharmacyId,
                OrderDate = DateTime.UtcNow,
                Status = dto.Status,
                Notes = dto.Notes,
                EstimatedDeliveryDate = dto.EstimatedDeliveryDate,
                TrackingNumber = dto.TrackingNumber
            };

            _context.OrderTrackings.Add(order);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrderById), new { id = order.OrderTrackingId }, order);
        }

        // ✅ UPDATE ORDER
        [HttpPut("{id}")]
        [Authorize(Roles = "Pharmacist, Admin")] // 🚀 Only Pharmacists and Admins can update
        public async Task<IActionResult> UpdateOrder(int id, [FromBody] UpdateOrderTrackingDTO dto)
        {
            var order = await _context.OrderTrackings.FindAsync(id);
            if (order == null) return NotFound();

            order.Status = dto.Status;
            order.Notes = dto.Notes;
            order.EstimatedDeliveryDate = dto.EstimatedDeliveryDate;
            order.ActualDeliveryDate = dto.ActualDeliveryDate;
            order.TrackingNumber = dto.TrackingNumber;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ❌ DELETE ORDER (Admins Only)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")] // 🚀 Only Admins can delete
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.OrderTrackings.FindAsync(id);
            if (order == null) return NotFound();

            _context.OrderTrackings.Remove(order);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
} 