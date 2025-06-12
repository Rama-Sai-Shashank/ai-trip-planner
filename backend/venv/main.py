from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ai_planner import generate_trip_plan

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Trip Planner Backend Running!"}

class TripRequest(BaseModel):
    location: str
    days: int
    budget: int
    interests: str

@app.post("/api/plan-trip")
def plan_trip(trip: TripRequest):
    try:
        plan = generate_trip_plan(trip.location, trip.days, trip.budget, trip.interests)
        return {"itinerary": plan}
    except Exception as e:
        print("Backend error:", e)
        return {"itinerary": "Something went wrong in backend. Please check logs."}

