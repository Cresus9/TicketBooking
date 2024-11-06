import React from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AdminChartProps {
  type: 'revenue' | 'category';
  data: any[];
}

export default function AdminChart({ type, data }: AdminChartProps) {
  if (type === 'revenue') {
    const chartData = {
      labels: data.map(d => d.date),
      datasets: [
        {
          label: 'Revenue',
          data: data.map(d => d.value),
          fill: true,
          borderColor: 'rgb(79, 70, 229)',
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
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
          callbacks: {
            label: (context: any) => `GHS ${context.parsed.y.toLocaleString()}`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value: number) => `GHS ${value.toLocaleString()}`,
          },
        },
      },
    };

    return <Line data={chartData} options={options} />;
  }

  if (type === 'category') {
    const chartData = {
      labels: data.map(d => d.category),
      datasets: [
        {
          data: data.map(d => d.total),
          backgroundColor: [
            'rgb(79, 70, 229)',
            'rgb(59, 130, 246)',
            'rgb(139, 92, 246)',
            'rgb(236, 72, 153)',
            'rgb(248, 113, 113)',
          ],
          borderWidth: 0,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom' as const,
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const value = context.raw;
              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${context.label}: ${percentage}%`;
            },
          },
        },
      },
    };

    return <Doughnut data={chartData} options={options} />;
  }

  return null;
}