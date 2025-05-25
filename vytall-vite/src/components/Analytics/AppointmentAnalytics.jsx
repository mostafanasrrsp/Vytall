import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { useAuth } from '../../login/AuthContext';
import axios from 'axios';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function AppointmentAnalytics() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [physicianData, setPhysicianData] = useState(null);

  useEffect(() => {
    loadAppointmentData();
  }, []);

  const loadAppointmentData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://localhost:5227/api/appointments', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
      });
      
      const appointments = response.data;

      // Process status distribution
      const statusCount = {
        Scheduled: 0,
        Completed: 0,
        Cancelled: 0,
        'No Show': 0
      };

      // Process physician distribution
      const physicianCount = {};

      appointments.forEach(appointment => {
        // Count by status
        statusCount[appointment.status]++;

        // Count by physician
        const physicianName = appointment.physicianName || `Dr. ${appointment.physicianId}`;
        physicianCount[physicianName] = (physicianCount[physicianName] || 0) + 1;
      });

      setStatusData({
        labels: Object.keys(statusCount),
        datasets: [{
          data: Object.values(statusCount),
          backgroundColor: [
            'rgba(96, 155, 216, 0.8)',
            'rgba(29, 91, 145, 0.8)',
            'rgba(71, 162, 214, 0.8)',
            'rgba(142, 202, 230, 0.8)'
          ],
          borderColor: 'white',
          borderWidth: 1
        }]
      });

      setPhysicianData({
        labels: Object.keys(physicianCount),
        datasets: [{
          data: Object.values(physicianCount),
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

  if (loading) return <div className="flex items-center justify-center h-full">Loading appointment analytics...</div>;
  if (error) return <div className="text-red-500 text-center h-full flex items-center justify-center">Error: {error}</div>;

  return (
    <div className="h-full">
      <div className="grid grid-cols-2 gap-8 h-full">
        {/* Status Distribution */}
        <div className="h-full flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Appointment Status</h3>
          <div className="flex-1 min-h-0">
            <Pie
              data={statusData}
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

        {/* Physician Distribution */}
        <div className="h-full flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Appointments by Physician</h3>
          <div className="flex-1 min-h-0">
            <Bar
              data={physicianData}
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