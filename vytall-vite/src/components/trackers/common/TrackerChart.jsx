import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const TrackerChart = ({ data, title, yAxisLabel, color = 'rgb(75, 192, 192)' }) => {
    const chartData = {
        labels: data.map(item => new Date(item.date).toLocaleDateString()),
        datasets: [
            {
                label: yAxisLabel,
                data: data.map(item => item.value),
                borderColor: color,
                backgroundColor: color + '20',
                tension: 0.1
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: title
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: yAxisLabel
                }
            }
        }
    };

    return (
        <div className="w-full h-64 p-4 bg-white rounded-lg shadow">
            <Line data={chartData} options={options} />
        </div>
    );
};

export default TrackerChart; 