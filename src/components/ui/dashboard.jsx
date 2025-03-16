import { Link } from 'react-router-dom';

export default function Dashboard() {
  const stats = {
    appointments: 5,
    prescriptions: 3,
    medicalRecords: 12,
    billingDue: '$150',
    physicians: 4,
    pharmacists: 2,
    diagnosis: 8,
    dispensing: 6,
    pharmacies: 1,
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to Vytall</h1>
      <p className="text-gray-600 mb-8">
        Manage appointments, prescriptions, medical records, billing, diagnosis, and dispensing.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Existing Shortcuts */}
        <Link to="/appointments" className="p-4 bg-white shadow rounded-lg hover:bg-gray-100 transition block">
          <h2 className="text-lg font-semibold mb-2">Appointments</h2>
          <p className="text-3xl font-bold">{stats.appointments}</p>
        </Link>

        <Link to="/prescriptions" className="p-4 bg-white shadow rounded-lg hover:bg-gray-100 transition block">
          <h2 className="text-lg font-semibold mb-2">Prescriptions</h2>
          <p className="text-3xl font-bold">{stats.prescriptions}</p>
        </Link>

        <Link to="/medicalrecords" className="p-4 bg-white shadow rounded-lg hover:bg-gray-100 transition block">
          <h2 className="text-lg font-semibold mb-2">Medical Records</h2>
          <p className="text-3xl font-bold">{stats.medicalRecords}</p>
        </Link>

        <Link to="/billing" className="p-4 bg-white shadow rounded-lg hover:bg-gray-100 transition block">
          <h2 className="text-lg font-semibold mb-2">Billing</h2>
          <p className="text-3xl font-bold">{stats.billingDue}</p>
        </Link>

        {/* Management Sections */}
        <Link to="/manage-physicians" className="p-4 bg-white shadow rounded-lg hover:bg-gray-100 transition block">
          <h2 className="text-lg font-semibold mb-2">Manage Physicians</h2>
          <p className="text-3xl font-bold">{stats.physicians}</p>
        </Link>

        <Link to="/manage-pharmacists" className="p-4 bg-white shadow rounded-lg hover:bg-gray-100 transition block">
          <h2 className="text-lg font-semibold mb-2">Manage Pharmacists</h2>
          <p className="text-3xl font-bold">{stats.pharmacists}</p>
        </Link>

        <Link to="/manage-facilities" className="p-4 bg-white shadow rounded-lg hover:bg-gray-100 transition block">
          <h2 className="text-lg font-semibold mb-2">Manage Facilities</h2>
          <p className="text-3xl font-bold">+</p>
        </Link>

        <Link to="/manage-appointments" className="p-4 bg-white shadow rounded-lg hover:bg-gray-100 transition block">
          <h2 className="text-lg font-semibold mb-2">Manage Appointments</h2>
          <p className="text-3xl font-bold">+</p>
        </Link>

        <Link to="/manage-diagnoses" className="p-4 bg-white shadow rounded-lg hover:bg-gray-100 transition block">
          <h2 className="text-lg font-semibold mb-2">Manage Diagnoses</h2>
          <p className="text-3xl font-bold">{stats.diagnosis}</p>
        </Link>

        <Link to="/manage-prescriptions" className="p-4 bg-white shadow rounded-lg hover:bg-gray-100 transition block">
          <h2 className="text-lg font-semibold mb-2">Manage Prescriptions</h2>
          <p className="text-3xl font-bold">{stats.prescriptions}</p>
        </Link>

        <Link to="/manage-dispensing" className="p-4 bg-white shadow rounded-lg hover:bg-gray-100 transition block">
          <h2 className="text-lg font-semibold mb-2">Manage Dispensing</h2>
          <p className="text-3xl font-bold">{stats.dispensing}</p>
        </Link>

        <Link to="/manage-pharmacies" className="p-4 bg-white shadow rounded-lg hover:bg-gray-100 transition block">
          <h2 className="text-lg font-semibold mb-2">Manage Pharmacies</h2>
          <p className="text-3xl font-bold">{stats.pharmacies}</p>
        </Link>
        <Link to="/manage-patients" className="p-4 bg-white shadow rounded-lg hover:bg-gray-100 transition block">
          <h2 className="text-lg font-semibold mb-2">Manage Patients</h2>
          <p className="text-3xl font-bold">{stats.pharmacies}</p>
        </Link>
      </div>
    </div>
  );
}