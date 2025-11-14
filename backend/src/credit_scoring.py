# --- Imports ---
import pandas as pd
import numpy as np
import os
import pickle
from xgboost import XGBClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

# --- Paths ---
BASE_DIR = os.path.dirname(__file__)
DATA_PATH = os.path.join(BASE_DIR, '..', 'data', 'credit_risk_dataset.csv')
MODELS_DIR = os.path.join(BASE_DIR, '..', 'models')
os.makedirs(MODELS_DIR, exist_ok=True)

# --- Load CSV ---
df = pd.read_csv(DATA_PATH)
print("✅ Data Loaded Successfully!")

# Fill missing values
df['person_emp_length'] = df['person_emp_length'].fillna(df['person_emp_length'].median())
df['loan_int_rate'] = df['loan_int_rate'].fillna(df['loan_int_rate'].mean())

print("✅ Missing values after cleaning:")
print(df.isnull().sum())


print("\n📊 Summary Statistics:\n")
print(df.describe())

categorical_cols = df.select_dtypes(include=['object']).columns
for col in categorical_cols:
    print(f"\n🔹 {col}: {df[col].unique()}")

# --- Age distribution ---
sns.histplot(df['person_age'], kde=True)
plt.title('Distribution of Applicant Age')
plt.savefig('plots/age_distribution.png')
plt.close()

# --- Loan amount distribution ---
sns.histplot(df['loan_amnt'], kde=True)
plt.title('Distribution of Loan Amount')
plt.savefig('plots/loan_amount_distribution.png')
plt.close()


numeric_cols = [col for col in df.select_dtypes(include=[np.number]).columns if col != 'loan_status']

for col in numeric_cols:
    Q1, Q3 = df[col].quantile([0.25, 0.75])
    IQR = Q3 - Q1
    lower, upper = Q1 - 1.5 * IQR, Q3 + 1.5 * IQR
    df[col] = np.clip(df[col], lower, upper)

print("\n✅ Outlier clipping completed!")
print("Remaining rows:", df.shape)
print("\nLoan status counts after clipping:")
print(df['loan_status'].value_counts())


le = LabelEncoder()
for col in categorical_cols:
    df[col] = le.fit_transform(df[col].astype(str))

print("\n✅ Label encoding completed!")
print(df.head())


X = df.drop('loan_status', axis=1)
y = df['loan_status']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print("\n✅ Data successfully split and scaled!")
print("Training set:", X_train_scaled.shape)
print("Testing set:", X_test_scaled.shape)

# --- Logistic Regression ---
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report, roc_curve, roc_auc_score
from xgboost import XGBClassifier

# Train Logistic Regression
log_reg = LogisticRegression(max_iter=1000, random_state=42)
log_reg.fit(X_train_scaled, y_train)
y_pred_log = log_reg.predict(X_test_scaled)
y_pred_log_proba = log_reg.predict_proba(X_test_scaled)[:, 1]

# Evaluate Logistic Regression
print("\n✅ Logistic Regression Model Results:")
print("Accuracy:", round(accuracy_score(y_test, y_pred_log) * 100, 2), "%")
print("\nConfusion Matrix:\n", confusion_matrix(y_test, y_pred_log))
print("\nClassification Report:\n", classification_report(y_test, y_pred_log))

# Plot Confusion Matrix
plt.figure(figsize=(6, 4))
sns.heatmap(confusion_matrix(y_test, y_pred_log), annot=True, fmt='d', cmap='Blues')
plt.title('Confusion Matrix - Logistic Regression')
plt.xlabel('Predicted')
plt.ylabel('Actual')
plt.tight_layout()
plt.savefig("plots/confusion_matrix_logreg.png")
plt.close()

# Plot ROC Curve
fpr_log, tpr_log, _ = roc_curve(y_test, y_pred_log_proba)
roc_auc_log = roc_auc_score(y_test, y_pred_log_proba)
plt.figure(figsize=(6, 4))
plt.plot(fpr_log, tpr_log, color='darkorange', lw=2, label=f'LogReg (AUC = {roc_auc_log:.2f})')
plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('ROC Curve - Logistic Regression')
plt.legend(loc='lower right')
plt.tight_layout()
plt.savefig("plots/roc_logreg.png")
plt.close()


# --- XGBoost Model ---
xgb_model = XGBClassifier(
    n_estimators=200,
    learning_rate=0.1,
    max_depth=4,
    random_state=42,
    use_label_encoder=False,
    eval_metric='logloss'
)

xgb_model.fit(X_train_scaled, y_train)
y_pred_xgb = xgb_model.predict(X_test_scaled)
y_pred_xgb_proba = xgb_model.predict_proba(X_test_scaled)[:, 1]

# Evaluate XGBoost
print("\n✅ XGBoost Model Results:")
print("Accuracy:", round(accuracy_score(y_test, y_pred_xgb) * 100, 2), "%")
print("\nConfusion Matrix:\n", confusion_matrix(y_test, y_pred_xgb))
print("\nClassification Report:\n", classification_report(y_test, y_pred_xgb))

# Plot Confusion Matrix
plt.figure(figsize=(6, 4))
sns.heatmap(confusion_matrix(y_test, y_pred_xgb), annot=True, fmt='d', cmap='Greens')
plt.title('Confusion Matrix - XGBoost')
plt.xlabel('Predicted')
plt.ylabel('Actual')
plt.tight_layout()
plt.savefig("plots/confusion_matrix_xgb.png")
plt.close()

# Plot ROC Curve
fpr_xgb, tpr_xgb, _ = roc_curve(y_test, y_pred_xgb_proba)
roc_auc_xgb = roc_auc_score(y_test, y_pred_xgb_proba)
plt.figure(figsize=(6, 4))
plt.plot(fpr_xgb, tpr_xgb, color='green', lw=2, label=f'XGBoost (AUC = {roc_auc_xgb:.2f})')
plt.plot(fpr_log, tpr_log, color='orange', lw=2, label=f'LogReg (AUC = {roc_auc_log:.2f})', linestyle='--')
plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle=':')
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('ROC Curve Comparison: Logistic Regression vs XGBoost')
plt.legend(loc='lower right')
plt.tight_layout()
plt.savefig("plots/roc_comparison.png")
plt.close()

print("\n✅ All plots saved in the 'plots' folder!")


import os
import pickle

# Create models folder if it doesn't exist
os.makedirs("models", exist_ok=True)

# Save XGBoost model
with open("models/xgboost_model.pkl", "wb") as f:
    pickle.dump(xgb_model, f)

# Save the scaler
with open("models/scaler.pkl", "wb") as f:
    pickle.dump(scaler, f)

print("✅ XGBoost model and scaler saved successfully in /models!")