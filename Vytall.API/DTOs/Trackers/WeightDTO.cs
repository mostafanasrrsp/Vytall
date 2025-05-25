using System;

namespace Vytall.API.DTOs.Trackers
{
    public class WeightDTO
    {
        public int WeightId { get; set; }
        public int PatientId { get; set; }
        public string PatientName { get; set; }
        public double Value { get; set; }
        public string Unit { get; set; }
        public DateTime ReadingDate { get; set; }
        public string Notes { get; set; }
    }
} 