# FinXAI — Frontend

> A luxury-designed personal finance dashboard with AI-powered insights, receipt scanning, and real-time budget tracking.

🌐 **Live Demo**: [fin-x-ai-frontend-1.vercel.app](https://finxaivercelapp.vercel.app/)

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS + Custom CSS |
| Auth | Clerk React |
| HTTP Client | Axios |
| UI Components | shadcn/ui |
| Icons | Lucide React |
| Notifications | Sonner |
| Routing | React Router DOM v6 |

---

## ✨ Features

- 🔐 **Authentication** — Clerk-powered sign in / sign up with protected routes
- 🏦 **Account Management** — Add multiple accounts, set default, view balances
- 💸 **Transaction Tracking** — Add, edit, delete transactions with category + type filters
- 🧾 **AI Receipt Scanner** — Upload a receipt image → Gemini AI auto-fills transaction fields
- 📊 **Budget Section** — Set monthly budgets with real-time progress bars and alerts
- 🔁 **Recurring Transactions** — View and manage automated recurring entries
- 📈 **Account Detail Page** — Per-account transaction history with income/expense breakdown
- 📱 **Fully Responsive** — Optimized for mobile, tablet, and desktop
- ✉️ **Monthly Report Emails** — AI-generated financial summaries delivered to inbox
- 🎨 **Luxury UI Design** — Glass morphism navbar, gold accent system, smooth animations

---

## 📁 Project Structure

```
frontend/
├── public/
│   └── finxai-luxury.png
├── src/
│   ├── components/
│   ├── lib/
│   │   └── utils.js
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Accountpage.jsx
│   │   ├── AddTransaction.jsx
│   │   ├── Signin.jsx
│   │   ├── Signup.jsx
│   │   ├── Privacypolicy.jsx
│   │   └── Termsofservice.jsx
│   ├── routes/
│   │   └── AppRoutes.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── .env
├── .gitignore
├── vercel.json
├── vite.config.js
└── package.json
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxx
VITE_API_URL=https://your-backend.onrender.com
```

---

## 🛠️ Local Setup

```bash
# Clone repo
git clone https://github.com/yourusername/finxai-frontend.git
cd finxai-frontend

# Install dependencies
npm install

# Add environment variables
cp .env.example .env

# Run development server
npm run dev
```

---

## 📦 Build for Production

```bash
npm run build
```

---

## 🚢 Deployment

Deployed on **Vercel**.

`vercel.json` handles SPA routing:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```



## 🔗 Related

- 🔧 [FinXAI Backend](https://github.com/Mohitsati-gen/FinXAi-backend) — Express API + Inngest + Gemini AI

---

## 📄 License

MIT
