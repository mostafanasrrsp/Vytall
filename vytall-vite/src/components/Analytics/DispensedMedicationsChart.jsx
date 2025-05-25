import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { fetchDispensings } from '../../api/dispensing';
import { useAuth } from '../../login/AuthContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function DispensedMedicationsChart() {
  const { user } = useAuth();
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch all dispensing records
        const dispensings = await fetchDispensings();
        // Filter by pharmacist ID
        const pharmacistDispensings = dispensings.filter(d => d.pharmacistId === Number(user.pharmacistId));

        // Aggregate by date
        const dailyDispensing = {};
        pharmacistDispensings.forEach((dispensing) => {
          const date = new Date(dispensing.dispensedOn).toISOString().split('T')[0]; // Format YYYY-MM-DD
          dailyDispensing[date] = (dailyDispensing[date] || 0) + dispensing.quantity;
        });

        // Prepare chart data
        const sortedDates = Object.keys(dailyDispensing).sort();
        setChartData({
          labels: sortedDates,
          datasets: [
            {
              label: 'Quantity Dispensed',
              data: sortedDates.map(date => dailyDispensing[date]),
              borderColor: '#0284c7',
              backgroundColor: 'rgba(2, 132, 199, 0.2)',
              tension: 0.3, // Smooth curve
            },
          ],
        });
      } catch (err) {
        console.error('Failed to load dispensing data:', err);
      }
    }

    loadData();
  }, [user]);

  if (!chartData) {
    return <p>Loading Dispensed Medications...</p>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-lg font-bold mb-2">Dispensed Medications Over Time</h2>
      <Line data={chartData} />
    </div>
  );
}