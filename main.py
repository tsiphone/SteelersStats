from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os

app = FastAPI(title="NFL Stats API")

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

CSV_FILE = "steelers_stats.csv"

@app.get("/")
def home():
    return {"status": "online", "message": "API NFL Active"}

@app.get("/api/steelers")
def get_steelers_stats():
    if not os.path.exists(CSV_FILE):
        return {"error": f"File '{CSV_FILE}' not found, run etl_pipeline.py first"}

    df = pd.read_csv(CSV_FILE)
    return df.to_dict(orient="records")

@app.get("/api/steelers/category/{category_name}")
def get_stats_by_category(category_name: str):
    if not os.path.exists(CSV_FILE):
        return {"error": "File not found"}

    df = pd.read_csv(CSV_FILE)
    filtered = df[df["category"].str.lower() == category_name.lower()]
    return filtered.to_dict(orient="records")