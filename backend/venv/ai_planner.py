import os
import requests
from dotenv import load_dotenv

load_dotenv()

# Load your OpenRouter API key from .env or paste directly
API_KEY = os.getenv("OPENROUTER_API_KEY") or "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"

def generate_trip_plan(location, days, budget, interests):
    prompt = f"""
    Plan a {days}-day trip to {location}, within a budget of ₹{budget}.
    The traveler is interested in {interests}.
    Provide a detailed day-wise itinerary.
    """

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173",  # replace with your actual frontend URL when deploying
        "X-Title": "AI Trip Planner"
    }

    data = {
        "model": "mistralai/mistral-7b-instruct",
        "messages": [
            {"role": "system", "content": "You are a helpful travel planner."},
            {"role": "user", "content": prompt}
        ]
    }

    try:
        response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=data)
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]

    except Exception as e:
        print("❌ Error in generate_trip_plan:", e)
        return "Sorry, something went wrong while generating your itinerary."
