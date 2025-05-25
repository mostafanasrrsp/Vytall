import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../login/AuthContext';
import {
  FaCalendarAlt,
  FaPills,
  FaClinicMedical,
  FaShieldAlt,
  FaExclamationTriangle,
  FaUserMd,
  FaChartLine,
  FaClipboardList,
  FaBox,
  FaFileAlt,
  FaUserShield,
  FaBuilding,
  FaWarehouse,
  FaUsers,
  FaWallet,
  FaHospital,
  FaStethoscope,
  FaCapsules,
  FaUserInjured,
  FaFileMedical,
  FaSearch,
  FaVideo,
  FaComments,
  FaTruck,
  FaClipboardCheck,
  FaChartBar,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaHome,
  FaUserCircle,
  FaPhoneAlt,
  FaFlask,
  FaTablets,
  FaHistory,
  FaChartPie
} from 'react-icons/fa';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const role = user?.role;
  const location = useLocation();

  // Common links for all roles
  const commonLinks = [
    { to: '/', label: 'Dashboard', icon: FaHome, group: 'Core' },
    { to: '/notifications', label: 'Notifications', icon: FaBell, group: 'Core' },
    { to: '/settings', label: 'Settings', icon: FaCog, group: 'Core' },
  ];

  // Role-specific links organized by groups
  const roleBasedLinks = {
    Admin: {
      'Core Management': [
        { to: '/manage-patients', label: 'Patients', icon: FaUserInjured },
        { to: '/manage-physicians', label: 'Physicians', icon: FaUserMd },
        { to: '/manage-pharmacists', label: 'Pharmacists', icon: FaCapsules },
        { to: '/manage-facilities', label: 'Facilities', icon: FaHospital },
      ],
      'Clinical Management': [
        { to: '/manage-appointments', label: 'Appointments', icon: FaCalendarAlt },
        { to: '/manage-diagnoses', label: 'Diagnoses', icon: FaStethoscope },
        { to: '/manage-prescriptions', label: 'Prescriptions', icon: FaPills },
        { to: '/manage-medicalrecords', label: 'Medical Records', icon: FaFileMedical },
      ],
      'Pharmacy Management': [
        { to: '/manage-pharmacies', label: 'Pharmacies', icon: FaClinicMedical },
        { to: '/manage-dispensing', label: 'Dispensing', icon: FaClipboardList },
        { to: '/inventory', label: 'Inventory', icon: FaBox },
      ],
      'Analytics & Finance': [
        { to: '/analytics', label: 'Analytics', icon: FaChartBar },
        { to: '/wallet', label: 'Wallet', icon: FaWallet },
        { to: '/reports', label: 'Reports', icon: FaChartPie },
      ],
    },
    Physician: {
      'Patient Care': [
        { to: '/my-patients', label: 'My Patients', icon: FaUserInjured },
        { to: '/manage-appointments', label: 'Appointments', icon: FaCalendarAlt },
        { to: '/manage-prescriptions', label: 'Prescriptions', icon: FaPills },
        { to: '/manage-diagnoses', label: 'Diagnoses', icon: FaStethoscope },
      ],
      'Medical Records': [
        { to: '/manage-medicalrecords', label: 'Medical Records', icon: FaFileMedical },
        { to: '/patient-history', label: 'Patient History', icon: FaHistory },
      ],
      'Telemedicine': [
        { to: '/telemedicine/video', label: 'Video Consultations', icon: FaVideo },
        { to: '/telemedicine/messaging', label: 'Secure Messaging', icon: FaComments },
      ],
      'Quick Access': [
        { to: '/emergency-contacts', label: 'Emergency Contacts', icon: FaPhoneAlt },
        { to: '/clinical-trials', label: 'Clinical Trials', icon: FaFlask },
      ],
    },
    Pharmacist: {
      'Dispensing': [
        { to: '/manage-dispensing', label: 'Dispense Medications', icon: FaClipboardList },
        { to: '/prescription-queue', label: 'Prescription Queue', icon: FaTablets },
      ],
      'Inventory': [
        { to: '/inventory', label: 'Inventory Management', icon: FaBox },
        { to: '/low-stock', label: 'Low Stock Alerts', icon: FaExclamationTriangle },
        { to: '/orders', label: 'Place Orders', icon: FaClipboardCheck },
      ],
      'Patient Care': [
        { to: '/patient-counseling', label: 'Patient Counseling', icon: FaComments },
        { to: '/medication-adherence', label: 'Adherence Tracking', icon: FaChartLine },
      ],
    },
    Patient: {
      'Healthcare': [
        { to: '/providers', label: 'Find Providers', icon: FaSearch },
        { to: '/manage-appointments', label: 'Appointments', icon: FaCalendarAlt },
        { to: '/my-prescriptions', label: 'My Prescriptions', icon: FaPills, description: 'View and manage your prescriptions' },
        { to: '/manage-medicalrecords', label: 'Medical Records', icon: FaFileMedical },
      ],
      'Telemedicine': [
        { to: '/telemedicine/video', label: 'Video Consultations', icon: FaVideo },
        { to: '/telemedicine/messaging', label: 'Secure Messaging', icon: FaComments },
      ],
      'Support': [
        { to: '/emergency-contacts', label: 'Emergency Contacts', icon: FaPhoneAlt },
        { to: '/insurance', label: 'Insurance', icon: FaShieldAlt },
        { to: '/wallet', label: 'Wallet', icon: FaWallet },
      ],
    },
    Facility: {
      'Staff Management': [
        { to: '/manage-physicians', label: 'Physicians', icon: FaUserMd },
        { to: '/manage-pharmacists', label: 'Pharmacists', icon: FaCapsules },
        { to: '/manage-patients', label: 'Patients', icon: FaUserInjured },
      ],
      'Clinical Operations': [
        { to: '/manage-appointments', label: 'Appointments', icon: FaCalendarAlt },
        { to: '/manage-medicalrecords', label: 'Medical Records', icon: FaFileMedical },
        { to: '/manage-diagnoses', label: 'Diagnoses', icon: FaStethoscope },
      ],
      'Analytics': [
        { to: '/analytics', label: 'Facility Analytics', icon: FaChartBar },
        { to: '/reports', label: 'Reports', icon: FaChartPie },
      ],
    },
    Warehouse: {
      'Inventory Management': [
        { to: '/inventory', label: 'Inventory Overview', icon: FaBox },
        { to: '/low-stock', label: 'Low Stock Items', icon: FaExclamationTriangle },
        { to: '/orders', label: 'Order Management', icon: FaClipboardCheck },
      ],
      'Shipping & Receiving': [
        { to: '/incoming-shipments', label: 'Incoming Shipments', icon: FaTruck },
        { to: '/outgoing-shipments', label: 'Outgoing Shipments', icon: FaTruck },
      ],
      'Analytics': [
        { to: '/warehouse-analytics', label: 'Warehouse Analytics', icon: FaChartBar },
        { to: '/inventory-reports', label: 'Inventory Reports', icon: FaChartPie },
      ],
    },
  };

  const handleLogout = () => {
    logout();
  };

  const getRoleLinks = () => {
    const links = roleBasedLinks[role] || {};
    return Object.entries(links).map(([group, items]) => ({
      group,
      items: items.map(item => ({ ...item, group }))
    }));
  };

  return (
    <aside className="w-72 bg-[#D6EBFF] text-gray-800 flex flex-col shadow-lg">
      {/* Logo and User Info */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-white shadow-md p-3 rounded-full w-20 h-20 flex items-center justify-center">
            <img 
              src="/assets/Vytall_logo.png" 
              alt="Vytall Logo" 
              className="h-14 w-14 object-contain"
            />
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">
            {role ? `${role} Portal` : 'Portal'}
          </h2>
          <div className="flex items-center justify-center mt-2 space-x-2">
            <FaUserCircle className="text-gray-600" />
            <p className="text-sm text-gray-600">
              {user?.name || 'User'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="py-4">
        {/* Common Links */}
        <div className="px-4 mb-6">
          {commonLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center p-2 rounded-lg mb-1 transition
                  ${location.pathname === item.to
                    ? 'bg-[#BFE0FF] font-semibold text-[#3766b1]'
                    : 'hover:bg-[#BFE0FF] hover:text-[#3766b1] text-[#3766b1]'
                  }`}
              >
                {Icon && <Icon className={`mr-3 text-lg ${location.pathname === item.to ? 'text-[#3766b1]' : 'group-hover:text-[#3766b1] text-[#3766b1]'}`} />}
                <span className="text-[#3766b1]">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Role-specific Links */}
        {getRoleLinks().map(({ group, items }) => (
          <div key={group} className="mb-6">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {group}
            </h3>
            <div className="px-4">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center p-2 rounded-lg mb-1 transition
                      ${location.pathname === item.to
                        ? 'bg-[#BFE0FF] font-semibold text-[#3766b1]'
                        : 'hover:bg-[#BFE0FF] hover:text-[#3766b1] text-[#3766b1]'
                      }`}
                  >
                    {Icon && <Icon className={`mr-3 text-lg ${location.pathname === item.to ? 'text-[#3766b1]' : 'group-hover:text-[#3766b1] text-[#3766b1]'}`} />}
                    <span className="text-[#3766b1]">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Feature Notices */}
      {( role === 'Pharmacist') && (
        <div className="p-4 border-t border-gray-200">
          <div className="bg-yellow-50 rounded-lg p-3 text-sm text-yellow-800">
            <p className="font-medium mb-1">Note:</p>
            {role === 'Pharmacist' && (
              <p>Inventory and Reports features are currently using static data.</p>
            )}
          </div>
        </div>
      )}

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-2 rounded-lg text-gray-600 hover:bg-[#BFE0FF] hover:text-[#1e40af] transition"
        >
          <FaSignOutAlt className="mr-3 text-lg" />
          Logout
        </button>
      </div>
    </aside>
  );
} 