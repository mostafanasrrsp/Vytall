//SeedData.cs

using System;
using System.Linq;
using MedConnect.API.Data;
using MedConnect.API.Models;
using System.Collections.Generic;

namespace MedConnect.API.Data
{
    public static class SeedData
    {
       public static void Initialize(MedConnectContext context)
{
    // Seed Medical Facilities
    if (!context.MedicalFacilities.Any())
    {
        var facilities = new List<MedicalFacility>
        {
            new MedicalFacility 
            { 
                Name = "City General Hospital",
                Address = "123 Main St, City Center",
                Phone = "555-0100",
                Type = "Hospital",
                Email = "info@citygeneral.com",
                OperatingHours = "24/7"
            },
            new MedicalFacility 
            { 
                Name = "Wellness Medical Center",
                Address = "456 Health Ave, Westside",
                Phone = "555-0200",
                Type = "Clinic",
                Email = "info@wellness.com",
                OperatingHours = "8AM-8PM"
            },
            new MedicalFacility 
            { 
                Name = "Eastside Medical Plaza",
                Address = "789 East Blvd, Eastside",
                Phone = "555-0300",
                Type = "Hospital",
                Email = "info@eastside.com",
                OperatingHours = "24/7"
            }
        };

        context.MedicalFacilities.AddRange(facilities);
        context.SaveChanges();
    }

    // Get facilities for relationships
    var cityGeneral = context.MedicalFacilities.FirstOrDefault(f => f.Name == "City General Hospital");
    var wellnessCenter = context.MedicalFacilities.FirstOrDefault(f => f.Name == "Wellness Medical Center");
    var eastsidePlaza = context.MedicalFacilities.FirstOrDefault(f => f.Name == "Eastside Medical Plaza");

    // Seed Physicians with facility relationships
    if (!context.Physicians.Any())
    {
        var physicians = new List<Physician>
        {
            new Physician 
            { 
                FirstName = "Sarah",
                LastName = "Johnson",
                Email = "sarah.johnson@citygeneral.com",
                Phone = "555-1111",
                Specialization = "Family Medicine",
                FacilityId = cityGeneral?.FacilityId
            },
            new Physician 
            { 
                FirstName = "Michael",
                LastName = "Chen",
                Email = "michael.chen@wellness.com",
                Phone = "555-2222",
                Specialization = "Internal Medicine",
                FacilityId = wellnessCenter?.FacilityId
            },
            new Physician 
            { 
                FirstName = "Emily",
                LastName = "Rodriguez",
                Email = "emily.rodriguez@eastside.com",
                Phone = "555-3333",
                Specialization = "Pediatrics",
                FacilityId = eastsidePlaza?.FacilityId
            }
        };

        context.Physicians.AddRange(physicians);
        context.SaveChanges();
    }

    // Seed Pharmacists with facility relationships
    if (!context.Pharmacists.Any())
    {
        var pharmacists = new List<Pharmacist>
        {
            new Pharmacist 
            { 
                FirstName = "John",
                LastName = "Smith",
                Email = "john.smith@pharmacy.com",
                Phone = "555-4444",
                FacilityId = cityGeneral?.FacilityId
            },
            new Pharmacist 
            { 
                FirstName = "Lisa",
                LastName = "Wong",
                Email = "lisa.wong@pharmacy.com",
                Phone = "555-5555",
                FacilityId = wellnessCenter?.FacilityId
            }
        };

        context.Pharmacists.AddRange(pharmacists);
        context.SaveChanges();
    }

    // Seed Pharmacies
    if (!context.Pharmacies.Any())
    {
        var pharmacies = new List<Pharmacy>
        {
            new Pharmacy 
            { 
                PharmacyName = "City Pharmacy",
                Address = "100 Health St",
                Phone = "555-6666",
                Email = "city@pharmacy.com"
            },
            new Pharmacy 
            { 
                PharmacyName = "MedPlus Pharmacy",
                Address = "200 Care Ave",
                Phone = "555-7777",
                Email = "medplus@pharmacy.com"
            }
        };

        context.Pharmacies.AddRange(pharmacies);
        context.SaveChanges();
    }

    // Seed Patients with facility relationships
    if (!context.Patients.Any())
    {
        var patients = new List<Patient>
        {
            new Patient { 
                FirstName = "John", 
                LastName = "Doe", 
                Email = "john.doe@example.com", 
                Phone = "555-1234", 
                DateOfBirth = new DateTime(1990, 5, 10), 
                MedicalHistory = "Allergies: peanuts",
                FacilityId = cityGeneral?.FacilityId
            },
            new Patient { 
                FirstName = "Jane", 
                LastName = "Smith", 
                Email = "jane.smith@example.com", 
                Phone = "555-5678", 
                DateOfBirth = new DateTime(1985, 3, 22), 
                MedicalHistory = "Asthma",
                FacilityId = cityGeneral?.FacilityId
            },
            new Patient { 
                FirstName = "Bob", 
                LastName = "Marley", 
                Email = "bob.marley@example.com", 
                Phone = "555-9876", 
                DateOfBirth = new DateTime(1978, 11, 2), 
                MedicalHistory = "Diabetic",
                FacilityId = wellnessCenter?.FacilityId
            },
            new Patient { 
                FirstName = "Alice", 
                LastName = "Wonder", 
                Email = "alice.wonder@example.com", 
                Phone = "555-2222", 
                DateOfBirth = new DateTime(1992, 2, 14), 
                MedicalHistory = "Healthy",
                FacilityId = wellnessCenter?.FacilityId
            },
            new Patient { 
                FirstName = "Charlie", 
                LastName = "Brown", 
                Email = "charlie.brown@example.com", 
                Phone = "555-3333", 
                DateOfBirth = new DateTime(1989, 9, 30), 
                MedicalHistory = "High blood pressure",
                FacilityId = eastsidePlaza?.FacilityId
            }
        };

        context.Patients.AddRange(patients);
        context.SaveChanges();
    }

    if (!context.Appointments.Any())
    {
        var random = new Random();
        var allPatients = context.Patients.ToList();
        var allPhysicians = context.Physicians.ToList(); // Get all physicians
        var statuses = new[] { "Scheduled", "Completed", "Cancelled" };
        var reasons = new[] { "Check-up", "Follow-up", "Routine exam", "Headaches", "Flu symptoms" };

        var allAppointments = new List<Appointment>();

        for (int i = 0; i < 20; i++)
        {
            var patient = allPatients[random.Next(allPatients.Count)];
            var physician = allPhysicians[random.Next(allPhysicians.Count)]; // Random physician

            var appointment = new Appointment
            {
                PatientId = patient.PatientId,
                PhysicianId = physician.PhysicianId, // Use actual physician ID
                AppointmentTime = DateTime.Now.AddDays(random.Next(-30, 30)).AddHours(random.Next(8, 17)),
                Status = statuses[random.Next(statuses.Length)],
                Reason = reasons[random.Next(reasons.Length)]
            };

            allAppointments.Add(appointment);
        }

        context.Appointments.AddRange(allAppointments);
        context.SaveChanges();
    }

    // ✅ Seed Diagnoses with More Realistic Data
    if (!context.Diagnoses.Any())
    {
        var allAppointments = context.Appointments.Where(a => a.Status == "Completed").ToList();
        var diagnoses = new List<Diagnosis>();
        var diagnosisList = new[]
        {
            "Hypertension",
            "Diabetes Type 2",
            "Migraine",
            "Allergic Rhinitis",
            "Bronchitis",
            "Anemia",
            "Gastroenteritis",
            "Acid Reflux",
            "Arthritis",
            "Urinary Tract Infection"
        };

        foreach (var appointment in allAppointments)
        {
            var diagnosis = new Diagnosis
            {
                PatientId = appointment.PatientId,
                PhysicianId = appointment.PhysicianId,
                AppointmentId = appointment.AppointmentId,
                Details = diagnosisList[new Random().Next(diagnosisList.Length)], // Pick a random diagnosis
                DiagnosedOn = appointment.AppointmentTime
            };

            diagnoses.Add(diagnosis);
        }

        context.Diagnoses.AddRange(diagnoses);
        context.SaveChanges();
    }
    
    // ✅ Seed Prescriptions
    if (!context.Prescriptions.Any())
    {
        var allCompletedAppointments = context.Appointments
            .Where(a => a.Status == "Completed")
            .ToList();

        var medications = new[]
        {
            "Amoxicillin 500mg",
            "Ibuprofen 200mg",
            "Metformin 850mg",
            "Lisinopril 10mg",
            "Atorvastatin 20mg",
            "Prednisone 5mg",
            "Paracetamol 500mg",
            "Azithromycin 250mg",
            "Cetirizine 10mg",
            "Salbutamol Inhaler"
        };

        var frequencies = new[]
        {
            "Once daily",
            "Twice daily",
            "Three times daily",
            "Every 8 hours",
            "As needed"
        };

        var prescriptions = new List<Prescription>();
        var random = new Random();

        foreach (var appointment in allCompletedAppointments)
        {
            var issueDate = appointment.AppointmentTime;
            var expirationDate = issueDate.AddDays(random.Next(10, 60)); // Expiration 10-60 days later
            var frequencyHours = new[] { 8, 12, 24 }[random.Next(3)]; // Random interval 8, 12, or 24 hours
            var totalDoses = random.Next(20, 60); // Random total doses (20-60)
            var dosesTaken = random.Next(0, totalDoses); // Random doses taken (0 to total)
            var nextDoseTime = DateTime.UtcNow.AddHours(frequencyHours); // Next dose in X hours

            var prescription = new Prescription
            {
                PatientId = appointment.PatientId,
                PhysicianId = appointment.PhysicianId,
                MedicationDetails = medications[random.Next(medications.Length)], // Random medication
                Dosage = $"{random.Next(1, 2)} tablet(s) per day", // Randomized 1-2 tablets
                Frequency = frequencies[random.Next(frequencies.Length)], // Random frequency
                IssuedDate = issueDate,
                ExpirationDate = expirationDate,
                TotalDoses = totalDoses,
                DosesTaken = dosesTaken,
                NextDoseTime = nextDoseTime,
                FrequencyIntervalHours = frequencyHours
            };

            prescriptions.Add(prescription);
        }

        context.Prescriptions.AddRange(prescriptions);
        context.SaveChanges();
    }
}
    }
}