import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function PharmacyInventoryChart() {
  // Static inventory data
  const inventoryData = [
    { medication: 'Amoxicillin', quantity: 120 },
    { medication: 'Ibuprofen', quantity: 60 },
    { medication: 'Metformin', quantity: 30 },
    { medication: 'Atorvastatin', quantity: 90 },
    { medication: 'Losartan', quantity: 50 },
  ];

  // Extract labels and data
  const labels = inventoryData.map((item) => item.medication);
  const quantities = inventoryData.map((item) => item.quantity);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Stock Level',
        data: quantities,
        backgroundColor: [
          '#1d5b91', // Blue
          '#50a3ba', // Teal
          '#4a86c5', // Light Blue
          '#71a2d6', // Medium Blue
          '#a3d4f7', // Soft Blue
        ],
      },
    ],
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-lg font-bold mb-2">Pharmacy Inventory Levels</h2>
      <Bar data={chartData} />
    </div>
  );
}