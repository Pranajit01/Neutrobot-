# NUTROBOT — Premium Full-Stack Nutrition & Wellness Platform

An editorial, premium Nutrition and Wellness tracking platform built with a **Swiss Brutalist** design system and Warm Organic Atmosphere, powered by an AI Analysis Engine.

---

## 🎨 Design System & Aesthetics
- **Swiss Brutalism**: Strict grids, massive typography, borderless sections, and warm paper-like backgrounds (`#E4E2DD`).
- **Warm Editorial Color Palette**: 
  - Base: `#E4E2DD`
  - Primary text: `#1E1E1E`
  - Accents: Red-Orange (`#DB4A2B`), Warm Orange (`#F8A348`), Soft Pink (`#FF89A9`)
- **Typography**: Display headlines set in Clash Display, body functional text in Satoshi.
- **Background System**: Pulsing blurred radial blobs behind typography and an interactive WebGL "Tubes Cursor" canvas on the Hero section (which randomizes neon colors on click).
- **Motion**: elegant slide-up entry animations powered by `framer-motion` using custom cubic-beziers.

---

## ⚡ Tech Stack
### Frontend
- **React + Vite + TypeScript**
- **Tailwind CSS** (v3.4)
- **Framer Motion** (Motion system)
- **Three.js** (WebGL Tubes Background)
- **Lucide React** (Icons)

### Backend
- **Node.js + Express + TypeScript**
- **PostgreSQL** & **Prisma ORM**
- **Redis** (Daily caching)
- **Anthropic Claude API** (Natural language meal parser)
- **JWT Auth**

---

## 📁 Project Structure
```
nutrobot/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma       # Prisma DB schemas
│   ├── src/
│   │   ├── middleware/
│   │   │   └── auth.ts         # JWT Authenticator
│   │   ├── routes/
│   │   │   ├── auth.ts         # Login & registration
│   │   │   ├── user.ts         # User profiles
│   │   │   └── nutrition.ts    # Heuristic/Claude meal parser
│   │   ├── prisma.ts           # Resilient database connection wrapper
│   │   ├── redis.ts            # Resilient cache connection wrapper
│   │   └── index.ts            # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── layout/         # Navigation, Footer, BackgroundBlobs, PageTransitions
    │   │   └── ui/             # Button system, WebGL Tubes Background
    │   ├── context/
    │   │   └── AuthContext.tsx # User session provider & HTTP client wrapper
    │   ├── pages/
    │   │   ├── AuthPage.tsx    # Brutalist login/register page
    │   │   ├── DashboardPage.tsx # Asymmetrical metrics dashboard
    │   │   ├── FoodLogPage.tsx # Underline inputs natural-language logger
    │   │   ├── HeroPage.tsx    # Big headline and 3D WebGL background
    │   │   └── HistoryPage.tsx # Archive logs list
    │   ├── App.tsx
    │   └── main.tsx
    ├── package.json
    └── tailwind.config.js
```

---

## 🛠️ Getting Started

### 1. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment template to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Start the server in development mode:
   ```bash
   npm run dev
   ```

*Note: The backend features an **Automatic Fallback Engine**. If PostgreSQL or Redis are not running, it will automatically fall back to secure in-memory local data stores. Similarly, if the Anthropic API key is not configured, the app parses meal descriptions using a local keyword heuristics model. This enables zero-config previewing.*

---

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the displayed URL (typically `http://localhost:5173`) in your web browser.
