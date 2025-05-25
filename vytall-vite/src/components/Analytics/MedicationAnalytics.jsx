import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { useAuth } from '../../login/AuthContext';
import { fetchAllPrescriptions, fetchPrescriptionReminders } from '../../api/prescriptions';
import axios from 'axios';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function MedicationAnalytics() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adherenceData, setAdherenceData] = useState(null);
  const [prescriptionData, setPrescriptionData] = useState(null);

  useEffect(() => {
    loadMedicationData();
  }, [user]);

  const loadMedicationData = async () => {
    try {
      setLoading(true);
      let prescriptions = [];
      if (user?.role === 'Patient') {
        prescriptions = await fetchPrescriptionReminders(user.patientId);
      } else {
        prescriptions = await fetchAllPrescriptions();
      }

      // Process adherence levels
      const adherenceLevels = {
        'High (>90%)': 0,
        'Medium (70-90%)': 0,
        'Low (<70%)': 0
      };

      // Process prescription types
      const prescriptionTypes = {};

      prescriptions.forEach(prescription => {
        // Calculate adherence rate
        const adherenceRate = (prescription.dosesTaken / (prescription.totalDoses || 1)) * 100;
        if (adherenceRate > 90) adherenceLevels['High (>90%)']++;
        else if (adherenceRate >= 70) adherenceLevels['Medium (70-90%)']++;
        else adherenceLevels['Low (<70%)']++;

        // Count prescription types
        const medicationType = (prescription.medicationDetails || prescription.medication || '').split(' ')[0];
        if (medicationType) {
          prescriptionTypes[medicationType] = (prescriptionTypes[medicationType] || 0) + 1;
        }
      });

      setAdherenceData({
        labels: Object.keys(adherenceLevels),
        datasets: [{
          label: 'Medication Adherence Levels',
          data: Object.values(adherenceLevels),
          backgroundColor: [
            'rgba(96, 155, 216, 0.8)',
            'rgba(29, 91, 145, 0.8)',
            'rgba(71, 162, 214, 0.8)'
          ],
          borderColor: 'white',
          borderWidth: 1
        }]
      });

      setPrescriptionData({
        labels: Object.keys(prescriptionTypes),
        datasets: [{
          label: 'Prescriptions by Type',
          data: Object.values(prescriptionTypes),
          backgroundColor: 'rgba(96, 155, 216, 0.8)',
          borderColor: 'white',
          borderWidth: 1
        }]
      });

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full">Loading medication analytics...</div>;
  if (error) return <div className="text-red-500 text-center h-full flex items-center justify-center">Error: {error}</div>;

  return (
    <div className="h-full">
      <div className="grid grid-cols-2 gap-8 h-full">
        {/* Adherence Distribution */}
        <div className="h-full flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Medication Adherence</h3>
          <div className="flex-1 min-h-0">
            <Pie
              data={adherenceData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                    labels: {
                      boxWidth: 15,
                      padding: 15,
                      font: {
                        size: 12
                      }
                    }
                  },
                  title: {
                    display: false
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Prescription Types */}
        <div className="h-full flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Prescriptions by Type</h3>
          <div className="flex-1 min-h-0">
            <Bar
              data={prescriptionData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  },
                  title: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1,
                      font: {
                        size: 12
                      }
                    }
                  },
                  x: {
                    ticks: {
                      font: {
                        size: 12
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 