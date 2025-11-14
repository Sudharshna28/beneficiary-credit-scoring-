import React from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function ResultDashboard({ result }) {
  const isApproved = result.prediction === 0;

  // PIE CHART (Approval vs Rejection)
  const pieData = {
    labels: ["Approved", "Rejected"],
    datasets: [
      {
        data: isApproved ? [1, 0] : [0, 1],
        backgroundColor: ["#38b2ac", "#e53e3e"],
        borderWidth: 0,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        position: "bottom",
        labels: { font: { size: 14 } },
      },
    },
  };

  // BAR CHART (Probability of default)
  const barData = {
    labels: ["Probability of Default"],
    datasets: [
      {
        label: "Risk (%)",
        data: [result.probability_of_default * 100],
        backgroundColor: result.probability_of_default > 0.5 ? "#e53e3e" : "#38b2ac",
        borderRadius: 10,        // Rounded bar
        barPercentage: 0.5,
      },
    ],
  };

  const barOptions = {
    indexAxis: "y",
    scales: {
      x: { max: 100, grid: { display: false } },
      y: { grid: { display: false } },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.raw.toFixed(2)}% Risk`,
        },
      },
    },
  };

  return (
    <div className="dashboard-charts">
      <h3 className="chart-title">Prediction Analytics</h3>

      <div className="chart-container">
        <Pie data={pieData} options={pieOptions} />
      </div>

      <div className="chart-container">
        <Bar data={barData} options={barOptions} />
      </div>
    </div>
  );
}
