using System;

namespace Vytall.API.Models
{
    public class PatientBadge
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public int BadgeId { get; set; }
        public DateTime DateEarned { get; set; }

        // Navigation properties
        public Patient Patient { get; set; }
        public Badge Badge { get; set; }
    }
} 