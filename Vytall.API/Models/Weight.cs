using System;
using Vytall.API.Models;

namespace Vytall.API.Models
{
    public class Weight
    {
        public int WeightId { get; set; }
        public int PatientId { get; set; }
        public Patient Patient { get; set; }
        public double Value { get; set; } // e.g., 70.5
        public string Unit { get; set; } // e.g., kg, lbs
        public DateTime ReadingDate { get; set; }
        public string Notes { get; set; }
    }
} 