import React, { useState } from 'react';
import { FaUsers, FaCalendarAlt, FaPills } from 'react-icons/fa';
import PatientAnalytics from './PatientAnalytics';
import AppointmentAnalytics from './AppointmentAnalytics';
import MedicationAnalytics from './MedicationAnalytics';

export default function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState('patients');

  const tabs = [
    { id: 'patients', label: 'Patient Analytics', icon: FaUsers },
    { id: 'appointments', label: 'Appointment Analytics', icon: FaCalendarAlt },
    { id: 'medications', label: 'Medication Analytics', icon: FaPills },
  ];

  return (
    <div className="p-6"> 
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
      
      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition
              ${activeTab === tab.id 
                ? 'bg-[#609bd8] text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            <tab.icon className="text-lg" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="h-[calc(100vh-240px)] max-h-[900px]">
          {activeTab === 'patients' && (
            <div className="h-full flex items-center justify-center">
              <div className="w-full h-[90%]">
                <PatientAnalytics />
              </div>
            </div>
          )}
          {activeTab === 'appointments' && (
            <div className="h-full flex items-center justify-center">
              <div className="w-full h-[90%]">
                <AppointmentAnalytics />
              </div>
            </div>
          )}
          {activeTab === 'medications' && (
            <div className="h-full flex items-center justify-center">
              <div className="w-full h-[90%]">
                <MedicationAnalytics />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 