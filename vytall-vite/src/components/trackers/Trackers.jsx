import React, { useState } from 'react';
import PeriodTracker from './PeriodTracker';
import WeightTracker from './WeightTracker';
import StressLevelTracker from './StressLevelTracker';
import BloodGlucoseTracker from './BloodGlucoseTracker';
import HeartRateTracker from './HeartRateTracker';
import BloodPressureTracker from './BloodPressureTracker';
import OTCMedicationsTracker from './OTCMedicationsTracker';
import { useAuth } from '../../login/AuthContext';
import PatientSelect from '../ui/Forms/PatientSelect';

const trackerTabs = [
  { label: 'Blood Glucose', component: BloodGlucoseTracker },
  { label: 'Heart Rate', component: HeartRateTracker },
  { label: 'Blood Pressure', component: BloodPressureTracker },
  { label: 'Weight', component: WeightTracker },
  { label: 'Stress Level', component: StressLevelTracker },
  { label: 'Period', component: PeriodTracker },
  { label: 'OTC Medications', component: OTCMedicationsTracker },
];

const Trackers = ({ patientId }) => {
  const { user } = useAuth();
  const isPatient = user?.role === 'Patient';
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const activePatientId = patientId || (isPatient ? user?.patientId : selectedPatientId);
  const [activeTab, setActiveTab] = useState(0);
  const ActiveComponent = trackerTabs[activeTab].component;

  // Show patient select for non-patient users if no patientId prop
  const showPatientSelect = !isPatient && !patientId;

  if (!activePatientId) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Health Trackers</h2>
        {showPatientSelect && (
          <div className="mb-4 max-w-xs">
            <PatientSelect value={selectedPatientId} onChange={setSelectedPatientId} />
          </div>
        )}
        <div className="text-red-500">
          No patient selected. Please select a patient to view their health trackers.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Health Trackers</h2>
      {showPatientSelect && (
        <div className="mb-4 max-w-xs">
          <PatientSelect value={selectedPatientId} onChange={setSelectedPatientId} />
        </div>
      )}
      <div className="flex space-x-2 mb-6 border-b overflow-x-auto">
        {trackerTabs.map((tab, idx) => (
          <button
            key={tab.label}
            className={`px-4 py-2 font-medium border-b-2 transition-colors duration-150 ${activeTab === idx ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-blue-500'}`}
            onClick={() => setActiveTab(idx)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>
        <ActiveComponent patientId={activePatientId} />
      </div>
    </div>
  );
};

export default Trackers; 