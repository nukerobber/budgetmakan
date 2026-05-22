import { useState } from "react";

// Location options relevant to Malaysian uni students
const LOCATIONS = [
  { label: "🍽️ Mamak", value: "mamak" },
  { label: "🏫 College Canteen", value: "canteen" },
  { label: "🧋 Café", value: "cafe" },
  { label: "🍔 Fast Food", value: "fastfood" },
  { label: "🛒 Grocery / Cook Yourself", value: "grocery" },
  { label: "📦 Food Delivery", value: "delivery" },
  { label: "✏️ Other", value: "other" },
];

export default function MealLogger() {
  // Form state — tracks what the user is typing
  const [foodName, setFoodName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [mealTime, setMealTime] = useState("lunch");
  const [customLocation, setCustomLocation] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // Load existing meals from localStorage
  const getMeals = () => {
    const stored = localStorage.getItem("budgetmakan_meals");
    return stored ? JSON.parse(stored) : [];
  };

  // Handle form submission
  const handleSave = () => {
    // Basic validation
    if (!foodName.trim()) return setError("Please enter what you ate.");
    if (!location) return setError("Please select a location.");
    if (location === "other" && !customLocation.trim())
        return setError("Please enter your custom location.");
    if (!price || isNaN(price) || Number(price) <= 0)
      return setError("Please enter a valid price.");

    // Build the meal entry object
    const newMeal = {
      id: Date.now(),                          // unique ID using timestamp
      foodName: foodName.trim(),
      location,
      price: parseFloat(price),
      mealTime,
      date: new Date().toLocaleDateString("en-MY"), // e.g. "22/5/2026"
      timestamp: new Date().toISOString(),
    };

    // Save to localStorage
    const existing = getMeals();
    localStorage.setItem(
      "budgetmakan_meals",
      JSON.stringify([...existing, newMeal])
    );

    // Reset form
    setFoodName("");
    setLocation("");
    setCustomLocation("");
    setPrice("");
    setMealTime("lunch");
    setError("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2500); // hide success message after 2.5s
  };

  // Show recent meals below the form
  const recentMeals = getMeals().slice(-3).reverse();

  return (
    <div className="mt-6 space-y-6">

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow p-5 space-y-4">
        <h2 className="text-lg font-bold text-green-700">Log Your Meal</h2>

        {/* Food Name Input */}
        <div>
          <label className="text-sm font-medium text-gray-600">What did you eat?</label>
          <input
            type="text"
            placeholder="e.g. Nasi lemak ayam, Roti canai, Big Mac..."
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Meal Time Selector */}
        <div>
          <label className="text-sm font-medium text-gray-600">Meal time</label>
          <div className="flex gap-2 mt-1">
            {["breakfast", "lunch", "dinner"].map((time) => (
              <button
                key={time}
                onClick={() => setMealTime(time)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-medium border transition
                  ${mealTime === time
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-white text-gray-500 border-gray-200"}`}
              >
                {time.charAt(0).toUpperCase() + time.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Location Selector */}
        <div>
          <label className="text-sm font-medium text-gray-600">Where did you eat?</label>
          <div className="grid grid-cols-2 gap-2 mt-1">
            {LOCATIONS.map((loc) => (
              <button
                key={loc.value}
                onClick={() => setLocation(loc.value)}
                className={`py-2 px-3 rounded-xl text-sm border text-left transition
                  ${location === loc.value
                    ? "bg-green-100 border-green-500 text-green-700 font-semibold"
                    : "bg-white border-gray-200 text-gray-600"}`}
              >
                {loc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Show extra input if "Other" is selected */}
        {location === "other" && (
            <input
              type="text"
              placeholder="Enter your location..."
              value={customLocation}
              onChange={(e) => setCustomLocation(e.target.value)}
              className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          )}
        

        {/* Price Input */}
        <div>
          <label className="text-sm font-medium text-gray-600">How much did you spend? (RM)</label>
          <div className="flex items-center mt-1 border border-gray-200 rounded-xl px-4 py-2
                          focus-within:ring-2 focus-within:ring-green-400">
            <span className="text-gray-400 text-sm mr-2">RM</span>
            <input
              type="number"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="flex-1 text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold
                     py-3 rounded-xl transition active:scale-95"
        >
          Save Meal 🍜
        </button>

        {/* Success Toast */}
        {saved && (
          <div className="text-center text-green-600 font-medium text-sm animate-pulse">
            ✅ Meal saved! Keep it up.
          </div>
        )}
      </div>

      {/* Recent Meals Preview */}
      {recentMeals.length > 0 && (
        <div className="bg-white rounded-2xl shadow p-5">
          <h3 className="text-sm font-bold text-gray-500 mb-3">Recent Meals</h3>
          <div className="space-y-2">
            {recentMeals.map((meal) => (
              <div key={meal.id} className="flex justify-between items-center
                                            border-b border-gray-100 pb-2 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-700">{meal.foodName}</p>
                  <p className="text-xs text-gray-400">
                    {meal.mealTime} · {meal.location} · {meal.date}
                  </p>
                </div>
                <span className="text-green-600 font-bold text-sm">
                  RM{meal.price.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}