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
    { to: "/wallet", label: "Wallet" },
  ];

  const physicianLinks = [
    { to: "/manage-appointments", label: "Appointments" },
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
    { to: "/wallet", label: "Wallet" },
  ];

  const facilityLinks = [
    { to: "/manage-physicians", label: "Manage Physicians" },
    { to: "/manage-pharmacists", label: "Manage Pharmacists" },
    { to: "/manage-patients", label: "Manage Patients" },
    { to: "/manage-medicalrecords", label: "Medical Records" },
    { to: "/manage-appointments", label: "Appointments" },
    { to: "/analytics", label: "Analytics" },
  ];

  let roleLinks = [];
  if (role === "Admin") roleLinks = adminLinks;
  else if (role === "Physician") roleLinks = physicianLinks;
  else if (role === "Pharmacist") roleLinks = pharmacistLinks;
  else if (role === "Patient") roleLinks = patientLinks;
  else if (role === "Facility") roleLinks = facilityLinks;

 return (
    <aside className="w-64 bg-[#D6EBFF] text-gray-600 p-6 space-y-6 shadow-lg rounded-tr-xl">
      {/* Logo */}
      <div className="flex items-center justify-center mb-2">
        <div className="bg-white shadow-md p-3 rounded-full w-24 h-24 flex items-center justify-center">
          <img 
            src="/assets/Vytall_logo.png" 
            alt="Vytall Logo" 
            className="h-16 w-16 object-contain"
          />
        </div>
      </div>
      <nav className="flex flex-col space-y-2">
        {[...commonLinks, ...roleLinks].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`p-2 rounded transition 
              ${
                location.pathname === item.to
                  ? 'bg-[#BFE0FF] font-semibold text-[#1e8ce1]' // Slightly darker active state
                  : 'hover:bg-[#BFE0FF] hover:text-[#1e8ce1]'
              } 
              visited:text-current active:text-current focus:text-current`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}