import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../login/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();
  const role = user?.role;
  const location = useLocation(); // To highlight active route

  const commonLinks = [
    { to: "/", label: "Dashboard" },
  ];

  const adminLinks = [
    { to: "/manage-physicians", label: "Manage Physicians" },
    { to: "/manage-pharmacists", label: "Manage Pharmacists" },
    { to: "/manage-facilities", label: "Manage Facilities" },
    { to: "/manage-appointments", label: "Manage Appointments" },
    { to: "/manage-diagnoses", label: "Manage Diagnoses" },
    { to: "/manage-prescriptions", label: "Manage Prescriptions" },
    { to: "/manage-dispensing", label: "Manage Dispensing" },
    { to: "/manage-pharmacies", label: "Manage Pharmacies" },
    { to: "/manage-patients", label: "Manage Patients" },
    { to: "/manage-medicalrecords", label: "Manage Medical Records" },
    { to: "/billing", label: "Billing" },
  ];

  const physicianLinks = [
    { to: "/appointments", label: "Appointments" },
    { to: "/manage-prescriptions", label: "Manage Prescriptions" },
    { to: "/manage-diagnoses", label: "Manage Diagnoses" },
    { to: "/manage-medicalrecords", label: "Medical Records" },
  ];

  const pharmacistLinks = [
    { to: "/manage-dispensing", label: "Manage Dispensing" },
    { to: "/medicalrecords", label: "Manage Inventory" },
  ];

  const patientLinks = [
    { to: "/manage-appointments", label: "Manage Appointments" },
    { to: "/prescriptions", label: "Prescriptions" },
    { to: "/manage-medicalrecords", label: "Medical Records" },
    { to: "/billing", label: "Billing" },
  ];

  let roleLinks = [];
  if (role === "Admin") roleLinks = adminLinks;
  else if (role === "Physician") roleLinks = physicianLinks;
  else if (role === "Pharmacist") roleLinks = pharmacistLinks;
  else if (role === "Patient") roleLinks = patientLinks;

 return (
    <aside className="w-64 bg-[#609bd8] text-white p-6 space-y-4 shadow-lg rounded-tr-xl">
      <h2 className="text-lg font-bold">Vytall Portal</h2>
      <nav className="flex flex-col space-y-2">
        {[...commonLinks, ...roleLinks].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`p-2 rounded transition 
              ${
                location.pathname === item.to
                  ? 'bg-[#71a2d6] font-semibold' // Slightly darker active state
                  : 'hover:bg-[#71a2d6]'
              } 
              text-white visited:text-white active:text-white focus:text-white`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}