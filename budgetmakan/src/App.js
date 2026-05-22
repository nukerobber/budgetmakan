import { useState } from "react";
import MealLogger from "./MealLogger";
import Dashboard from "./Dashboard";
import AICoach from "./AICoach";

export default function App() {
  const [screen, setScreen] = useState("logger");

  return (
    <div className="min-h-screen bg-green-50">
      
      {/* Top Navigation Bar */}
      <nav className="bg-green-600 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">🍜 BudgetMakan</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setScreen("logger")}
            className={`px-3 py-1 rounded-full text-sm font-medium transition
              ${screen === "logger" ? "bg-white text-green-600" : "text-white"}`}
          >
            Log Meal
          </button>
          <button
            onClick={() => setScreen("dashboard")}
            className={`px-3 py-1 rounded-full text-sm font-medium transition
              ${screen === "dashboard" ? "bg-white text-green-600" : "text-white"}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setScreen("aicoach")}
            className={`px-3 py-1 rounded-full text-sm font-medium transition
              ${screen === "aicoach" ? "bg-white text-green-600" : "text-white"}`}
          >
            Ai Coach
          </button>
        </div>
      </nav>

      {/* Screen Content */}
      <div className="max-w-md mx-auto p-4">
        {screen === "logger" && <MealLogger />}
        {screen === "dashboard" && <Dashboard />}
        {screen === "aicoach" && <AICoach />}
      </div>

    </div>
  );
}