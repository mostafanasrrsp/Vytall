using System;

namespace Vytall.API.DTOs
{
    public enum ReportType
    {
        PDF,
        CSV
    }

    public class ReportRequestDTO
    {
        public ReportType ReportType { get; set; }
        public int? PatientId { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
} 