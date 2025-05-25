using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Vytall.API.Data;
using Vytall.API.Models;

public class NotificationService
{
    private readonly VytallContext _context;

    public NotificationService(VytallContext context)
    {
        _context = context;
    }

    // Finds appointments in the next 24 hours and triggers notifications
    public async Task<List<string>> SendUpcomingAppointmentRemindersAsync()
    {
        var now = DateTime.UtcNow;
        var nextDay = now.AddHours(24);
        var appointments = await _context.Appointments
            .Include(a => a.Patient)
            .Include(a => a.Physician)
            .Where(a => a.AppointmentTime >= now && a.AppointmentTime <= nextDay && a.Status == "Scheduled")
            .ToListAsync();

        var notifications = new List<string>();
        foreach (var appt in appointments)
        {
            // Placeholder: log notification for patient
            if (appt.Patient != null)
                notifications.Add($"Notify Patient {appt.Patient.FirstName} {appt.Patient.LastName} (ID: {appt.PatientId}) about appointment at {appt.AppointmentTime}");
            // Placeholder: log notification for physician
            if (appt.Physician != null)
                notifications.Add($"Notify Physician {appt.Physician.FirstName} {appt.Physician.LastName} (ID: {appt.PhysicianId}) about appointment at {appt.AppointmentTime}");
        }
        // In the future, trigger email/notification here
        return notifications;
    }

    // Finds prescriptions with doses due in the next 24 hours and triggers notifications
    public async Task<List<string>> SendUpcomingMedicationRemindersAsync()
    {
        var now = DateTime.UtcNow;
        var nextDay = now.AddHours(24);
        var prescriptions = await _context.Prescriptions
            .Include(p => p.Patient)
            .Where(p => p.NextDoseTime != null && p.NextDoseTime >= now && p.NextDoseTime <= nextDay && p.ExpirationDate > now && !p.IsDispensed)
            .ToListAsync();

        var notifications = new List<string>();
        foreach (var prescription in prescriptions)
        {
            if (prescription.Patient != null)
            {
                notifications.Add($"Notify Patient {prescription.Patient.FirstName} {prescription.Patient.LastName} (ID: {prescription.PatientId}) to take medication '{prescription.MedicationDetails}' at {prescription.NextDoseTime}");
            }
        }
        // In the future, trigger email/notification here
        return notifications;
    }
} 