import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function FeatureImportance({ features }) {
  const data = {
    labels: features.map(f => f.feature),
    datasets: [
      {
        label: "Importance",
        data: features.map(f => f.importance * 100),
        backgroundColor: "#ff9800",
      },
    ],
  };

  const options = {
    indexAxis: "y",
    scales: {
      x: { max: 100, title: { display: true, text: "% Importance" } },
    },
    plugins: { legend: { display: false } },
  };

  return (
    <div className="feature-chart">
      <h3>Feature Importance</h3>
      <Bar data={data} options={options} />
    </div>
  );
}
