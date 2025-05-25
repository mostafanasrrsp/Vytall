import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { fetchDiagnoses } from '../../api/diagnoses';
import { useAuth } from '../../login/AuthContext';
import 'chart.js/auto';

export default function DiagnosisDistributionChart() {
  const { user } = useAuth();
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchDiagnoses();
        const filtered = data.filter(d => d.physicianId === Number(user.physicianId));

        const diagCounts = {};
        filtered.forEach(d => {
          diagCounts[d.details] = (diagCounts[d.details] || 0) + 1;
        });

        const colorPalette = [
          '#609bd8','#4a86c5','#71a2d6','#9bbbe2','#0284c7',
          '#50a3ba','#a3d4f7','#6d93c2','#2978b5','#5d8ac7'
        ];

        setChartData({
          labels: Object.keys(diagCounts),
          datasets: [
            {
              label: 'Diagnosis Distribution',
              data: Object.values(diagCounts),
              backgroundColor: colorPalette,
            }
          ]
        });
      } catch (error) {
        console.error('Failed to fetch diagnoses:', error);
      }
    }
    loadData();
  }, [user]);

  if (!chartData) return <p>Loading Diagnoses Chart...</p>;

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-lg font-bold mb-2">Diagnosis Distribution</h2>
      <Doughnut data={chartData} />
    </div>
  );
}