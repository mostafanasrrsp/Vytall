// src/components/ui/dashboards/PharmacistDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import RecentDispensingContainer from '../../Dispensing/RecentDispensingContainer';
import PharmacistStats from '../../Pharmacists/PharmacistStats'; // Placeholder for future stats
import InventorySummary from '../../Pharmacists/InventorySummary'; // Placeholder for future inventory
import DispensedMedicationsChart from '../../Analytics/DispensedMedicationsChart';
import PharmacyInventoryChart from '../../Analytics/PharmacyInventoryChart';
import LowStockAlerts from '../../Pharmacies/LowStockAlert';

export default function PharmacistDashboard() {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Welcome, Pharmacist</h1>
      <p className="text-gray-600 mb-8">
        Access prescriptions, manage dispensing, and monitor inventory.
      </p>

      {/* Recent Dispensing + Stats/Inventory Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-4">
          <RecentDispensingContainer />
          <PharmacyInventoryChart />
        </div>

        {/* Right Column (1/3 width) */}
        <div className="space-y-4">
          <PharmacistStats />
          <InventorySummary />
          <LowStockAlerts /> 
          <DispensedMedicationsChart />
        </div>
      </div>
    </div>
  );
}