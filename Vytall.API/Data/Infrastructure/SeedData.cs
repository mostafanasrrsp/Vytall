//SeedData.cs

using System;
using System.Linq;
using Vytall.API.Data;
using Vytall.API.Models;
using System.Collections.Generic;

namespace Vytall.API.Data
{
    public static class SeedData
    {
       public static void Initialize(VytallContext context)
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

    // Seed Pharmacies
    if (!context.Pharmacies.Any())
    {
        var pharmacies = new List<Pharmacy>
        {
            new Pharmacy 
            { 
                Name = "City Pharmacy",
                Address = "100 Health St",
                Phone = "555-6666",
                Email = "city@pharmacy.com",
                FacilityId = cityGeneral?.FacilityId ?? throw new InvalidOperationException("City General Hospital not found")
            },
            new Pharmacy 
            { 
                Name = "MedPlus Pharmacy",
                Address = "200 Care Ave",
                Phone = "555-7777",
                Email = "medplus@pharmacy.com",
                FacilityId = wellnessCenter?.FacilityId ?? throw new InvalidOperationException("Wellness Medical Center not found")
            }
        };

        context.Pharmacies.AddRange(pharmacies);
        context.SaveChanges();
    }

    // Get pharmacies for relationships
    var cityPharmacy = context.Pharmacies.FirstOrDefault(p => p.Name == "City Pharmacy");
    var medPlusPharmacy = context.Pharmacies.FirstOrDefault(p => p.Name == "MedPlus Pharmacy");

