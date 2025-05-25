using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace Vytall.API.Models
{
    public class Achievement
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int PatientId { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(500)]
        public string Description { get; set; }

        [Required]
        [StringLength(50)]
        public string Icon { get; set; }

        public double Progress { get; set; }

        public double Target { get; set; }

        public bool IsUnlocked { get; set; }

        public DateTime? UnlockedAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation property
        [ForeignKey("PatientId")]
        public virtual Patient Patient { get; set; }

        // Navigation properties
        public ICollection<PatientAchievement> PatientAchievements { get; set; }
    }
} 