import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { useAuth } from '../../login/AuthContext';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function PatientAnalytics() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ageData, setAgeData] = useState(null);
  const [genderData, setGenderData] = useState(null);

  useEffect(() => {
    loadPatientData();
  }, []);

  const loadPatientData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const response = await fetch('https://localhost:5227/api/patients', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch patient data');
      
      const patients = await response.json();
      
      // Process age distribution
      const ageGroups = {
        '0-17': 0,
        '18-30': 0,
        '31-50': 0,
        '51-70': 0,
        '71+': 0
      };

      // Process gender distribution
      const genderCount = {
        Male: 0,
        Female: 0,
        Other: 0
      };

      patients.forEach(patient => {
        // Calculate age from birthDate
        const birthDate = new Date(patient.birthDate);
        const age = new Date().getFullYear() - birthDate.getFullYear();
        
        // Count age groups
        if (age <= 17) ageGroups['0-17']++;
        else if (age <= 30) ageGroups['18-30']++;
        else if (age <= 50) ageGroups['31-50']++;
        else if (age <= 70) ageGroups['51-70']++;
        else ageGroups['71+']++;

        // Count genders
        genderCount[patient.gender]++;
      });

      setAgeData({
        labels: Object.keys(ageGroups),
        datasets: [{
          label: 'Patients by Age Group',
          data: Object.values(ageGroups),
          backgroundColor: [
            'rgba(96, 155, 216, 0.8)',
            'rgba(29, 91, 145, 0.8)',
            'rgba(71, 162, 214, 0.8)',
            'rgba(142, 202, 230, 0.8)',
            'rgba(187, 222, 251, 0.8)',
          ],
          borderColor: 'white',
          borderWidth: 1
        }]
      });

      setGenderData({
        labels: Object.keys(genderCount),
        datasets: [{
          label: 'Patients by Gender',
          data: Object.values(genderCount),
          backgroundColor: [
            'rgba(96, 155, 216, 0.8)',
            'rgba(29, 91, 145, 0.8)',
            'rgba(71, 162, 214, 0.8)',
          ],
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

  if (loading) return <div className="flex items-center justify-center h-full">Loading patient analytics...</div>;
  if (error) return <div className="text-red-500 text-center h-full flex items-center justify-center">Error: {error}</div>;

  return (
    <div className="h-full">
      <div className="grid grid-cols-2 gap-8 h-full">
        {/* Age Distribution */}
        <div className="h-full flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Age Distribution</h3>
          <div className="flex-1 min-h-0">
            <Bar
              data={ageData}
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

        {/* Gender Distribution */}
        <div className="h-full flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Gender Distribution</h3>
          <div className="flex-1 min-h-0">
            <Pie
              data={genderData}
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
      </div>
    </div>
  );
} 