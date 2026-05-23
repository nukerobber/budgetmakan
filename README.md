# 🍜 BudgetMakan

> **Your AI-powered food spending coach for Malaysian university students.**

Built for **Hackathon X Fintech Forward 2026** — Track 1: Reimagine Money  
Organised by Be U by Bank Islam × UMPSA

---

## 🎯 The Problem

Malaysian university students eat out constantly but have no idea how much they're spending on food. By mid-month, the allowance is gone and they don't know where it went. Nobody taught them to budget — and generic budgeting apps don't understand mamak prices, DuitNow culture, or student life.

**BudgetMakan** is built specifically for this person.

---

## ✨ Features

### 🍽️ Meal Logger
- Log what you ate, where, and how much
- Choose from Malaysian-relevant locations: Mamak, College Canteen, Café, Fast Food, Grocery, Food Delivery
- Track by meal time: Breakfast, Lunch, Dinner
- Add a custom location when needed
- View and delete recent meals

### 📍 Live Location
- Tap "Use My Location" to grab your GPS coordinates
- See an interactive Google Map centred on your position
- Nearby restaurants shown as markers within 500m
- Location is saved with your meal for AI context

### 📊 Spending Dashboard
- Circular progress ring showing budget used (green → yellow → red)
- Smart warnings at 70% and 90% of budget
- Spending breakdown by location with colour-coded bars
- Summary cards: total meals, average per meal, total spent
- Daily spending history
- Editable monthly food budget

### 🤖 AI Makan Coach
- Powered by Google Gemini AI
- Analyses your real meal history and spending patterns
- Gives one specific observation with actual numbers
- Suggests practical money-saving tips for Malaysian student life
- Recommends where to eat nearby based on your current location
- Friendly, casual, Malaysian English — not generic finance advice

---

## 🛠️ Tech Stack

| Layer | Tool |
|---|---|
| Frontend | React |
| Styling | Tailwind CSS |
| Storage | localStorage (no backend needed) |
| AI | Google Gemini API (`gemini-2.5-flash`) |
| Maps | Google Maps JavaScript API + Places API |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (LTS)
- A Google Gemini API key — [Get one here](https://aistudio.google.com)
- A Google Maps API key — [Get one here](https://console.cloud.google.com)

### Installation

```bash
git clone https://github.com/yourusername/budgetmakan.git
cd budgetmakan
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

### Run Locally

```bash
npm start
```

App will open at `http://localhost:3000`

---

## 📁 Project Structure

```
src/
├── App.js            # Main app — navigation between screens
├── MealLogger.js     # Screen 1 — log meals + location
├── Dashboard.js      # Screen 2 — spending breakdown + budget ring
├── AICoach.js        # Screen 3 — AI-powered spending advice
├── LocationPicker.js # Component — live GPS map + nearby restaurants
└── Onboarding.js     # First-time welcome flow — name, budget setup, app intro slides
```

---

## 🤖 AI Tools Used

| Tool | How it was used |
|---|---|
| Google Gemini API | Core AI engine for spending analysis and meal suggestions |
| Google Maps JS API | Rendering live map and user location |
| Google Places API | Finding nearby restaurants within 500m |
| Claude (Anthropic) | Used during development for code generation and debugging |

---

## 👤 Target User

**A student in Malaysia**  
Gets RM500 allowance a month. Eats out every day. Has no idea where his money goes. Finds budgeting apps boring and complicated. Wishes someone would just tell him straight — *"bro, you're spending too much at McDonald's."*

BudgetMakan is built for a student who need assistant to eat.

---

## 🏆 Hackathon Track

**Track 1: Reimagine Money**  
Problem space: Money Habits — Saving, Spending, and Knowing Better

---

