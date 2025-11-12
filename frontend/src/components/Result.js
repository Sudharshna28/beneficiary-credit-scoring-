// src/Result.js
import React, { useEffect, useState } from "react";
import "../App.css";

export default function Result({ result }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (result && result.probability_of_default !== undefined) {
      setWidth(result.probability_of_default * 100);
    }
  }, [result]);

  if (!result) return null;

  return (
    <div className="result-card">
      <div className={result.status === "Approved" ? "status-approved" : "status-rejected"}>
        {result.status}
      </div>
      <div className="probability-bar">
        <div
          className="probability-fill"
          style={{ width: `${width}%` }}
        >
          {Math.round(width)}%
        </div>
      </div>
    </div>
  );
}
