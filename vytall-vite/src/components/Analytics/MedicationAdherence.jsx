import React, { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { fetchPrescriptionReminders } from '../../api/prescriptions';
import { useAuth } from '../../login/AuthContext';

export default function MedicationAdherence({ refreshTrigger = 0 }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adherenceData, setAdherenceData] = useState({
    totalDoses: 0,
    takenDoses: 0,
    adherenceRate: 0
  });
  const { user } = useAuth();

  const fetchAdherenceData = async () => {
    if (!user?.patientId) {
      setError('Patient ID not found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const reminders = await fetchPrescriptionReminders(user.patientId);
      console.log('Prescription reminders:', reminders);
      
      // Calculate total taken doses across all prescriptions
      const takenDoses = reminders.reduce((sum, prescription) => 
        sum + (prescription.dosesTaken || 0), 0);

      // Calculate total prescribed doses
      const totalDoses = reminders.reduce((sum, prescription) => {
        // If we have totalDoses in the prescription, use that
        if (prescription.totalDoses) {
          return sum + prescription.totalDoses;
        }
        
        // Otherwise calculate based on frequency and time elapsed
        const startDate = new Date(prescription.issuedDate);
        const endDate = new Date(prescription.expirationDate || prescription.nextDoseTime || new Date());
        const timeElapsed = Math.max(0, endDate - startDate);
        const frequencyHours = prescription.frequencyIntervalHours || 24; // Default to daily if not specified
        const expectedDoses = Math.floor(timeElapsed / (frequencyHours * 60 * 60 * 1000));
        
        return sum + Math.max(0, expectedDoses);
      }, 0);

      // Calculate adherence rate
      const adherenceRate = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 100;

      setAdherenceData({
        totalDoses,
        takenDoses,
        adherenceRate
      });
    } catch (err) {
      console.error('Error fetching adherence data:', err);
      setError('Failed to load medication adherence data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdherenceData();
  }, [user?.patientId, refreshTrigger]); // Add refreshTrigger to dependencies

  if (loading) return <div className="p-4">Loading adherence data...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-lg font-bold mb-2">Your Medication Adherence</h2>
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16">
          <CircularProgressbar
            value={adherenceData.adherenceRate}
            text={`${adherenceData.adherenceRate}%`}
            styles={buildStyles({
              textColor: '#1d5b91',
              pathColor: adherenceData.adherenceRate >= 80 ? '#1e5631' : '#f7a541',
              trailColor: '#e0e0e0',
            })}
          />
        </div>

        <div>
          <p className="text-gray-700">
            {`Taken ${adherenceData.takenDoses} of ${adherenceData.totalDoses} prescribed doses`}
          </p>
          <p className={`text-sm font-semibold ${
            adherenceData.adherenceRate >= 80 ? 'text-[#1e5631]' : 'text-[#f7a541]'
          }`}>
            {adherenceData.adherenceRate >= 80 
              ? 'Great job! Keep it up!' 
              : adherenceData.totalDoses === adherenceData.takenDoses
                ? 'All caught up!'
                : 'Try to stay on track!'}
          </p>
        </div>
      </div>
    </div>
  );
}