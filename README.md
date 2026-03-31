# 🏌️ Golf Charity Subscription Platform

A full-stack web application where golfers can track their performance, participate in prize draws, and contribute to charities through a subscription-based model.

---

## 🚀 Tech Stack

**Frontend**

* React (Vite)
* TypeScript
* Tailwind CSS
* Framer Motion

**Backend & Database**

* Supabase (PostgreSQL)
* Supabase Auth (Authentication)
* Row Level Security (RLS)

---

## ✨ Features

* 🔐 User Authentication (Signup & Login)
* 📊 Score Tracking (Stableford format)
* 🎯 Dashboard with recent scores and stats
* ❤️ Charity integration (UI implemented)
* 💳 Subscription module (UI ready)
* 📱 Fully responsive modern UI

---

## ⚙️ Setup Instructions

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/golf-charity-app.git
cd golf-charity-app
```

Install dependencies:

```bash
npm install
```

Run the app:

```bash
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory and add:

```env
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_public_anon_key
```

---

## 🌐 Live Demo

👉 (Add your Vercel link here after deployment)

---

## 📌 Notes

* Some features like subscription payments and advanced charity logic are partially implemented.
* The project focuses on core full-stack architecture, authentication, and data handling.

---

## 👨‍💻 Author

**Rishu Kumar**

---

## 💡 Future Improvements

* Stripe payment integration
* Full charity selection logic with secure RLS
* Enhanced analytics dashboard
* Admin panel for managing draws and users
