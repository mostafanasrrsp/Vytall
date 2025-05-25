using System;

namespace Vytall.API.Models
{
    public class PatientAchievement
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public int AchievementId { get; set; }
        public DateTime DateEarned { get; set; }

        // Navigation properties
        public Patient Patient { get; set; }
        public Achievement Achievement { get; set; }
    }
} 