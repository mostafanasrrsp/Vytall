namespace Vytall.API.DTOs.Trackers
{
    public class CreateWeightDTO
    {
        public int PatientId { get; set; }
        public double Value { get; set; }
        public string Unit { get; set; }
        public string Notes { get; set; }
    }
} 