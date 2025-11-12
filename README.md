# Beneficiary Credit Scoring System

## Overview
This project predicts the credit risk of loan applicants using Machine Learning.  
By analyzing applicant details such as age, income, employment length, loan amount, and credit history, the system determines whether a loan is likely to be **Approved** or **Rejected**.

The backend is built using **Flask** to handle model predictions, while the frontend is developed with **React** for an interactive and user-friendly interface.  
The ML model is trained using XGBoost and incorporates numeric and categorical features from historical loan datasets.

---

## Features
- Machine learning-based credit risk prediction  
- Full-stack integration (React + Flask)  
- Predicts approval status and probability of default  
- Real-time prediction through web interface  
- Model and scaler saved using Pickle  
- CORS-enabled backend for smooth frontend-backend communication  

---

## Tech Stack
**Frontend:** React.js  
**Backend:** Flask (Python)  
**Machine Learning:** XGBoost, scikit-learn, pandas, NumPy  
**Model Storage:** Pickle  
**Version Control:** Git, GitHub  

---

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/beneficiary-credit-scoring.git
cd beneficiary-credit-scoring

### 2. Setup Backend 
cd backend
# Create a virtual environment
python -m venv venv

# Activate the virtual environment
venv\Scripts\activate      # Windows
source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Run the backend
python src/app.py

###2. Frontend setup

cd frontend
# Install dependencies
npm install

# Start the React frontend
npm start




