import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { fetchPhysicians } from '../../../api/physicians';
import { fetchPharmacists } from '../../../api/pharmacists';
import { fetchPatients } from '../../../api/patients';
import { fetchDiagnoses } from '../../../api/diagnoses';
import { fetchAllPrescriptions } from '../../../api/prescriptions';
import { fetchDispensings } from '../../../api/dispensing';
import { fetchMedicalRecords } from '../../../api/medicalRecords';
import { fetchPharmacies } from '../../../api/pharmacies';
import { fetchAppointments } from '../../../api/appointments';
import { fetchMedicalFacilities } from '../../../api/medicalFacilities'; // ✅ NEW IMPORT

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    appointments: 0,
    prescriptions: 0,
    medicalRecords: 0,
    billingDue: '$150', // placeholder
    physicians: 0,
    pharmacists: 0,
    facilities: 0, // now dynamic
    diagnosis: 0,
    dispensing: 0,
    pharmacies: 0,
    patients: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const [
          physicians,
          pharmacists,
          patients,
          diagnoses,
          prescriptions,
          dispensings,
          medicalRecords,
          pharmacies,
          appointments,
          facilities // ✅ NEW
        ] = await Promise.all([
          fetchPhysicians(),
          fetchPharmacists(),
          fetchPatients(),
          fetchDiagnoses(),
          fetchAllPrescriptions(),
          fetchDispensings(),
          fetchMedicalRecords(),
          fetchPharmacies(),
          fetchAppointments(),
          fetchMedicalFacilities() // ✅ NEW
        ]);

        setStats({
          physicians: physicians.length,
          pharmacists: pharmacists.length,
          patients: patients.length,
          diagnosis: diagnoses.length,
          prescriptions: prescriptions.length,
          dispensing: dispensings.length,
          medicalRecords: medicalRecords.length,
          pharmacies: pharmacies.length,
          appointments: appointments.length,
          facilities: facilities.length, // ✅ NEW
          billingDue: '$150' // still static
        });
      } catch (error) {
        console.error("Failed to load dashboard stats:", error);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome, Admin</h1>
      <p className="text-gray-600 mb-8">
        Manage users, facilities, appointments, diagnoses, and more.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard to="/manage-physicians" label="Manage Physicians" count={stats.physicians} />
        <StatCard to="/manage-pharmacists" label="Manage Pharmacists" count={stats.pharmacists} />
        <StatCard to="/manage-facilities" label="Manage Facilities" count={stats.facilities} />
        <StatCard to="/manage-appointments" label="Manage Appointments" count={stats.appointments} />
        <StatCard to="/manage-diagnoses" label="Manage Diagnoses" count={stats.diagnosis} />
        <StatCard to="/manage-prescriptions" label="Manage Prescriptions" count={stats.prescriptions} />
        <StatCard to="/manage-dispensing" label="Manage Dispensing" count={stats.dispensing} />
        <StatCard to="/manage-pharmacies" label="Manage Pharmacies" count={stats.pharmacies} />
        <StatCard to="/manage-patients" label="Manage Patients" count={stats.patients} />
        <StatCard to="/manage-medicalrecords" label="Manage Medical Records" count={stats.medicalRecords} />
        <StatCard to="/billing" label="Manage Billing" count={stats.billingDue} />
      </div>
    </div>
  );
}

function StatCard({ to, label, count }) {
  return (
    <Link
      to={to}
      className="p-4 bg-white shadow rounded-lg hover:bg-gray-100 transition block"
    >
      <h2 className="text-lg font-semibold mb-2">{label}</h2>
      <p className="text-3xl font-bold">{count}</p>
    </Link>
  );
}