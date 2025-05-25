// src/components/ui/dashboards/PharmacistDashboard.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaPrescription, FaCapsules, FaClipboardList, 
  FaExclamationTriangle, FaArrowUp, FaArrowDown,
  FaBox, FaTruck, FaChartLine
} from 'react-icons/fa';

import { fetchPendingPrescriptions } from '../../../api/prescriptions';
import { fetchInventory } from '../../../api/inventory';
import { fetchDispensings } from '../../../api/dispensing';
import { fetchOrders } from '../../../api/orders';
import MedicationAnalytics from '../../Analytics/MedicationAnalytics';

// Reuse StatCard and AlertCard components
function StatCard({ title, value, icon, trend, trendValue, color, link }) {
  const CardContent = (
    <div className={`p-6 rounded-lg shadow-sm ${color} transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex flex-col items-start min-h-[3.5rem] justify-center">
            <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
            {trend ? (
              <div className="flex items-center text-sm mt-1">
                {trend === 'up' ? (
                  <FaArrowUp className="text-green-500 mr-1" />
                ) : (
                  <FaArrowDown className="text-red-500 mr-1" />
                )}
                <span className={trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                  {trendValue}% from last month
                </span>
              </div>
            ) : (
              <div className="opacity-0 mt-1 text-sm">placeholder</div>
            )}
          </div>
        </div>
        <div className="p-3 rounded-full bg-white/50">
          {icon}
        </div>
      </div>
    </div>
  );

  return link ? (
    <Link to={link} className="block">
      {CardContent}
    </Link>
  ) : CardContent;
}

function AlertCard({ title, message, type, icon }) {
  const bgColor = type === 'warning' ? 'bg-yellow-50' : 'bg-red-50';
  const textColor = type === 'warning' ? 'text-yellow-800' : 'text-red-800';
  const borderColor = type === 'warning' ? 'border-yellow-200' : 'border-red-200';

  return (
    <div className={`p-4 rounded-lg border ${bgColor} ${borderColor} ${textColor}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium">{title}</h3>
          <p className="mt-1 text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
}

// Pending Prescription Card Component
function PendingPrescriptionCard({ prescription }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-900">{prescription.patientName}</h3>
          <p className="text-sm text-gray-600">{prescription.medication}</p>
          <p className="text-xs text-gray-500 mt-1">Prescribed by Dr. {prescription.prescribingPhysician}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">Status: {prescription.status}</p>
          <p className="text-xs text-gray-500 mt-1">Due: {new Date(prescription.dueDate).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}

export default function PharmacistDashboard() {
  const [stats, setStats] = useState({
    pendingPrescriptions: 0,
    inventoryItems: 0,
    lowStockItems: 0,
    dispensings: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });

  const [pendingPrescriptions, setPendingPrescriptions] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [
          prescriptions,
          inventory,
          dispensings,
          orders
        ] = await Promise.all([
          fetchPendingPrescriptions(),
          fetchInventory(),
          fetchDispensings(),
          fetchOrders()
        ]);

        // Calculate low stock items (less than 20% of max stock)
        const lowStockItems = inventory.filter(item => 
          (item.currentStock / item.maxStock) < 0.2
        );

        // Get pending prescriptions (next 5)
        const pending = prescriptions
          .filter(prescription => prescription.status === "Pending")
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
          .slice(0, 5);

        // Calculate completed orders
        const completedOrders = orders.filter(order => 
          order.status === "Completed"
        );

        setStats({
          pendingPrescriptions: prescriptions.filter(p => p.status === "Pending").length,
          inventoryItems: inventory.length,
          lowStockItems: lowStockItems.length,
          dispensings: dispensings.length,
          pendingOrders: orders.filter(o => o.status === "Pending").length,
          completedOrders: completedOrders.length,
        });

        setPendingPrescriptions(pending);

        // Set alerts based on data
        const newAlerts = [];
        if (lowStockItems.length > 0) {
          newAlerts.push({
            title: 'Low Stock Alert',
            message: `${lowStockItems.length} items are running low on stock`,
            type: 'warning',
            icon: <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />,
          });
        }
        if (pending.length > 0) {
          newAlerts.push({
            title: 'Pending Prescriptions',
            message: `${pending.length} prescriptions need to be filled`,
            type: 'warning',
            icon: <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />,
          });
        }
        setAlerts(newAlerts);

      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <div className="space-y-6 pb-16 mb-16">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, Pharmacist</h1>
        <p className="mt-1 text-gray-600">Here's your pharmacy overview for today.</p>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <AlertCard key={index} {...alert} />
          ))}
        </div>
      )}

      {/* Quick Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Pending Prescriptions"
          value={stats.pendingPrescriptions}
          icon={<FaPrescription className="w-6 h-6 text-blue-600" />}
          color="bg-blue-50"
          link="/prescriptions"
        />
        <StatCard
          title="Low Stock Items"
          value={stats.lowStockItems}
          icon={<FaCapsules className="w-6 h-6 text-red-600" />}
          color="bg-red-50"
          link="/low-stock"
        />
        <StatCard
          title="Today's Dispensings"
          value={stats.dispensings}
          icon={<FaClipboardList className="w-6 h-6 text-green-600" />}
          trend="up"
          trendValue="15"
          color="bg-green-50"
          link="/dispensing"
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={<FaTruck className="w-6 h-6 text-yellow-600" />}
          color="bg-yellow-50"
          link="/orders"
        />
      </div>

      {/* Pending Prescriptions Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Pending Prescriptions</h2>
          <Link to="/prescriptions" className="text-sm text-blue-600 hover:text-blue-800">
            View All
          </Link>
        </div>
        <div className="space-y-4">
          {pendingPrescriptions.length > 0 ? (
            pendingPrescriptions.map((prescription, index) => (
              <PendingPrescriptionCard key={index} prescription={prescription} />
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No pending prescriptions</p>
          )}
        </div>
      </div>

      {/* Additional Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard
          title="Total Inventory Items"
          value={stats.inventoryItems}
          icon={<FaBox className="w-6 h-6 text-indigo-600" />}
          color="bg-indigo-50"
          link="/inventory"
        />
        <StatCard
          title="Completed Orders"
          value={stats.completedOrders}
          icon={<FaTruck className="w-6 h-6 text-pink-600" />}
          color="bg-pink-50"
          link="/orders"
        />
        <StatCard
          title="Total Dispensings"
          value={stats.dispensings}
          icon={<FaClipboardList className="w-6 h-6 text-teal-600" />}
          color="bg-teal-50"
          link="/dispensing"
        />
      </div>

      {/* Analytics Section - moved below additional stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Medication Analytics</h2>
            <Link to="/analytics" className="text-sm text-blue-600 hover:text-blue-800">
              View Details
            </Link>
          </div>
          <div className="h-80">
            <MedicationAnalytics />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Inventory Overview</h2>
            <Link to="/inventory" className="text-sm text-blue-600 hover:text-blue-800">
              View Details
            </Link>
          </div>
          <div className="h-80">
            {/* Add InventoryAnalytics component here */}
            <div className="flex items-center justify-center h-full text-gray-500">
              Inventory analytics chart coming soon
            </div>
          </div>
        </div>
      </div>
      {/* Extra space at the bottom */}
      <div className="h-12" />
    </div>
  );
}