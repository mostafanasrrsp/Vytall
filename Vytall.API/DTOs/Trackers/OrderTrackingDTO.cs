using System;
using System.ComponentModel.DataAnnotations;
using Vytall.API.Models;

namespace Vytall.API.DTOs.Trackers
{
    public class OrderTrackingDTO
    {
        public int OrderTrackingId { get; set; }
        public int PatientId { get; set; }
        public string PatientName { get; set; }
        public int PharmacyId { get; set; }
        public string PharmacyName { get; set; }
        public DateTime OrderDate { get; set; }
        public OrderStatus Status { get; set; }
        public string? Notes { get; set; }
        public DateTime? EstimatedDeliveryDate { get; set; }
        public DateTime? ActualDeliveryDate { get; set; }
        public string? TrackingNumber { get; set; }
    }

    public class CreateOrderTrackingDTO
    {
        [Required]
        public int PatientId { get; set; }

        [Required]
        public int PharmacyId { get; set; }

        [Required]
        public OrderStatus Status { get; set; }

        [StringLength(500)]
        public string? Notes { get; set; }

        public DateTime? EstimatedDeliveryDate { get; set; }
        public string? TrackingNumber { get; set; }
    }

    public class UpdateOrderTrackingDTO
    {
        [Required]
        public OrderStatus Status { get; set; }

        [StringLength(500)]
        public string? Notes { get; set; }

        public DateTime? EstimatedDeliveryDate { get; set; }
        public DateTime? ActualDeliveryDate { get; set; }
        public string? TrackingNumber { get; set; }
    }
} 