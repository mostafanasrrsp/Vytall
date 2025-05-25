using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Vytall.API.Models
{
    public class PharmacyInventory
    {
        [Key]
        public int InventoryId { get; set; }

        [Required(ErrorMessage = "Medication name is required.")]
        [StringLength(200, ErrorMessage = "Medication name must not exceed 200 characters.")]
        public required string MedicationName { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Quantity cannot be negative.")]
        public int Quantity { get; set; }

        [Required(ErrorMessage = "Last updated date is required.")]
        public DateTime LastUpdated { get; set; }
    }
}