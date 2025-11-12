from flask import Flask, request, jsonify
import pickle
import pandas as pd
import os
from flask_cors import CORS

# --- Initialize Flask App ---
app = Flask(__name__)
CORS(app)  # Enable cross-origin for React frontend

# --- Load model and scaler ---
MODEL_PATH = os.path.join(os.path.dirname(__file__), '../models/xgboost_model.pkl')
SCALER_PATH = os.path.join(os.path.dirname(__file__), '../models/scaler.pkl')

with open(MODEL_PATH, "rb") as model_file:
    model = pickle.load(model_file)

with open(SCALER_PATH, "rb") as scaler_file:
    scaler = pickle.load(scaler_file)

print("✅ Model and Scaler loaded successfully!")

# --- Define expected features ---
FEATURES = [
    "person_age",
    "person_income",
    "person_home_ownership",
    "person_emp_length",
    "loan_intent",
    "loan_grade",
    "loan_amnt",
    "loan_int_rate",
    "loan_percent_income",
    "cb_person_default_on_file",
    "cb_person_cred_hist_length"
]

# --- Home route ---
@app.route('/')
def home():
    return jsonify({
        "message": "✅ Credit Scoring API is running successfully!",
        "endpoints": {
            "POST /predict": "Send loan applicant details as JSON to get risk prediction."
        }
    })

# --- Prediction route ---
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        df = pd.DataFrame([data], columns=FEATURES)

        # --- Map categorical features manually ---
        home_map = {"RENT": 0, "OWN": 1, "MORTGAGE": 2, "OTHER": 3}
        intent_map = {"PERSONAL": 0, "EDUCATION": 1, "MEDICAL": 2, "VENTURE": 3, "HOMEIMPROVEMENT": 4}
        grade_map = {"A": 0, "B": 1, "C": 2, "D": 3, "E": 4}

        df['person_home_ownership'] = df['person_home_ownership'].map(home_map)
        df['loan_intent'] = df['loan_intent'].map(intent_map)
        df['loan_grade'] = df['loan_grade'].map(grade_map)

        # --- Convert numeric fields to numbers ---
        numeric_fields = [
            "person_age",
            "person_income",
            "person_emp_length",
            "loan_amnt",
            "loan_int_rate",
            "loan_percent_income",
            "cb_person_default_on_file",
            "cb_person_cred_hist_length"
        ]
        for field in numeric_fields:
            df[field] = pd.to_numeric(df[field])

        # --- Scale the features ---
        scaled_features = scaler.transform(df)

        # --- Predict ---
        prediction = model.predict(scaled_features)[0]
        prediction_proba = model.predict_proba(scaled_features)[0][1]

        result = {
            "prediction": int(prediction),
            "probability_of_default": round(float(prediction_proba), 4),
            "status": "Approved" if prediction == 0 else "Rejected"
        }

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 400

# --- Run Flask ---
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
