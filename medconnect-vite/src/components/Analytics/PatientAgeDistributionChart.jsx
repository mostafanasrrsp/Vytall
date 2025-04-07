// src/components/analytics/PatientAgeDistributionChart.jsx
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { fetchAppointments } from '../../api/appointments';
import { fetchPatients } from '../../api/patients'; 
import { useAuth } from '../../login/AuthContext';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PatientAgeDistributionChart() {
  const { user } = useAuth();
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        // 1. Fetch all appointments
        const apps = await fetchAppointments();
        // Filter by physician
        const physicianApps = apps.filter(a => a.physicianId === Number(user.physicianId));

        // 2. Gather unique patient IDs
        const uniquePatientIds = [...new Set(physicianApps.map(a => a.patientId))];

        // 3. Fetch all patients (or optionally create a new API to fetch only specific patients by IDs)
        const allPatients = await fetchPatients(); 
        // filter patients by unique IDs
        const myPatients = allPatients.filter(p => uniquePatientIds.includes(p.id));

        // 4. Calculate age ranges
        const ageRanges = {
          '<20': 0,
          '20-29': 0,
          '30-39': 0,
          '40-49': 0,
          '50+': 0
        };

        myPatients.forEach((patient) => {
          // parse dateOfBirth from patient or use real logic
          const dob = new Date(patient.dateOfBirth);
          const age = getAge(dob);

          if (age < 20) ageRanges['<20']++;
          else if (age < 30) ageRanges['20-29']++;
          else if (age < 40) ageRanges['30-39']++;
          else if (age < 50) ageRanges['40-49']++;
          else ageRanges['50+']++;
        });

        setChartData({
          labels: Object.keys(ageRanges),
          datasets: [
            {
                label: 'Age Distribution',
                data: Object.values(ageRanges),
                backgroundColor: [
                  '#1d5b91', 
                  '#50a3ba', 
                  '#4a86c5', 
                  '#71a2d6', 
                  '#a3d4f7'  
                ],
              }
          ],
        });
      } catch (err) {
        console.error('Failed to load age distribution:', err);
      }
    }

    loadData();
  }, [user]);

  // Helper function to compute age from DOB
  function getAge(dob) {
    const diff = Date.now() - dob.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  if (!chartData) {
    return <p>Loading Age Distribution...</p>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-lg font-bold mb-2">Patient Age Distribution</h2>
      <Pie data={chartData} />
    </div>
  );
}