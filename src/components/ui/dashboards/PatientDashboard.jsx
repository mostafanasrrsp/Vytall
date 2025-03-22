import React from 'react';
import AppointmentsContainer from '../../Appointments/AppointmentsContainer';
import PrescriptionReminder from '../../Prescriptions/PrescriptionReminder';
import MedicalRecordsSummary from '../../MedicalRecords/MedicalRecordsSummary';
import BillingSummary from '../../billing/InvoiceCard';
import MedicationAdherence from '../../Analytics/MedicationAdherence';

export default function PatientDashboard() {
  // For demo, using static stats; these can be replaced with real data later.
  const stats = {
    appointments: 5,
    prescriptions: 3,
    medicalRecords: 12,
    billingDue: '$150',
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Welcome, Patient</h1>

      {/* Responsive Layout for Appointments + Medical Records & Billing */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Appointments + Medication Adherence + Medical Records & Billing */}
        <div className="lg:col-span-2 flex flex-col space-y-4">
          <AppointmentsContainer />

          {/* Move Medication Adherence above Medical Records & Billing */}
          <MedicationAdherence />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MedicalRecordsSummary count={stats.medicalRecords} />
            <BillingSummary amount={stats.billingDue} />
          </div>
        </div>

        {/* Prescription Reminder in its own column */}
        <div className='grid grid-cols-1 gap-4'>
          <PrescriptionReminder />
        </div>
      </div>
    </div>
  );
}