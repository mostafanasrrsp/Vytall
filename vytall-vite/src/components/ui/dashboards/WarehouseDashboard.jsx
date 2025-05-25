import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaBoxes, 
  FaTruck, 
  FaClipboardCheck,
  FaExclamationTriangle,
  FaChartLine,
  FaArrowRight,
  FaArrowLeft
} from 'react-icons/fa';
import { useAuth } from '../../../login/AuthContext';

export default function WarehouseDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStock: 0,
    pendingOrders: 0,
    incomingShipments: 0
  });

  useEffect(() => {
    // TODO: Implement actual API calls
    setStats({
      totalItems: 1250,
      lowStock: 15,
      pendingOrders: 8,
      incomingShipments: 3
    });
  }, []);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 mb-16">
      <div>
        <h1 className="text-3xl font-bold mb-2">Warehouse Dashboard</h1>
        <p className="text-gray-600">
          Monitor inventory levels and manage warehouse operations.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          to="/inventory"
          label="Total Items"
          count={stats.totalItems}
          icon={<FaBoxes />}
          color="bg-[#609bd8]/25"
        />
        <StatCard
          to="/low-stock"
          label="Low Stock Items"
          count={stats.lowStock}
          icon={<FaExclamationTriangle />}
          color="bg-[#dc3545]/25"
        />
        <StatCard
          to="/orders"
          label="Pending Orders"
          count={stats.pendingOrders}
          icon={<FaClipboardCheck />}
          color="bg-[#28a745]/25"
        />
        <StatCard
          to="/incoming-shipments"
          label="Incoming Shipments"
          count={stats.incomingShipments}
          icon={<FaTruck />}
          color="bg-[#ffc107]/25"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Orders</h2>
              <Link to="/orders" className="text-blue-600 hover:text-blue-800 flex items-center">
                View All <FaArrowRight className="ml-2" />
              </Link>
            </div>
            {/* Order list will go here */}
            <div className="space-y-2">
              {/* Placeholder for order items */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Order #12345</p>
                    <p className="text-sm text-gray-600">5 items • Urgent</p>
                  </div>
                  <Button variant="primary" size="sm">Process</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory Movements */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Inventory Movements</h2>
              <Link to="/inventory-movements" className="text-blue-600 hover:text-blue-800 flex items-center">
                View All <FaArrowRight className="ml-2" />
              </Link>
            </div>
            {/* Movement list will go here */}
          </div>
        </div>

        {/* Right Column - Analytics */}
        <div className="space-y-6">
          {/* Stock Levels */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4">Stock Levels</h2>
            {/* Stock level chart will go here */}
          </div>

          {/* Order Analytics */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4">Order Analytics</h2>
            {/* Order analytics chart will go here */}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Button variant="primary" className="w-full">
                Create New Order
              </Button>
              <Button variant="secondary" className="w-full">
                Generate Reports
              </Button>
              <Button variant="outline" className="w-full">
                Schedule Delivery
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ to, label, count, icon, color }) {
  const cardContent = (
    <div className={`p-6 rounded-lg shadow-sm transition-all duration-200 ${color} hover:${color.replace('/25', '/30')}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-gray-700 text-2xl">
          {icon}
        </div>
        <span className="text-3xl font-bold text-gray-800">{count}</span>
      </div>
      <h2 className="text-lg font-semibold text-gray-800">{label}</h2>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block hover:scale-[1.02] transition-transform duration-200">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}

function Button({ variant = "primary", size = "md", className = "", children, ...props }) {
  const baseClass = "inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200";
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    outline: "border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
  };

  return (
    <button 
      className={`${baseClass} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
} 