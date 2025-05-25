using Microsoft.EntityFrameworkCore;
using Vytall.API.Models;

namespace Vytall.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<EmergencyContact> EmergencyContacts { get; set; }
        public DbSet<ClinicalTrial> ClinicalTrials { get; set; }
        public DbSet<TrialParticipation> TrialParticipations { get; set; }
        public DbSet<MedicationAdherence> MedicationAdherence { get; set; }
        public DbSet<Achievement> Achievements { get; set; }
        public DbSet<PatientAchievement> PatientAchievements { get; set; }
        public DbSet<Badge> Badges { get; set; }
        public DbSet<PatientBadge> PatientBadges { get; set; }
        public DbSet<AdherenceStreak> AdherenceStreaks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // EmergencyContact configuration
            modelBuilder.Entity<EmergencyContact>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Relationship).IsRequired().HasMaxLength(50);
                entity.Property(e => e.PhoneNumber).IsRequired().HasMaxLength(20);
                entity.Property(e => e.Notes).HasMaxLength(500);
                entity.Property(e => e.EmergencyInstructions).HasMaxLength(1000);
            });

            // ClinicalTrial configuration
            modelBuilder.Entity<ClinicalTrial>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Sponsor).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Description).IsRequired();
                entity.Property(e => e.Location).IsRequired().HasMaxLength(200);
                entity.Property(e => e.ContactEmail).HasMaxLength(100);
                entity.Property(e => e.ContactPhone).HasMaxLength(20);
                entity.Property(e => e.Website).HasMaxLength(200);
                entity.Property(e => e.Conditions).HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', System.StringSplitOptions.RemoveEmptyEntries).ToList());
                entity.Property(e => e.Medications).HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', System.StringSplitOptions.RemoveEmptyEntries).ToList());
            });

            // TrialParticipation configuration
            modelBuilder.Entity<TrialParticipation>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.Patient)
                    .WithMany()
                    .HasForeignKey(e => e.PatientId)
                    .OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.ClinicalTrial)
                    .WithMany(t => t.Participations)
                    .HasForeignKey(e => e.ClinicalTrialId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // MedicationAdherence configuration
            modelBuilder.Entity<MedicationAdherence>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.Patient)
                    .WithMany()
                    .HasForeignKey(e => e.PatientId)
                    .OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.Prescription)
                    .WithMany()
                    .HasForeignKey(e => e.PrescriptionId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Achievement configuration
            modelBuilder.Entity<Achievement>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Description).IsRequired().HasMaxLength(500);
                entity.Property(e => e.Icon).HasMaxLength(200);
            });

            // PatientAchievement configuration
            modelBuilder.Entity<PatientAchievement>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.Patient)
                    .WithMany()
                    .HasForeignKey(e => e.PatientId)
                    .OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.Achievement)
                    .WithMany(a => a.PatientAchievements)
                    .HasForeignKey(e => e.AchievementId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Badge configuration
            modelBuilder.Entity<Badge>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Description).IsRequired().HasMaxLength(500);
                entity.Property(e => e.Icon).HasMaxLength(200);
            });

            // PatientBadge configuration
            modelBuilder.Entity<PatientBadge>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.Patient)
                    .WithMany()
                    .HasForeignKey(e => e.PatientId)
                    .OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.Badge)
                    .WithMany(b => b.PatientBadges)
                    .HasForeignKey(e => e.BadgeId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // AdherenceStreak configuration
            modelBuilder.Entity<AdherenceStreak>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.Patient)
                    .WithMany()
                    .HasForeignKey(e => e.PatientId)
                    .OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.Prescription)
                    .WithMany()
                    .HasForeignKey(e => e.PrescriptionId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
} 