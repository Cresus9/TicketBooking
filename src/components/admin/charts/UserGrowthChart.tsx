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
  Legend,
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

interface UserGrowthChartProps {
  data: {
    labels: string[];
    values: number[];
  };
}

export default function UserGrowthChart({ data }: UserGrowthChartProps) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'New Users',
        data: data.values,
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgb(139, 92, 246)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  return <Line data={chartData} options={options} />;
}