    // Seed Pharmacists with pharmacy relationships
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
                LicenseNumber = "PH12345",
                PharmacyId = cityPharmacy?.PharmacyId ?? 1
            },
            new Pharmacist 
            { 
                FirstName = "Lisa",
                LastName = "Wong",
                Email = "lisa.wong@pharmacy.com",
                Phone = "555-5555",
                LicenseNumber = "PH67890",
                PharmacyId = medPlusPharmacy?.PharmacyId ?? 2
            }
        };

        context.Pharmacists.AddRange(pharmacists);
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

    // Seed tracker data for PatientId = 4 (Alice Wonder)
    var patient4 = context.Patients.FirstOrDefault(p => p.PatientId == 4);
    if (patient4 != null)
    {
        // Weight
        if (!context.Weights.Any(w => w.PatientId == 4))
        {
            var weightReadings = new List<Weight>
            {
                new Weight { PatientId = 4, ReadingDate = DateTime.UtcNow.AddDays(-28), Value = 62.5, Unit = "kg", Notes = "Stable weight" },
                new Weight { PatientId = 4, ReadingDate = DateTime.UtcNow.AddDays(-21), Value = 62.7, Unit = "kg", Notes = "Slight increase" },
                new Weight { PatientId = 4, ReadingDate = DateTime.UtcNow.AddDays(-14), Value = 62.3, Unit = "kg", Notes = "Normal fluctuation" },
                new Weight { PatientId = 4, ReadingDate = DateTime.UtcNow.AddDays(-7), Value = 62.6, Unit = "kg", Notes = "After travel" },
                new Weight { PatientId = 4, ReadingDate = DateTime.UtcNow, Value = 62.4, Unit = "kg", Notes = "Current" }
            };
            context.Weights.AddRange(weightReadings);
            context.SaveChanges();
        }

        // Blood Glucose
        if (!context.BloodGlucoses.Any(bg => bg.PatientId == 4))
        {
            var glucoseReadings = new List<BloodGlucose>
            {
                new BloodGlucose { PatientId = 4, ReadingDate = DateTime.UtcNow.AddDays(-28), GlucoseLevel = 95, Type = ReadingType.Fasting, Notes = "Morning", IsBeforeMeal = true, IsAfterMeal = false },
                new BloodGlucose { PatientId = 4, ReadingDate = DateTime.UtcNow.AddDays(-21), GlucoseLevel = 110, Type = ReadingType.BeforeMeal, Notes = "Pre-lunch", IsBeforeMeal = true, IsAfterMeal = false },
                new BloodGlucose { PatientId = 4, ReadingDate = DateTime.UtcNow.AddDays(-14), GlucoseLevel = 130, Type = ReadingType.AfterMeal, Notes = "Post-dinner", IsBeforeMeal = false, IsAfterMeal = true },
                new BloodGlucose { PatientId = 4, ReadingDate = DateTime.UtcNow.AddDays(-7), GlucoseLevel = 105, Type = ReadingType.Random, Notes = "Afternoon", IsBeforeMeal = false, IsAfterMeal = false },
                new BloodGlucose { PatientId = 4, ReadingDate = DateTime.UtcNow, GlucoseLevel = 100, Type = ReadingType.Fasting, Notes = "Routine check", IsBeforeMeal = true, IsAfterMeal = false }
            };
            context.BloodGlucoses.AddRange(glucoseReadings);
            context.SaveChanges();
        }

        // Blood Pressure
        if (!context.BloodPressures.Any(bp => bp.PatientId == 4))
        {
            var bpReadings = new List<BloodPressure>
            {
                new BloodPressure { PatientId = 4, ReadingDate = DateTime.UtcNow.AddDays(-28), Systolic = 118, Diastolic = 76, HeartRate = 72, ArmUsed = "Left", Notes = "Normal", IsAfterMeal = false, IsAfterExercise = false, IsAfterMedication = false },
                new BloodPressure { PatientId = 4, ReadingDate = DateTime.UtcNow.AddDays(-21), Systolic = 120, Diastolic = 78, HeartRate = 74, ArmUsed = "Right", Notes = "Slightly elevated", IsAfterMeal = true, IsAfterExercise = false, IsAfterMedication = false },
                new BloodPressure { PatientId = 4, ReadingDate = DateTime.UtcNow.AddDays(-14), Systolic = 117, Diastolic = 75, HeartRate = 70, ArmUsed = "Left", Notes = "Good", IsAfterMeal = false, IsAfterExercise = true, IsAfterMedication = false },
                new BloodPressure { PatientId = 4, ReadingDate = DateTime.UtcNow.AddDays(-7), Systolic = 119, Diastolic = 77, HeartRate = 73, ArmUsed = "Right", Notes = "Routine", IsAfterMeal = false, IsAfterExercise = false, IsAfterMedication = true },
                new BloodPressure { PatientId = 4, ReadingDate = DateTime.UtcNow, Systolic = 121, Diastolic = 79, HeartRate = 75, ArmUsed = "Left", Notes = "Current", IsAfterMeal = false, IsAfterExercise = false, IsAfterMedication = false }
            };
            context.BloodPressures.AddRange(bpReadings);
            context.SaveChanges();
        }

        // Heart Rate
        if (!context.HeartRates.Any(hr => hr.PatientId == 4))
        {
            var hrReadings = new List<HeartRate>
            {
                new HeartRate { PatientId = 4, ReadingDate = DateTime.UtcNow.AddDays(-28), Rate = 68, ArmUsed = "Left", Notes = "Resting", IsAfterMeal = false, IsAfterExercise = false, LastMealTime = DateTime.UtcNow.AddDays(-28).AddHours(-2) },
                new HeartRate { PatientId = 4, ReadingDate = DateTime.UtcNow.AddDays(-21), Rate = 72, ArmUsed = "Right", Notes = "After walk", IsAfterMeal = false, IsAfterExercise = true, LastMealTime = DateTime.UtcNow.AddDays(-21).AddHours(-1) },
                new HeartRate { PatientId = 4, ReadingDate = DateTime.UtcNow.AddDays(-14), Rate = 70, ArmUsed = "Left", Notes = "Normal", IsAfterMeal = true, IsAfterExercise = false, LastMealTime = DateTime.UtcNow.AddDays(-14).AddHours(-3) },
                new HeartRate { PatientId = 4, ReadingDate = DateTime.UtcNow.AddDays(-7), Rate = 74, ArmUsed = "Right", Notes = "After coffee", IsAfterMeal = true, IsAfterExercise = false, LastMealTime = DateTime.UtcNow.AddDays(-7).AddHours(-2) },
                new HeartRate { PatientId = 4, ReadingDate = DateTime.UtcNow, Rate = 69, ArmUsed = "Left", Notes = "Current", IsAfterMeal = false, IsAfterExercise = false, LastMealTime = DateTime.UtcNow.AddHours(-4) }
            };
            context.HeartRates.AddRange(hrReadings);
            context.SaveChanges();
        }

        // Stress Level
        if (!context.StressLevels.Any(sl => sl.PatientId == 4))
        {
            var stressReadings = new List<StressLevel>
            {
                new StressLevel { PatientId = 4, ReadingDate = DateTime.UtcNow.AddDays(-28), Level = 3, Notes = "Relaxed weekend", IsAfterExercise = true, IsAfterMeditation = true, IsAfterSleep = true, IsWorkDay = false },
                new StressLevel { PatientId = 4, ReadingDate = DateTime.UtcNow.AddDays(-21), Level = 5, Notes = "Busy workday", IsAfterExercise = false, IsAfterMeditation = false, IsAfterSleep = false, IsWorkDay = true },
                new StressLevel { PatientId = 4, ReadingDate = DateTime.UtcNow.AddDays(-14), Level = 4, Notes = "Mild stress", IsAfterExercise = false, IsAfterMeditation = true, IsAfterSleep = true, IsWorkDay = true },
                new StressLevel { PatientId = 4, ReadingDate = DateTime.UtcNow.AddDays(-7), Level = 6, Notes = "Deadline week", IsAfterExercise = false, IsAfterMeditation = false, IsAfterSleep = false, IsWorkDay = true },
                new StressLevel { PatientId = 4, ReadingDate = DateTime.UtcNow, Level = 2, Notes = "Vacation", IsAfterExercise = true, IsAfterMeditation = true, IsAfterSleep = true, IsWorkDay = false }
            };
            context.StressLevels.AddRange(stressReadings);
            context.SaveChanges();
        }

        // Period Tracker
        if (!context.PeriodTrackers.Any(pt => pt.PatientId == 4))
        {
            var periodReadings = new List<PeriodTracker>
            {
                new PeriodTracker { PatientId = 4, StartDate = DateTime.UtcNow.AddMonths(-3), EndDate = DateTime.UtcNow.AddMonths(-3).AddDays(5), Notes = "Normal period", FlowIntensity = 5, Symptoms = "Cramps, fatigue", IsUsingContraception = false, IsPregnant = false, IsBreastfeeding = false, MedicationsTaken = "Ibuprofen", CycleLength = 28, PeriodLength = 5 },
                new PeriodTracker { PatientId = 4, StartDate = DateTime.UtcNow.AddMonths(-2), EndDate = DateTime.UtcNow.AddMonths(-2).AddDays(4), Notes = "Slightly lighter", FlowIntensity = 4, Symptoms = "Mild cramps", IsUsingContraception = false, IsPregnant = false, IsBreastfeeding = false, MedicationsTaken = "None", CycleLength = 28, PeriodLength = 4 },
                new PeriodTracker { PatientId = 4, StartDate = DateTime.UtcNow.AddMonths(-1), EndDate = DateTime.UtcNow.AddMonths(-1).AddDays(6), Notes = "Heavier flow", FlowIntensity = 7, Symptoms = "Cramps, headache", IsUsingContraception = false, IsPregnant = false, IsBreastfeeding = false, MedicationsTaken = "Ibuprofen", CycleLength = 28, PeriodLength = 6 }
            };
            context.PeriodTrackers.AddRange(periodReadings);
            context.SaveChanges();
        }

        // Ensure at least one valid prescription for PatientId = 4 (Alice Wonder)
        if (!context.Prescriptions.Any(p => p.PatientId == 4 && p.ExpirationDate > DateTime.UtcNow))
        {
            var prescription = new Prescription
            {
                PatientId = 4,
                PhysicianId = 1, // Sarah Johnson (first seeded physician)
                MedicationDetails = "Test Medication 100mg",
                Dosage = "1 tablet per day",
                Frequency = "Once daily",
                IssuedDate = DateTime.UtcNow.AddDays(-2),
                ExpirationDate = DateTime.UtcNow.AddDays(30),
                TotalDoses = 30,
                DosesTaken = 2,
                NextDoseTime = DateTime.UtcNow.AddHours(12),
                FrequencyIntervalHours = 24,
                IsDispensed = false
            };
            context.Prescriptions.Add(prescription);
            context.SaveChanges();
        }
    }
}
    }
}