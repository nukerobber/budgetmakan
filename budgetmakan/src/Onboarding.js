import { useState } from "react";

const SLIDES = [
  {
    emoji: "🍜",
    title: "Welcome to BudgetMakan",
    desc: "Your personal food spending coach, built for Malaysian uni students.",
    color: "from-green-400 to-green-600",
  },
  {
    emoji: "📝",
    title: "Log Every Meal",
    desc: "Track what you eat, where you eat, and how much you spend — in seconds.",
    color: "from-blue-400 to-blue-600",
  },
  {
    emoji: "📊",
    title: "See Where It Goes",
    desc: "Your dashboard shows exactly how much you're spending at mamak, canteen, fast food and more.",
    color: "from-purple-400 to-purple-600",
  },
  {
    emoji: "🤖",
    title: "Get AI Advice",
    desc: "Our AI coach analyses your habits and tells you exactly how to save more — with real numbers.",
    color: "from-orange-400 to-orange-600",
  },
];

export default function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [nameError, setNameError] = useState("");
  const [budgetError, setBudgetError] = useState("");

  const isLastSlide = step === SLIDES.length;

  const handleNext = () => {
    if (step < SLIDES.length) {
      setStep(step + 1);
    }
  };

  const handleFinish = () => {
    if (!name.trim()) return setNameError("Please enter your name.");
    if (!budget || isNaN(budget) || Number(budget) <= 0)
      return setBudgetError("Please enter a valid budget.");

    // Save name and budget to localStorage
    localStorage.setItem("budgetmakan_name", name.trim());
    localStorage.setItem("budgetmakan_budget", budget);
    localStorage.setItem("budgetmakan_onboarded", "true");

    onDone();
  };

  const slide = SLIDES[step];

  return (
    <div className="min-h-screen bg-green-50 flex flex-col">

      {/* Skip button */}
      {!isLastSlide && (
        <div className="flex justify-end p-4">
          <button
            onClick={() => setStep(SLIDES.length)}
            className="text-xs text-gray-400 underline"
          >
            Skip
          </button>
        </div>
      )}

      {/* Slide content */}
      {!isLastSlide && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center space-y-6">

          {/* Emoji circle */}
          <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${slide.color}
                          flex items-center justify-center text-6xl shadow-lg`}>
            {slide.emoji}
          </div>

          {/* Text */}
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-gray-800">{slide.title}</h1>
            <p className="text-gray-500 text-sm leading-relaxed">{slide.desc}</p>
          </div>

          {/* Dot indicators */}
          <div className="flex gap-2">
            {SLIDES.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300
                  ${i === step ? "w-6 bg-green-500" : "w-2 bg-gray-300"}`}
              />
            ))}
          </div>

          {/* Next button */}
          <button
            onClick={handleNext}
            className="w-full max-w-xs bg-green-500 hover:bg-green-600 text-white
                       font-bold py-3 rounded-2xl transition active:scale-95 shadow"
          >
            Next →
          </button>

        </div>
      )}

      {/* Setup screen — last step */}
      {isLastSlide && (
        <div className="flex-1 flex flex-col justify-center px-6 space-y-6 max-w-md mx-auto w-full">

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="text-5xl">👋</div>
            <h1 className="text-2xl font-bold text-gray-800">Let's set you up</h1>
            <p className="text-sm text-gray-500">Just two quick things before we start.</p>
          </div>

          {/* Name input */}
          <div className="bg-white rounded-2xl shadow p-5 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">
                What's your name?
              </label>
              <input
                type="text"
                placeholder="e.g. Aiman, Siti, Raj..."
                value={name}
                onChange={(e) => { setName(e.target.value); setNameError(""); }}
                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
            </div>

            {/* Budget input */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Monthly food budget (RM)
              </label>
              <p className="text-xs text-gray-400 mb-1">
                Most students spend between RM150–RM400 on food per month.
              </p>
              <div className="flex items-center border border-gray-200 rounded-xl px-4 py-2
                              focus-within:ring-2 focus-within:ring-green-400">
                <span className="text-gray-400 text-sm mr-2">RM</span>
                <input
                  type="number"
                  placeholder="e.g. 300"
                  value={budget}
                  onChange={(e) => { setBudget(e.target.value); setBudgetError(""); }}
                  className="flex-1 text-sm focus:outline-none"
                />
              </div>
              {budgetError && <p className="text-red-500 text-xs mt-1">{budgetError}</p>}
            </div>

            {/* Quick budget presets */}
            <div>
              <p className="text-xs text-gray-400 mb-2">Quick select:</p>
              <div className="flex gap-2">
                {["150", "200", "300", "400"].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => { setBudget(amt); setBudgetError(""); }}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-medium border transition
                      ${budget === amt
                        ? "bg-green-100 border-green-500 text-green-700"
                        : "bg-white border-gray-200 text-gray-500"}`}
                  >
                    RM{amt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Finish button */}
          <button
            onClick={handleFinish}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold
                       py-4 rounded-2xl transition active:scale-95 shadow text-base"
          >
            Let's go! 🍜
          </button>

        </div>
      )}

    </div>
  );
}