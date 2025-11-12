// src/CreditForm.js
import React, { useState } from "react";
import axios from "axios";
import "../App.css"; // Make sure CSS is imported

function CreditForm({ onResult }) {
  const [formData, setFormData] = useState({
    person_age: "",
    person_income: "",
    person_home_ownership: "RENT",
    person_emp_length: "",
    loan_intent: "PERSONAL",
    loan_grade: "B",
    loan_amnt: "",
    loan_int_rate: "",
    loan_percent_income: "",
    cb_person_default_on_file: 0,
    cb_person_cred_hist_length: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        person_age: Number(formData.person_age),
        person_income: Number(formData.person_income),
        person_emp_length: Number(formData.person_emp_length),
        loan_amnt: Number(formData.loan_amnt),
        loan_int_rate: Number(formData.loan_int_rate),
        loan_percent_income: Number(formData.loan_percent_income),
        cb_person_default_on_file: Number(formData.cb_person_default_on_file),
        cb_person_cred_hist_length: Number(formData.cb_person_cred_hist_length)
      };

      const response = await axios.post(
        "http://127.0.0.1:5000/predict",
        payload
      );
      onResult(response.data);
    } catch (err) {
      setError("Error connecting to server. Make sure Flask is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <h2 className="form-title">Beneficiary Credit Scoring</h2>
      <form onSubmit={handleSubmit} className="credit-form">
        <input type="number" name="person_age" placeholder="Age" onChange={handleChange} required className="input-field" />
        <input type="number" name="person_income" placeholder="Income" onChange={handleChange} required className="input-field" />
        <select name="person_home_ownership" onChange={handleChange} className="input-field">
          <option value="RENT">RENT</option>
          <option value="OWN">OWN</option>
          <option value="MORTGAGE">MORTGAGE</option>
          <option value="OTHER">OTHER</option>
        </select>
        <input type="number" name="person_emp_length" placeholder="Years Employed" onChange={handleChange} required className="input-field" />
        <select name="loan_intent" onChange={handleChange} className="input-field">
          <option value="PERSONAL">PERSONAL</option>
          <option value="EDUCATION">EDUCATION</option>
          <option value="MEDICAL">MEDICAL</option>
          <option value="VENTURE">VENTURE</option>
          <option value="HOMEIMPROVEMENT">HOMEIMPROVEMENT</option>
        </select>
        <select name="loan_grade" onChange={handleChange} className="input-field">
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
          <option value="E">E</option>
        </select>
        <input type="number" name="loan_amnt" placeholder="Loan Amount" onChange={handleChange} required className="input-field" />
        <input type="number" step="0.01" name="loan_int_rate" placeholder="Interest Rate %" onChange={handleChange} required className="input-field" />
        <input type="number" step="0.01" name="loan_percent_income" placeholder="Loan % of Income" onChange={handleChange} required className="input-field" />
        <select name="cb_person_default_on_file" onChange={handleChange} className="input-field">
          <option value={0}>No Default</option>
          <option value={1}>Default</option>
        </select>
        <input type="number" name="cb_person_cred_hist_length" placeholder="Credit History Length" onChange={handleChange} required className="input-field" />
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? "Predicting..." : "Predict"}
        </button>
      </form>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

export default CreditForm;
