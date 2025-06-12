from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import joblib

# Load model and encoder
model = joblib.load("decision_tree_model.pkl")
encoder = joblib.load("company_encoder.pkl")

# Initialize FastAPI app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the input data model
class StockInput(BaseModel):
    day_before_yesterday: float  # This replaces "Open"
    yesterday_close: float       # This replaces "Close"
    volume: float
    company: str

# Prediction route
@app.post("/predict")
def predict_stock(data: StockInput):
    try:
        # Validate company
        if data.company not in encoder.classes_:
            return {"error": f"Company '{data.company}' not recognized."}

        # Encode company name
        company_encoded = encoder.transform([data.company])[0]

        # Prepare input for prediction
        input_features = np.array([
            [data.day_before_yesterday, data.yesterday_close, data.volume, company_encoded]
        ])

        # Make prediction
        prediction = model.predict(input_features)[0]
        message = "Stock likely to go UP" if prediction == 1 else "Stock likely to go DOWN"

        return {
            "prediction": int(prediction),
            "message": message
        }

    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"error": str(e)}



