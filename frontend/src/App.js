// src/App.js
import React, { useState } from "react";
import CreditForm from "./components/CreditForm";
import Result from "./components/Result";
import "./App.css";

function App() {
  const [predictionResult, setPredictionResult] = useState(null);

  return (
    <div className="App">
      <header className="app-header">
        <h1>Beneficiary Credit Scoring System</h1>
      </header>
      <main>
        {/* Form passes the result back via onResult */}
        <CreditForm onResult={setPredictionResult} />

        {/* Show prediction result */}
        {predictionResult && <Result result={predictionResult} />}
      </main>
    </div>
  );
}

export default App;
