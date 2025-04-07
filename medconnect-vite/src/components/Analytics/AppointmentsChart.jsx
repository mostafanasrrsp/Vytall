import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { fetchAppointments } from '../../api/appointments'; // Ensure this API call exists

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AppointmentsChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchAppointments();
        const filteredAppointments = data.filter(app => app.physicianId === 1); // Filter for Physician 1
        
        const monthlyCounts = {};
        filteredAppointments.forEach((appointment) => {
          const month = new Date(appointment.appointmentTime).toLocaleString('default', { month: 'short' });
          monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
        });

        setChartData({
          labels: Object.keys(monthlyCounts),
          datasets: [
            {
              label: 'Appointments per Month',
              data: Object.values(monthlyCounts),
              backgroundColor: '#609bd8',
            },
          ],
        });
      } catch (error) {
        console.error('Error loading appointments:', error);
      }
    }

    loadData();
  }, []);

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-lg font-bold mb-2">Appointments per Month</h2>
      <Bar data={chartData} />
    </div>
  );
}