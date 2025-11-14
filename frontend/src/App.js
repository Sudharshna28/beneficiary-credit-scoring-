import React, { useState } from "react";
import CreditForm from "./components/CreditForm";
import Result from "./components/Result";
import ResultDashboard from "./components/ResultDashboard";
import FeatureImportance from "./components/FeatureImportance";
import "./App.css";

function App() {
  const [result, setResult] = useState(null);

  const [featureImportance, setFeatureImportance] = useState([
    { feature: "loan_amnt", importance: 0.25 },
    { feature: "person_income", importance: 0.20 },
    { feature: "loan_int_rate", importance: 0.15 },
    { feature: "person_age", importance: 0.10 },
    { feature: "loan_grade", importance: 0.08 },
  ]);

  return (
    <div className="App">
  <header>
    <h1>Beneficiary Credit Scoring Dashboard</h1>
  </header>

  <div className="dashboard-container">
    
    {/* ---- LEFT SIDE : INPUT FORM ---- */}
    <div className="left-panel">
      <div className="card form-card">
        <h2 className="section-title">Enter Beneficiary Details</h2>
        <CreditForm onResult={setResult} />
      </div>
    </div>

    {/* ---- RIGHT SIDE : RESULTS ---- */}
    <div className="right-panel">
      {!result && (
        <div className="empty-message card">
          <p>Prediction result will appear here after submitting the form.</p>
        </div>
      )}

      {result && (
        <>
          {/* Result Statement */}
          <div className="card result-card">
            <Result result={result} />
          </div>

          {/* Prediction Charts */}
          <div className="card charts-card">
            <ResultDashboard result={result} />
          </div>

          {/* Feature Importance */}
          <div className="card feature-card">
            <FeatureImportance features={featureImportance} />
          </div>
        </>
      )}
    </div>
  </div>
</div>

  );
}

export default App;
