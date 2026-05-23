import { useState } from "react";

// Match location values to readable labels and emojis
const LOCATION_LABELS = {
  mamak: "🍽️ Mamak",
  canteen: "🏫 Canteen",
  cafe: "🧋 Café",
  fastfood: "🍔 Fast Food",
  grocery: "🛒 Grocery",
  delivery: "📦 Delivery",
  other: "✏️ Other",
};

// Colour for each location type (used in the bar chart)
const LOCATION_COLORS = {
  mamak: "bg-yellow-400",
  canteen: "bg-blue-400",
  cafe: "bg-purple-400",
  fastfood: "bg-red-400",
  grocery: "bg-green-400",
  delivery: "bg-orange-400",
};

export default function Dashboard() {
  const [budget, setBudget] = useState(() => {
    // Load saved budget from localStorage, default RM300
    return localStorage.getItem("budgetmakan_budget") || "300";
  });
  const [editingBudget, setEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState(budget);

  // Load all meals from localStorage
  const getMeals = () => {
    const stored = localStorage.getItem("budgetmakan_meals");
    return stored ? JSON.parse(stored) : [];
  };

  const meals = getMeals();

  // Calculate total spent
  const totalSpent = meals.reduce((sum, meal) => sum + meal.price, 0);
  const budgetNum = parseFloat(budget);
  const remaining = budgetNum - totalSpent;
  const percentUsed = Math.min((totalSpent / budgetNum) * 100, 100);

  // Group spending by location
  const spendingByLocation = meals.reduce((acc, meal) => {
    acc[meal.location] = (acc[meal.location] || 0) + meal.price;
    return acc;
  }, {});

  // Sort locations by most spent
  const sortedLocations = Object.entries(spendingByLocation).sort(
    (a, b) => b[1] - a[1]
  );

  // Group spending by date (for recent history)
  const spendingByDate = meals.reduce((acc, meal) => {
    acc[meal.date] = (acc[meal.date] || 0) + meal.price;
    return acc;
  }, {});

  const recentDates = Object.entries(spendingByDate)
    .slice(-5)
    .reverse();

  // Save budget to localStorage
  const saveBudget = () => {
    if (!tempBudget || isNaN(tempBudget) || Number(tempBudget) <= 0) return;
    setBudget(tempBudget);
    localStorage.setItem("budgetmakan_budget", tempBudget);
    setEditingBudget(false);
  };

  // Delete all meals (reset)
  const handleReset = () => {
    if (window.confirm("Reset all meal data? This cannot be undone.")) {
      localStorage.removeItem("budgetmakan_meals");
      window.location.reload();
    }
  };

  // Budget status colour
  const budgetColor =
    percentUsed >= 90
      ? "bg-red-500"
      : percentUsed >= 70
      ? "bg-yellow-400"
      : "bg-green-500";

  const budgetTextColor =
    percentUsed >= 90
      ? "text-red-600"
      : percentUsed >= 70
      ? "text-yellow-600"
      : "text-green-600";

  return (
    <div className="mt-6 space-y-4">

      {/* Budget Setting */}
      <div className="bg-white rounded-2xl shadow p-5">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-green-700">Monthly Food Budget</h2>
          <button
            onClick={() => setEditingBudget(!editingBudget)}
            className="text-xs text-green-500 underline"
          >
            {editingBudget ? "Cancel" : "Edit"}
          </button>
        </div>

        {editingBudget ? (
          <div className="flex gap-2 items-center">
            <span className="text-gray-400 text-sm">RM</span>
            <input
              type="number"
              value={tempBudget}
              onChange={(e) => setTempBudget(e.target.value)}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              onClick={saveBudget}
              className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-bold"
            >
              Save
            </button>
          </div>
        ) : (
          <>
            {/* Budget Progress Bar */}
            <div className="flex justify-between text-sm mb-1">
              <span className={`font-bold ${budgetTextColor}`}>
                RM{totalSpent.toFixed(2)} spent
              </span>
              <span className="text-gray-400">of RM{budgetNum.toFixed(2)}</span>
            </div>

            <div className="flex items-center gap-5 my-3">
                {/* Circular Progress Ring using SVG */}
                <div className="relative w-24 h-24 flex-shrink-0">
                    <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                    {/* Background circle */}
                    <circle
                        cx="18" cy="18" r="15.9"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="3"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="18" cy="18" r="15.9"
                        fill="none"
                        stroke={percentUsed >= 90 ? "#ef4444" : percentUsed >= 70 ? "#facc15" : "#22c55e"}
                        strokeWidth="3"
                        strokeDasharray={`${percentUsed}, 100`}
                        strokeLinecap="round"
                        className="transition-all duration-700"
                    />
                    </svg>
                    {/* Percentage text in the middle */}
                    <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-lg font-bold ${budgetTextColor}`}>
                        {percentUsed.toFixed(0)}%
                    </span>
                    </div>
                </div>

                {/* Text beside the ring */}
                <div>
                    <p className={`text-2xl font-bold ${budgetTextColor}`}>
                    RM{totalSpent.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-400">of RM{budgetNum.toFixed(2)} budget</p>
                    <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold
                    ${percentUsed >= 90 ? "bg-red-100 text-red-600"
                        : percentUsed >= 70 ? "bg-yellow-100 text-yellow-600"
                        : "bg-green-100 text-green-600"}`}>
                    {percentUsed >= 90 ? "🚨 Over budget" : percentUsed >= 70 ? "⚠️ Slow down" : "✅ On track"}
                    </span>
                </div>
                </div>


            {/* Warning if over 70% */}
            {percentUsed >= 70 && percentUsed < 100 && (
              <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-700">
                ⚠️ You've used {percentUsed.toFixed(0)}% of your budget. Slow down on eating out!
              </div>
            )}
            {percentUsed >= 100 && (
              <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">
                🚨 You're over budget! Consider cooking at home for the rest of the month.
              </div>
            )}
          </>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl shadow p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{meals.length}</p>
          <p className="text-xs text-gray-400 mt-1">Meals Logged</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4 text-center">
          <p className="text-2xl font-bold text-green-600">
            RM{meals.length > 0 ? (totalSpent / meals.length).toFixed(1) : "0"}
          </p>
          <p className="text-xs text-gray-400 mt-1">Avg per Meal</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4 text-center">
          <p className="text-2xl font-bold text-green-600">
            RM{totalSpent.toFixed(0)}
          </p>
          <p className="text-xs text-gray-400 mt-1">Total Spent</p>
        </div>
      </div>

      {/* Spending by Location */}
      {sortedLocations.length > 0 ? (
        <div className="bg-white rounded-2xl shadow p-5">
          <h3 className="text-sm font-bold text-gray-600 mb-4">
            Spending by Location
          </h3>
          <div className="space-y-3">
            {sortedLocations.map(([loc, amount]) => {
              const pct = (amount / totalSpent) * 100;
              return (
                <div key={loc}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">
                      {LOCATION_LABELS[loc] || loc}
                    </span>
                    <span className="font-bold text-gray-700">
                      RM{amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`${LOCATION_COLORS[loc] || "bg-gray-400"} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {pct.toFixed(0)}% of total spending
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow p-5 text-center text-gray-400 text-sm">
          No meals logged yet. Start logging to see your breakdown!
        </div>
      )}

      {/* Recent Daily Spending */}
      {recentDates.length > 0 && (
        <div className="bg-white rounded-2xl shadow p-5">
          <h3 className="text-sm font-bold text-gray-600 mb-3">
            Recent Daily Spending
          </h3>
          <div className="space-y-2">
            {recentDates.map(([date, amount]) => (
              <div
                key={date}
                className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0"
              >
                <span className="text-sm text-gray-500">{date}</span>
                <span className="text-sm font-bold text-gray-700">
                  RM{amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reset Button */}
      {meals.length > 0 && (
        <button
          onClick={handleReset}
          className="w-full text-xs text-gray-400 underline py-2"
        >
          Reset all data
        </button>
      )}

    </div>
  );
}