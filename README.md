# NewsForYou 📰

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-blue?style=for-the-badge&logo=vercel)](https://news-for-u.vercel.app)

## Description

**NewsForYou** is a personalized news aggregation platform that delivers curated news articles tailored to each user's interests. Users sign in with a passwordless OTP (one-time password) sent to their email, select up to 4 topic categories they care about, and receive a clean, bookmarkable dashboard of relevant headlines — plus optional morning/night email digest reminders.

---

## Features

- 🔐 **Passwordless Authentication** — OTP-based login via email (no passwords stored)
- 🎯 **Personalized News Feed** — Articles filtered by user-selected interests
- 📚 **Bookmarks** — Save/remove articles for later reading
- 🗂️ **Category Browsing** — Browse articles by category (Technology, Sports, Business, etc.)
- 📬 **Email Digest Reminders** — Scheduled morning (6:05 AM) & night (9:00 PM) reminder emails
- 🔄 **Background News Fetching** — Automated cron job fetches fresh articles from NewsAPI
- ⚡ **Job Queue** — BullMQ + Redis for reliable background email delivery
- 🛡️ **Rate Limiting & Security** — OTP rate limiting, Helmet.js headers, HTTP-only JWT cookies
- 📱 **Responsive UI** — Modern, responsive design with smooth page transitions

---

## Screenshots

| Landing Page | Dashboard |
|---|---|
| ![Landing Page](./screenshots/Screenshot%20from%202026-04-16%2014-31-50.png) | ![Dashboard](./screenshots/Screenshot%20from%202026-04-16%2014-33-56.png) |

| Login / OTP | Register - Interests |
|---|---|
| ![Login](./screenshots/Screenshot%20from%202026-04-16%2014-33-02.png) | ![Register](./screenshots/Screenshot%20from%202026-04-16%2014-33-09.png) |

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI library |
| Vite | Build tool & dev server |
| React Router DOM v7 | Client-side routing |
| Tailwind CSS v4 | Utility-first styling |
| Radix UI | Accessible UI primitives |
| Lucide React | Icon library |
| React Hook Form + Zod | Form handling & validation |
| Sonner | Toast notifications |
| Recharts | Data visualizations |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express v5 | REST API server |
| MongoDB + Mongoose | Database & ODM |
| Redis + BullMQ | Job queue for email workers |
| JSON Web Tokens (JWT) | Stateless auth via HTTP-only cookies |
| Brevo (Sendinblue) API | Transactional email delivery |
| NewsAPI | News article source |
| node-cron | Scheduled jobs |
| Helmet.js | HTTP security headers |
| express-rate-limit | API rate limiting |

---

## Installation

### Prerequisites
- Node.js >= 18
- npm >= 10
- MongoDB running locally or a MongoDB Atlas connection string
- Redis running locally or a Redis Cloud instance
- [Brevo](https://www.brevo.com/) account for email delivery
- [NewsAPI](https://newsapi.org/) key for fetching articles

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/NewsForYou.git
cd NewsForYou
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/newsforyou

REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=

JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d

BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=noreply@yourdomain.com
BREVO_SENDER_NAME=NewsForYou

NEWS_APIKEY=your_newsapi_key
FRONTEND_URL=http://localhost:5173
```

Start the backend:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Usage

1. **Visit** the landing page and click **Get Started**.
2. **Enter your email** — an OTP will be sent.
3. **Enter the OTP** to verify your identity.
4. **New users**: Select up to 4 interest categories, then choose a notification time (morning/night).
5. **Dashboard**: Browse your personalized news feed, explore categories, and bookmark articles.
6. **Bookmarks**: Access saved articles anytime from the bookmarks tab.

---

## API Endpoints

### Auth Routes — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/send-otp` | Public | Send OTP to email |
| `POST` | `/verify-otp` | Public | Verify OTP and issue JWT cookie |
| `POST` | `/logout` | Public | Clear auth cookie |
| `GET` | `/me` | 🔒 Protected | Get current user profile |
| `POST` | `/register/interests` | 🔒 Protected | Save user interests (creates account for new users) |
| `POST` | `/register/notification` | 🔒 Protected | Save notification preference & complete registration |

### News Routes — `/api/news`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/articles` | 🔒 Protected | List articles (`?category=&page=&limit=`) |
| `GET` | `/feed` | 🔒 Protected | Personalized feed based on user interests |
| `GET` | `/stats` | Public | Article count breakdown by category |
| `GET` | `/bookmarks` | 🔒 Protected | Get all bookmarked articles |
| `POST` | `/bookmarks/:articleId` | 🔒 Protected | Toggle bookmark on/off |
| `POST` | `/fetch` | Dev only | Manually trigger NewsAPI fetch pipeline |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Server health status |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                    NewsForYou                                           │
└─────────────────────────────────────────────────────────────────────────────────────────┘

 ┌──────────────────┐        ┌─────────────────────┐        ┌──────────────────────────┐
 │   USER BROWSER   │        │    REST API LAYER   │        │      CORE SERVICES       │
 │  (React + Vite)  │        │  (Express / Node)   │        │                          │
 │                  │        │                     │        │  ┌────────────────────┐  │
 │  ┌────────────┐  │  HTTP  │  ┌───────────────┐  │        │  │  Auth Controller   │  │
 │  │ Landing Pg │  │◄──────►│  │ /api/auth     │──┼───────►│  │  (OTP + JWT)       │  │
 │  ├────────────┤  │        │  ├───────────────┤  │        │  ├────────────────────┤  │
 │  │ Login Page │  │        │  │ /api/news     │──┼───────►│  │  News Controller   │  │
 │  ├────────────┤  │        │  ├───────────────┤  │        │  │  (Feed/Bookmarks)  │  │
 │  │ Register   │  │        │  │ /api/health   │  │        │  ├────────────────────┤  │
 │  ├────────────┤  │        │  └───────────────┘  │        │  │  News Fetcher Svc  │  │
 │  │ Dashboard  │  │        │                     │        │  │  (NewsAPI client)  │  │
 │  └────────────┘  │        └─────────────────────┘        │  └────────────────────┘  │
 └──────────────────┘                                        └──────────────────────────┘
                                                                          │
          ┌───────────────────────────────────────────────────────────────┘
          │
          ▼
 ┌──────────────────────┐        ┌─────────────────────────────────────────────────────┐
 │  BACKGROUND WORKERS  │        │                  DATA / EXTERNAL                    │
 │                      │        │                                                     │
 │  ┌────────────────┐  │        │  ┌─────────────┐   ┌─────────────┐                 │
 │  │ BullMQ Email   │  │        │  │  MongoDB    │   │    Redis    │                 │
 │  │ Queue          │──┼───────►│  │  ┌────────┐ │   │  ┌────────┐ │                 │
 │  ├────────────────┤  │        │  │  │ Users  │ │   │  │  OTPs  │ │                 │
 │  │ Email Worker   │  │        │  │  ├────────┤ │   │  ├────────┤ │                 │
 │  │ (via Brevo)    │  │        │  │  │Articles│ │   │  │ Queue  │ │                 │
 │  ├────────────────┤  │        │  │  └────────┘ │   │  └────────┘ │                 │
 │  │ News Cron Job  │  │        │  └─────────────┘   └─────────────┘                 │
 │  │ (fetch news)   │  │        │                                                     │
 │  ├────────────────┤  │        │  ┌─────────────┐   ┌─────────────┐                 │
 │  │ Digest Cron    │  │        │  │   NewsAPI   │   │  Brevo API  │                 │
 │  │ (6AM / 9PM)    │  │        │  │  (articles) │   │   (email)   │                 │
 │  └────────────────┘  │        │  └─────────────┘   └─────────────┘                 │
 └──────────────────────┘        └─────────────────────────────────────────────────────┘
```

---

## How It Works

### Authentication Flow
1. User enters their email → OTP is generated and queued as a BullMQ job
2. BullMQ email worker sends the OTP via Brevo transactional email
3. User verifies OTP → JWT is issued and set as an HTTP-only cookie
4. **New users** go through a 2-step onboarding: pick interests → set notification time
5. **Returning users** are redirected directly to the dashboard

### News Pipeline
1. A `node-cron` job runs periodically to call the NewsAPI
2. Articles are fetched across all 7 supported categories and stored in MongoDB (deduplication via URL)
3. The `/feed` endpoint filters stored articles by the user's selected interest categories
4. The `/articles` endpoint supports pagination and category filtering

### Email Digest
- Two cron jobs run daily: 6:05 AM (morning users) and 9:00 PM (night users)
- Each job queries registered users with the matching `notificationTime` preference
- A reminder email job is queued per user — the BullMQ worker handles actual delivery via Brevo

### Security
- JWT stored in HTTP-only, `SameSite` cookies (not accessible to JavaScript)
- OTP rate-limited to 15 requests per IP per 15 minutes
- Helmet.js sets security HTTP headers
- OTPs are hashed before storage in Redis with a 10-minute TTL and deleted after single use

---

## Folder Structure

```
NewsForYou/
├── backend/
│   ├── src/
│   │   ├── app.js                  # Express app setup (middleware, routes)
│   │   ├── config/                 # DB & Redis connection config
│   │   ├── controllers/
│   │   │   ├── auth.controller.js  # OTP, registration, logout logic
│   │   │   └── news.controller.js  # Articles, feed, bookmarks logic
│   │   ├── cron/
│   │   │   ├── newsCron.js         # Scheduled NewsAPI fetch job
│   │   │   └── digestCron.js       # Morning/night reminder email jobs
│   │   ├── middleware/
│   │   │   └── auth.middleware.js  # JWT protect & protectRegistration guards
│   │   ├── models/
│   │   │   ├── User.js             # User schema (email, interests, bookmarks)
│   │   │   └── NewsArticle.js      # Article schema
│   │   ├── queues/
│   │   │   ├── emailQueue.js       # BullMQ queue definitions
│   │   │   └── emailWorker.js      # Worker: sends emails via Brevo
│   │   ├── services/
│   │   │   └── newsFetcher.service.js  # NewsAPI fetch & upsert logic
│   │   └── utils/
│   │       ├── otp.js              # OTP generation, hashing, Redis storage
│   │       └── jwt.js              # Token signing & cookie options
│   ├── server.js                   # Server entrypoint
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                 # Root router with route guards
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx     # Marketing landing page
│   │   │   ├── LoginPage.jsx       # Email + OTP login flow
│   │   │   ├── RegisterPage.jsx    # Onboarding (interests + notifications)
│   │   │   ├── DashboardPage.jsx   # Main news feed & bookmarks
│   │   │   ├── LinkPage.jsx        # Bank link page
│   │   │   └── NotFoundPage.jsx    # 404 page
│   │   ├── components/             # Reusable UI components
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # Global auth state
│   │   │   ├── BookmarkContext.jsx # Bookmark state
│   │   │   └── LoadingContext.jsx  # Page loading state
│   │   ├── hooks/                  # Custom React hooks
│   │   └── lib/                    # Utility functions
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── screenshots/                    # App screenshots
```

---

## Future Improvements

- [ ] **Search** — Full-text search across stored articles
- [ ] **Read Later / Article Detail** — Dedicated article reading view
- [ ] **Push Notifications** — Browser push notifications in addition to email digests
- [ ] **More News Sources** — Integrate additional news APIs for greater coverage
- [ ] **Dark / Light Theme Toggle** — User-controlled theme preference
- [ ] **Admin Dashboard** — Monitor article stats, user counts, queue health
- [ ] **Mobile App** — React Native companion app

---

## Author

**Viswanathan** — Built with ❤️ as a full-stack project.

> Feel free to open issues or pull requests for improvements!
