using Microsoft.EntityFrameworkCore;
using Vytall.API.Models;

namespace Vytall.API.Data
{
    public class VytallContext : DbContext
    {
        public VytallContext(DbContextOptions<VytallContext> options) : base(options)
        {
        }

        public DbSet<Patient> Patients { get; set; }
        public DbSet<Physician> Physicians { get; set; }
        public DbSet<Pharmacist> Pharmacists { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<MedicalFacility> MedicalFacilities { get; set; }
        public DbSet<Prescription> Prescriptions { get; set; }
        public DbSet<Diagnosis> Diagnoses { get; set; }
        public DbSet<MedicalRecord> MedicalRecords { get; set; }
        public DbSet<Dispensing> Dispensings { get; set; } 
        public DbSet<Pharmacy> Pharmacies { get; set; }
        public DbSet<PharmacyInventory> PharmacyInventories { get; set; }
        public DbSet<OTCMedication> OTCMedications { get; set; }

        // New Tracker Models
        public DbSet<OrderTracking> OrderTrackings { get; set; }
        public DbSet<BloodPressure> BloodPressures { get; set; }
        public DbSet<HeartRate> HeartRates { get; set; }
        public DbSet<BloodGlucose> BloodGlucoses { get; set; }
        public DbSet<StressLevel> StressLevels { get; set; }
        public DbSet<PeriodTracker> PeriodTrackers { get; set; }
        public DbSet<Weight> Weights { get; set; }

        public DbSet<PatientSatisfactionSurvey> PatientSatisfactionSurveys { get; set; }
    }
}