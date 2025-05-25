namespace Vytall.API.DTOs
{
    public class RefillRequestDTO
    {
        public int PrescriptionId { get; set; }
        public int PatientId { get; set; }
        public string? Notes { get; set; }
    }

    public class RefillRequestResponseDTO
    {
        public string Status { get; set; }
        public string Message { get; set; }
    }
} 