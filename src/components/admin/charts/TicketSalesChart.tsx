import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TicketSalesChartProps {
  data: {
    labels: string[];
    values: number[];
  };
}

export default function TicketSalesChart({ data }: TicketSalesChartProps) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Tickets Sold',
        data: data.values,
        backgroundColor: 'rgb(59, 130, 246)',
        borderRadius: 4,
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
  };

  return <Bar data={chartData} options={options} />;
}