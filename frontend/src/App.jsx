import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { MapPin, CalendarDays, Wallet, Sparkles } from "lucide-react";

function App() {
  const [location, setLocation] = useState("");
  const [days, setDays] = useState("");
  const [budget, setBudget] = useState("");
  const [interests, setInterests] = useState("");
  const [itinerary, setItinerary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGeneratePlan = async () => {
    if (!location || !days || !budget || !interests) {
      alert("Please fill all fields!");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/plan-trip", {
        location,
        days,
        budget,
        interests,
      });
      setItinerary(response.data.itinerary);
    } catch (error) {
      setItinerary("Sorry, something went wrong while generating your itinerary.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setLocation("");
    setDays("");
    setBudget("");
    setInterests("");
    setItinerary("");
  };

  const renderFormattedItinerary = () => {
    const daySections = itinerary.split(/(?=Day \d+)/i);
    return daySections.map((section, index) => (
      <motion.div
        key={index}
        className="bg-gradient-to-br from-[#1f2937] to-[#111827] border border-cyan-700 p-6 rounded-2xl shadow-xl hover:shadow-cyan-500/30 transition-all hover:scale-[1.02]"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
      >
        <h3 className="text-xl font-bold text-cyan-300 mb-2">Day {index + 1}</h3>
        <p className="text-gray-300 whitespace-pre-wrap leading-relaxed tracking-wide">
          {section.trim()}
        </p>
      </motion.div>
    ));
  };

  const handleShareLink = () => {
    const url = `${window.location.origin}?location=${encodeURIComponent(location)}&days=${days}&budget=${budget}&interests=${encodeURIComponent(interests)}`;
    navigator.clipboard.writeText(url);
    alert("Shareable link copied to clipboard!");
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const loc = params.get("location");
    const d = params.get("days");
    const bud = params.get("budget");
    const intr = params.get("interests");
    if (loc && d && bud && intr) {
      setLocation(loc);
      setDays(d);
      setBudget(bud);
      setInterests(intr);
      handleGeneratePlan();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-10 font-sans">
      <h1 className="text-4xl sm:text-5xl font-bold mb-10 flex items-center gap-3 animate-pulse text-white">
        <Sparkles className="text-cyan-400" size={40} />
        AI Trip Planner
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="flex items-center gap-2 bg-[#1f2937] px-3 py-2 rounded-xl shadow-md border border-cyan-700">
          <MapPin />
          <input
            className="bg-transparent outline-none text-white w-full"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
          />
        </div>
        <div className="flex items-center gap-2 bg-[#1f2937] px-3 py-2 rounded-xl shadow-md border border-cyan-700">
          <CalendarDays />
          <input
            className="bg-transparent outline-none text-white w-full"
            type="number"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            placeholder="Days"
          />
        </div>
        <div className="flex items-center gap-2 bg-[#1f2937] px-3 py-2 rounded-xl shadow-md border border-cyan-700">
          <Wallet />
          <input
            className="bg-transparent outline-none text-white w-full"
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Budget"
          />
        </div>
        <input
          className="p-2 rounded-xl bg-[#1f2937] text-white w-full shadow-md border border-cyan-700"
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          placeholder="Interests"
        />
        <div className="flex gap-2">
          <button
            onClick={handleGeneratePlan}
            className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-xl text-black font-semibold transition w-full hover:shadow-lg hover:scale-105"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-xl text-white transition hover:scale-105"
          >
            Reset
          </button>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-5 border-b border-gray-700 pb-2 text-cyan-400">Itinerary:</h2>

      {loading ? (
        <p className="text-gray-400 animate-pulse">Please wait while we generate your trip plan...</p>
      ) : itinerary ? (
        <div id="itinerary-section" className="space-y-6 max-w-4xl">{renderFormattedItinerary()}</div>
      ) : (
        <p className="text-red-400">Fill the details and click "Generate Plan".</p>
      )}

      {itinerary && (
        <div className="flex gap-4 my-8">
          <button
            onClick={handleShareLink}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl text-white transition hover:shadow-md hover:scale-105"
          >
            Copy Shareable Link
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
