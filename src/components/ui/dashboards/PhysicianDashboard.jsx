// src/components/ui/dashboards/PhysicianDashboard.jsx

import React from 'react';
import AppointmentsContainer from '../../Appointments/AppointmentsContainer';
import MedicalRecordsSummary from '../../MedicalRecords/MedicalRecordsSummary';
import PhysicianPatientList from '../../Physicians/PhysicianPatientList';
import PhysicianStats from '../../Physicians/PhysicianStats';
import AppointmentsChart from '../../Analytics/AppointmentsChart';
import PatientAgeDistributionChart from '../../Analytics/PatientAgeDistributionChart';
import DiagnosisDistributionChart from '../../Analytics/DiagnosisDistributionChart';

export default function PhysicianDashboard() {
  return (
    <div className="p-6 space-y-8">
  <h1 className="text-3xl font-bold mb-4">Welcome, Physician</h1>
  <p className="text-gray-600 mb-8">
    Manage your appointments, view patient records, and monitor your patient list.
  </p>

  {/* Main Layout */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
    {/* Left Column (2/3 width) */}
    <div className="lg:col-span-2 space-y-4">
      <AppointmentsContainer />

      {/* ✅ Sub-grid for charts (each takes 1/2 of the remaining space) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PhysicianPatientList />
        <DiagnosisDistributionChart />
      </div>
    </div>

    {/* Right Column (1/3 width) */}
    <div className="space-y-4">
      <MedicalRecordsSummary />
      <PhysicianStats />
      <PatientAgeDistributionChart />
    </div>
  </div>
</div>
  );
}