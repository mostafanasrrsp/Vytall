using Microsoft.EntityFrameworkCore;
using MedConnect.API.Models;

namespace MedConnect.API.Data
{
    public class MedConnectContext : DbContext
    {
        public MedConnectContext(DbContextOptions<MedConnectContext> options) : base(options)
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
        
    }
}