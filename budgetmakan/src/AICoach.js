import { useState } from "react";

const LOCATION_LABELS = {
  mamak: "Mamak",
  canteen: "College Canteen",
  cafe: "Café",
  fastfood: "Fast Food",
  grocery: "Grocery",
  delivery: "Food Delivery",
};

export default function AICoach() {
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [asked, setAsked] = useState(false);

  // Load data from localStorage
  const getMeals = () => {
    const stored = localStorage.getItem("budgetmakan_meals");
    return stored ? JSON.parse(stored) : [];
  };

  const getBudget = () => {
    return localStorage.getItem("budgetmakan_budget") || "300";
  };

  // Summarise meal data into a readable format for the AI
  const buildSummary = (meals, budget) => {
    if (meals.length === 0) return null;

    const totalSpent = meals.reduce((sum, m) => sum + m.price, 0);
    const avgPerMeal = totalSpent / meals.length;

    // Count by location
    const byLocation = meals.reduce((acc, m) => {
      acc[m.location] = (acc[m.location] || 0) + m.price;
      return acc;
    }, {});

    // Count by meal time
    const byTime = meals.reduce((acc, m) => {
      acc[m.mealTime] = (acc[m.mealTime] || 0) + 1;
      return acc;
    }, {});

    // Find most expensive meal
    const mostExpensive = meals.reduce((max, m) =>
      m.price > max.price ? m : max, meals[0]
    );

    const locationSummary = Object.entries(byLocation)
      .sort((a, b) => b[1] - a[1])
      .map(([loc, amt]) => `${LOCATION_LABELS[loc] || loc}: RM${amt.toFixed(2)}`)
      .join(", ");

    const timeSummary = Object.entries(byTime)
      .map(([time, count]) => `${time}: ${count} times`)
      .join(", ");

    return `
      Monthly food budget: RM${budget}
      Total spent so far: RM${totalSpent.toFixed(2)}
      Remaining budget: RM${(parseFloat(budget) - totalSpent).toFixed(2)}
      Number of meals logged: ${meals.length}
      Average spend per meal: RM${avgPerMeal.toFixed(2)}
      Spending by location: ${locationSummary}
      Meal times: ${timeSummary}
      Most expensive single meal: ${mostExpensive.foodName} at RM${mostExpensive.price.toFixed(2)}
      ${meals.filter(m => m.userLocation).length > 0
        ? `Meals with location data: ${meals.filter(m => m.userLocation).length}`
        : "No location data yet"
      }
    `;
  };

    const getAdvice = async () => {
    const meals = getMeals();
    const budget = getBudget();
    const userLocation = JSON.parse(localStorage.getItem("budgetmakan_last_location") || "null");

    if (meals.length < 3) {
      setError("Log at least 3 meals first so the AI has enough data to analyse!");
      return;
    }

    setLoading(true);
    setError("");
    setAdvice("");
    setAsked(true);

    const summary = buildSummary(meals, budget);

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [
                      {
                        text: `You are BudgetMakan AI, a friendly and relatable financial coach for Malaysian university students. Analyse this student's food spending data and give them personalised advice.
          
          Here is their spending summary:
          ${summary}
          
          Give your response in this exact structure:
          1. ONE specific observation about their biggest spending habit (be specific, mention actual numbers)
          2. ONE practical money-saving tip that fits Malaysian student life (mention specific places like mamak, canteen, etc.)
          ${userLocation ? "3. ONE specific nearby place to eat right now that fits their budget" : "3. ONE motivating closing line"}
          
          Keep it friendly, casual, and Malaysian. Use simple English. Maximum 130 words total. Do not use bullet points — write in short paragraphs.`,
                      },
                    ],
                  },
                ],
              }),
            }
          );
          
          const data = await response.json();
          
          if (data.error) {
            setError("API error: " + data.error.message);
          } else {
            setAdvice(data.candidates[0].content.parts[0].text);
          }
    } catch (err) {
      setError("Something went wrong. Check your API key and internet connection.");
    }

    setLoading(false);
  };

  const meals = getMeals();
  const budget = getBudget();
  const totalSpent = meals.reduce((sum, m) => sum + m.price, 0);
  const remaining = parseFloat(budget) - totalSpent;

  return (
    <div className="mt-6 space-y-4">

      {/* Header Card */}
      <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl shadow p-5 text-white">
        <h2 className="text-lg font-bold">🤖 AI Makan Coach</h2>
        <p className="text-sm text-green-100 mt-1">
          Your personal food spending advisor, powered by AI.
        </p>
        <div className="flex gap-4 mt-4">
          <div className="bg-white bg-opacity-20 rounded-xl p-3 flex-1 text-center">
            <p className="text-xl font-bold">RM{totalSpent.toFixed(2)}</p>
            <p className="text-xs text-green-100">Spent</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-xl p-3 flex-1 text-center">
            <p className="text-xl font-bold">RM{remaining.toFixed(2)}</p>
            <p className="text-xs text-green-100">Remaining</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-xl p-3 flex-1 text-center">
            <p className="text-xl font-bold">{meals.length}</p>
            <p className="text-xs text-green-100">Meals</p>
          </div>
        </div>
      </div>

      {/* AI Advice Button */}
      <button
        onClick={getAdvice}
        disabled={loading}
        className={`w-full py-4 rounded-2xl font-bold text-white text-base shadow transition active:scale-95
          ${loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600"}`}
      >
        {loading ? "🤔 Analysing your spending..." : "✨ Get AI Advice"}
      </button>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* AI Response */}
      {advice && (
        <div className="bg-white rounded-2xl shadow p-5 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-lg">
              🤖
            </div>
            <p className="font-bold text-green-700 text-sm">BudgetMakan AI says:</p>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">{advice}</p>
        </div>
      )}

      {/* Prompt to log more meals */}
      {!asked && meals.length < 3 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-sm text-yellow-700 text-center">
          Log at least 3 meals first to unlock AI advice! 🍜
        </div>
      )}
      
      {/* Display sort by type */}
      {meals.length > 0 && (
        <div className="bg-white rounded-2xl shadow p-5">
            <h2 className="text-sm font-bold text-gray-600 mb-4">Spending by Type</h2>
            <div className="space-y-3">
            {Object.entries(
                meals.reduce((acc, meal) => {
                acc[meal.location] = (acc[meal.location] || 0) + meal.price;
                return acc;
                }, {})
            )
                .sort((a, b) => b[1] - a[1]) // sort highest to lowest
                .map(([type, amount]) => {
                const total = meals.reduce((sum, m) => sum + m.price, 0);
                const pct = Math.round((amount / total) * 100);

                const LABELS = {
                    mamak: "🍽️ Mamak",
                    canteen: "🏫 Canteen",
                    cafe: "🧋 Café",
                    fastfood: "🍔 Fast Food",
                    grocery: "🛒 Grocery",
                    delivery: "📦 Delivery",
                    other: "✏️ Other",
                };

                const COLORS = {
                    mamak: "bg-yellow-400",
                    canteen: "bg-blue-400",
                    cafe: "bg-purple-400",
                    fastfood: "bg-red-400",
                    grocery: "bg-green-400",
                    delivery: "bg-orange-400",
                    other: "bg-gray-400",
                };

                return (
                    <div key={type}>
                    {/* Type label + amount */}
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">
                        {LABELS[type] || type}
                        </span>
                        <span className="text-sm font-bold text-gray-700">
                        RM{amount.toFixed(2)}
                        </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div
                        className={`${COLORS[type] || "bg-gray-400"} h-3 rounded-full transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                        />
                    </div>

                    {/* Percentage label */}
                    <p className="text-xs text-gray-400 mt-0.5">{pct}% of total</p>
                    </div>
                );
          })}
    </div>
  </div>
)}
    </div>
  );
}