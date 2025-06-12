import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.preprocessing import LabelEncoder
import joblib

# Load your dataset
df = pd.read_csv("nifty.csv")  # Make sure 'nifty.csv' is in the same folder

# Encode the company name
encoder = LabelEncoder()
df['company_encoded'] = encoder.fit_transform(df['company'])

# Features and labels
features = ['Open', 'Close', 'Volume', 'company_encoded']
X = df[features]
y = df['target']  # Replace with actual label column name

# Train model
model = DecisionTreeClassifier()
model.fit(X, y)

# Save the model and encoder
joblib.dump(model, "decision_tree_model.pkl")
joblib.dump(encoder, "company_encoder.pkl")

print("✅ Model and encoder saved.")
