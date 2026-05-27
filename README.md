# StandupBot 🤖

### Async Team Standup Tool with AI + Slack

> Submit standups. Detect blockers. Notify your team. All automated.

**React** **Node.js** **MongoDB** **Groq AI** **Slack**

---
## 📸 Preview
## 📸 Preview

<table>
  <tr>
    <td width="50%">
      <p align="center"><b>📊 Main Dashboard</b></p>
      <img src="./frontend/src/assets/images/Screenshot%202026-05-27%20181225.png" alt="Dashboard" width="100%">
    </td>
    <td width="50%">
      <p align="center"><b>💬 Slack Integration & AI Alerts</b></p>
      <!-- Note: Agar ye image .png hai toh .png hi rehne dein, agar .jpg hai toh niche .jpg kar lena -->
      <img src="./frontend/src/assets/images/Screenshot%202026-05-27%20182956.png" alt="Slack Integration" width="100%">
    </td>
  </tr>
  <tr>
    <td width="50%">
      <p align="center"><b>📋 AI-Generated Weekly Summary</b></p>
      <img src="./frontend/src/assets/images/Screenshot%202026-05-27%20181328.png" alt="Weekly Summary" width="100%">
    </td>
    <td width="50%">
      <p align="center"><b>📈 Team Analytics & Blockers</b></p>
      <img src="./frontend/src/assets/images/Screenshot%202026-05-27%20183153.png" alt="Analytics 1" width="100%">
      <img src="./frontend/src/assets/images/Screenshot%202026-05-27%20183206.png" alt="Analytics 2" width="100%" style="margin-top: 10px;">
    </td>
  </tr>
</table>
---

## ✨ Features

### 🔐 Authentication

- Register with name, email, password, team name and role
- JWT secured sessions
- Team-scoped data — only your team's standups visible
- Slack notification when new member joins

### 📝 Daily Standups

- Submit Yesterday, Today, Blockers in under 2 minutes
- AI (Groq Llama 3.3) classifies every blocker automatically
- Severity levels — 🚨 Critical / ⚠️ Moderate / 👀 Watch / ✅ None
- Edit your own standup — diff view shows exactly what changed
- Delete your own standup — others cannot touch yours

### 💬 Slack Integration

- New standup submitted → Slack notification
- Standup edited → Slack notification with what changed
- Standup deleted → Slack notification
- New member registered → Slack notification
- 9 AM daily reminder → who has and hasn't submitted

### 📊 Dashboard

- Team metrics — Total, Blocked, On Track, Critical
- Filter by Today / Week / Month / All Time
- Search by team member name
- Critical blocker banner with AI action for manager
- Role and team name on every standup card

### 📜 History

- Full standup history with role badges and team names
- Edited indicator with diff view
- Export to CSV — one click download

### 📈 Analytics

- Area chart — daily standups vs blockers trend
- Donut chart — AI severity breakdown
- Member activity ranking with progress bars
- Blocker rate calculation

### 👥 Members & Blockers

- Member cards with role, stats, on-track percentage
- Active blockers sorted by severity
- AI action needed per blocker

### 📋 Weekly Summary

- Auto-generates every Friday 6:00 PM IST
- AI summarizes — critical issues, wins, recommendation
- Posts to Slack automatically
- Full history kept on dashboard
- Manual generate button available

---

## 🛠️ Tech Stack

```
Frontend     →  React 18, Redux Toolkit, Tailwind CSS v4, Vite
Backend      →  Node.js, Express.js
Database     →  MongoDB Atlas, Mongoose
AI           →  Groq SDK — Llama 3.3 70B (free)
Slack        →  Incoming Webhooks, Block Kit
Auth         →  JWT, bcryptjs
Charts       →  Recharts
Scheduling   →  node-cron
Export       →  json2csv
Icons        →  React Icons, Tabler Icons
Deployment   →  Vercel + Render + MongoDB Atlas
```

---

## 📁 Project Structure

```
standupbot/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT protect
│   ├── models/
│   │   ├── User.js                # User schema
│   │   ├── Team.js                # Team schema
│   │   ├── Standup.js             # Standup schema
│   │   └── WeeklySummary.js       # Weekly summary schema
│   ├── routes/
│   │   ├── auth.js                # Register, Login, Me
│   │   ├── standup.js             # CRUD + Export
│   │   └── weeklySummary.js       # Get + Generate
│   ├── services/
│   │   ├── aiService.js           # Groq blocker analysis
│   │   ├── slackService.js        # All Slack notifications
│   │   └── weeklyService.js       # Weekly AI summary
│   ├── .env
│   ├── package.json
│   └── server.js                  # Express app + cron jobs
│
└── frontend/
    └── src/
        ├── components/
        │   ├── Sidebar.jsx         # Navigation
        │   ├── StandupCard.jsx     # Card with diff view
        │   ├── EditModal.jsx       # Edit standup modal
        │   ├── DiffText.jsx        # Change highlighting
        │   ├── BlockerBanner.jsx   # Critical alert
        │   ├── EmptyState.jsx
        │   └── LoadingState.jsx
        ├── pages/
        │   ├── Dashboard.jsx       # Main team view
        │   ├── Submit.jsx          # Submit form
        │   ├── History.jsx         # History + CSV export
        │   ├── Members.jsx         # Team members
        │   ├── Blockers.jsx        # Active blockers
        │   ├── Analytics.jsx       # Charts
        │   ├── WeeklySummary.jsx   # Weekly reports
        │   └── Login.jsx           # Auth page
        └── store/
            └── slices/
                ├── authSlice.js
                ├── standupSlice.js
                └── weeklySlice.js
```

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/standupbot.git
cd standupbot
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key_here
GROQ_API_KEY=your_groq_api_key
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx/xxx/xxx
```

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

### 4. Open browser

```
http://localhost:5173
```

Register → Submit standup → Check Slack! 🎉

---

## 🌐 API Endpoints

```
POST   /api/auth/register          →  Register new user
POST   /api/auth/login             →  Login
GET    /api/auth/me                →  Current user

POST   /api/standup                →  Submit standup
GET    /api/standup                →  Get team standups
PUT    /api/standup/:id            →  Edit own standup
DELETE /api/standup/:id            →  Delete own standup
GET    /api/standup/export         →  Export CSV

GET    /api/weekly                 →  Get weekly summaries
POST   /api/weekly/generate        →  Generate manually

GET    /api/health                 →  Health check
```

---

## ⚡ Cron Jobs

```
Every day   9:00 AM IST  →  Slack reminder — who submitted today
Every Fri   6:00 PM IST  →  AI weekly summary → Slack + Dashboard
```

---

## 🚢 Deployment

```
Frontend  →  Vercel       (npm run build → deploy /dist)
Backend   →  Render       (node server.js, free tier)
Database  →  MongoDB Atlas (free M0 cluster)
```

Add `VITE_API_URL=https://your-backend.onrender.com` to Vercel environment variables.

---

## 👩‍💻 Author

**Neha Singh**

[![GitHub](https://img.shields.io/badge/GitHub-000?style=flat&logo=github)](https://github.com/yourusername)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin)](https://linkedin.com/in/yourusername)

---

## 📄 License

MIT License — feel free to use and modify.

---

_Built with ❤️ for teams who want standups without the meetings_

⭐ Give it a star if you found it useful!
