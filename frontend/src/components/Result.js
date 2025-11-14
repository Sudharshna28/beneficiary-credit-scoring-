import React, { useEffect, useState } from "react";
import "../App.css";

export default function Result({ result }) {
  const [width, setWidth] = useState(0);
  const [color, setColor] = useState("orange");

  useEffect(() => {
    const percent = result.probability_of_default * 100;
    setWidth(percent);

    if (percent < 30) setColor("green");
    else if (percent < 70) setColor("orange");
    else setColor("red");
  }, [result]);

  return (
    <div className="result-card">
      <div className={result.status === "Approved" ? "status-approved" : "status-rejected"}>
        {result.status}
      </div>
      <div className="risk-category">
        Risk Level: {width < 30 ? "Low" : width < 70 ? "Medium" : "High"}
      </div>
      <div className="probability-bar">
        <div
          className="probability-fill"
          style={{ width: `${width}%`, backgroundColor: color }}
        >
          {Math.round(width)}%
        </div>
      </div>
    </div>
  );
}
