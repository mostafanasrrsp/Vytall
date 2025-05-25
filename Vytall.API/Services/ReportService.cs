using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Vytall.API.DTOs;
using Vytall.API.Models;
using Vytall.API.Data;
using Microsoft.EntityFrameworkCore;

namespace Vytall.API.Services
{
    public class ReportService
    {
         private readonly VytallContext _context;

         public ReportService(VytallContext context)
         {
             _context = context;
         }

         public async Task<string> GenerateReportAsync(ReportRequestDTO request)
         {
             // (In a real scenario, you might use a library (e.g. iTextSharp for PDF or CsvHelper for CSV) to generate a report file.
             // For demo purposes, we'll return a plain text report (a string) that mimics a report (e.g. dispensed prescriptions filtered by patient and date range).)

             var query = _context.Dispensings
                 .Include(d => d.Prescription)
                 .AsQueryable();

             if (request.PatientId.HasValue)
             {
                 query = query.Where(d => d.Prescription != null && d.Prescription.PatientId == request.PatientId.Value);
             }

             if (request.StartDate.HasValue)
             {
                 query = query.Where(d => d.DispensedOn >= request.StartDate.Value);
             }

             if (request.EndDate.HasValue)
             {
                 query = query.Where(d => d.DispensedOn <= request.EndDate.Value);
             }

             var dispensed = await query.ToListAsync();

             string report = "Report (Generated on " + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + ")\n";
             report += "----------------------------------------\n";
             foreach (var disp in dispensed)
             {
                 report += "Dispensing ID: " + disp.Id + "\n";
                 report += "Patient ID: " + (disp.Prescription?.PatientId.ToString() ?? "N/A") + "\n";
                 report += "Prescription ID: " + disp.PrescriptionId + "\n";
                 report += "Dispensed On: " + disp.DispensedOn.ToString("yyyy-MM-dd HH:mm:ss") + "\n";
                 report += "----------------------------------------\n";
             }
             return report;
         }
    }
} 