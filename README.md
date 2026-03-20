# SignLingo — Frontend

> An interactive web application for learning and practicing **Indian Sign Language (ISL)** and **American Sign Language (ASL)**, powered by real-time AI recognition models.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Real-Time Sign Detection** | Webcam-based ISL & ASL alphabet recognition via AI models |
| **Text-to-Sign Translation** | Convert text and speech into sign language animations |
| **Interactive Lessons** | Structured lesson modules with progress tracking |
| **Practice & Quizzes** | Daily quests, flashcards, and writing/tracing exercises |
| **ISL & ASL Dictionaries** | Searchable dictionaries with video references |
| **User Profiles** | Progress analytics, weekly charts, and achievement tracking |
| **Dark Mode** | System-wide light/dark theme toggle |
| **Multi-Language** | ISL / ASL language context switching |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + Vite 7 |
| **Routing** | React Router v7 |
| **Styling** | Tailwind CSS 3 |
| **Animations** | GSAP · Framer Motion |
| **3D** | Three.js (avatar rendering) |
| **HTTP** | Axios (with interceptors & JWT auth) |
| **Webcam** | react-webcam |
| **Speech** | react-speech-recognition |
| **Canvas** | react-canvas-draw (tracing pad) |
| **Linting** | ESLint 9 |
| **Containerization** | Docker (nginx) |

---

## 📁 Project Structure

```
frontend/
├── public/                     # Static assets
├── src/
│   ├── Animations/             # Lottie / animation assets
│   ├── Models/                 # 3D model files (.glb)
│   ├── assets/                 # Images and static media
│   ├── components/
│   │   ├── Dashboard.tsx       # Main dashboard with stats & nav
│   │   ├── Login.tsx           # Login page
│   │   ├── Signup.tsx          # Registration page
│   │   ├── Translator.tsx      # Text/speech → sign language
│   │   ├── SignToWord.tsx      # Webcam → sign recognition (ISL/ASL)
│   │   ├── Practice.tsx        # Alphabet practice with webcam
│   │   ├── TracingPad.tsx      # Finger-tracing letter practice
│   │   ├── Lessons.tsx         # Structured lesson modules
│   │   ├── Flashcards.tsx      # Flashcard-based learning
│   │   ├── DailyQuest.tsx      # Daily quiz challenges
│   │   ├── Dictionary.tsx      # ISL dictionary browser
│   │   ├── ASLDictionary.jsx   # ASL dictionary with video viewer
│   │   ├── UserProfile.tsx     # Profile, analytics & settings
│   │   ├── Avatar3D.jsx        # Three.js sign language avatar
│   │   ├── BottomNav.tsx       # Mobile bottom navigation bar
│   │   ├── LanguageToggle.jsx  # ISL / ASL language switcher
│   │   ├── ConnectionTest.jsx  # Backend connectivity tester
│   │   └── AnimatedContent.tsx # Shared animation wrapper
│   ├── context/
│   │   └── LanguageContext.jsx # ISL/ASL language provider
│   ├── services/
│   │   └── api.js              # Axios API client (6 modules)
│   ├── utils/
│   │   ├── HandwritingValidator.ts  # Letter stroke validation
│   │   ├── LetterCheckpoints.ts     # Per-letter checkpoint data
│   │   ├── isl_dictionary.csv       # ISL word mappings
│   │   └── asl_dictionary.csv       # ASL word mappings
│   ├── App.jsx                 # Root component & routes
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles & Tailwind directives
├── Dockerfile                  # Multi-stage build (Node → Nginx)
├── docker-compose.yml          # Frontend container orchestration
├── nginx.conf                  # Nginx config with API reverse proxies
├── vite.config.js              # Vite dev server & proxy config
├── tailwind.config.js          # Tailwind CSS configuration
├── package.json
└── .dockerignore
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **npm** ≥ 10
- **Docker** (optional, for containerized deployment)

### Backend Services

The frontend connects to three backend services:

| Service | Default Port | Purpose |
|---|---|---|
| **Backend API** | `5002` | Auth, user data, learning content, progress |
| **ISL Alphabet Service** | `8003` | Indian Sign Language recognition (LSTM) |
| **ASL Alphabet Service** | `8005` | American Sign Language recognition (YOLOv11s) |

> Make sure these services are running before starting the frontend.

---

### Local Development

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Start the dev server
npm run dev
```

The app will be available at **http://localhost:3000**.

Vite's dev server automatically proxies API requests:

| Frontend Path | Proxied To |
|---|---|
| `/api/v1/*` | `http://localhost:5002/api/v1/*` |
| `/health` | `http://localhost:5002/health` |
| `/model-api/*` | `http://localhost:8003/*` |
| `/asl-api/*` | `http://localhost:8005/*` |

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:5002/api/v1` | Backend API base URL |

Set in a `.env` file or pass as a Docker build arg.

---

### Docker Deployment

```bash
# Build and run with Docker Compose
docker compose up -d

# Or build manually
docker build -t signbridge-frontend .
docker run -p 3000:80 signbridge-frontend
```

The Docker image uses a **multi-stage build**:

1. **Build stage** — `node:20-alpine` runs `npm ci --legacy-peer-deps` and `vite build`
2. **Serve stage** — `nginx:1.25-alpine` serves the static bundle and reverse-proxies API routes

#### Nginx Reverse Proxy

In production (Docker), nginx replaces Vite's dev proxy. It routes API requests to backend services via `host.docker.internal`:

```
/api/v1/*    →  host.docker.internal:5002
/health      →  host.docker.internal:5002
/model-api/* →  host.docker.internal:8003  (prefix stripped)
/asl-api/*   →  host.docker.internal:8005  (prefix stripped)
```

> **Note:** `host.docker.internal` allows the frontend container to reach services exposed on the host machine. This works on macOS and Windows natively. On Linux, the `extra_hosts` directive in `docker-compose.yml` handles it.

---

## 📡 API Service Layer

All HTTP communication is centralized in `src/services/api.js`. The module exports six API namespaces:

### `authAPI` — Authentication
| Method | Endpoint | Description |
|---|---|---|
| `register(userData)` | `POST /auth/register` | Create new account |
| `login(credentials)` | `POST /auth/login` | Login, returns JWT |
| `getProfile()` | `GET /user/profile` | Fetch user profile |
| `updateProfile(data)` | `PUT /user/profile` | Update profile fields |
| `uploadProfilePicture(imageData)` | `POST /user/profile/picture` | Upload avatar (FormData or base64) |

### `convertAPI` — Sign Language Conversion (Core)
| Method | Endpoint | Description |
|---|---|---|
| `textToSign(data)` | `POST /convert/text-to-sign` | Text → sign animation data |
| `signToText(imageData, modelUrl?)` | `POST {model}/predict` | Webcam frame → detected sign |
| `speechToSign(data)` | `POST /convert/speech-to-sign` | Speech → sign animation data |
| `modelHealthCheck(modelUrl?)` | `GET {model}/` | Check model service health |

### `learningAPI` — Learning Content
| Method | Endpoint | Description |
|---|---|---|
| `getAlphabetList()` | `GET /alphabet/list` | All alphabet characters |
| `getCharacterData(char)` | `GET /alphabet/:char` | Individual character data |
| `getVocabularyByLetter(letter)` | `GET /vocabulary/:letter` | Vocabulary words by letter |
| `getSTEMModules()` | `GET /stem/modules` | STEM learning modules |

### `practiceAPI` — Practice & Analytics
| Method | Endpoint | Description |
|---|---|---|
| `submitPractice(data)` | `POST /practice/submit` | Submit practice attempt |
| `getUserProgress()` | `GET /user/progress` | Overall progress data |
| `getUserAnalytics()` | `GET /user/analytics` | Detailed analytics |
| `getWeeklyChartData()` | `GET /user/weekly-chart` | Weekly activity data |
| `getDailyQuiz(lang)` | `GET /user/daily-quiz` | Daily quiz questions |

### `contentAPI` — Videos & Media
### `systemAPI` — Health & Diagnostics

All requests include JWT tokens via Axios interceptors. Unauthorized (401) responses auto-redirect to `/login`.

---

## 🗺 Routes

| Path | Component | Description |
|---|---|---|
| `/` | `Dashboard` | Home dashboard with stats and navigation |
| `/login` | `Login` | User login |
| `/signup` | `Signup` | User registration |
| `/translate` | `Translator` | Text/speech to sign translation |
| `/sign-to-word` | `SignToWord` | Real-time webcam sign recognition |
| `/practice` | `Practice` | Alphabet practice mode |
| `/alphabet/:character` | `Practice` | Practice a specific character |
| `/tracing` | `TracingPad` | Finger-tracing letter practice |
| `/daily-quest` | `DailyQuest` | Daily quiz challenges |
| `/dictionary` | `Dictionary` | ISL dictionary |
| `/asl-dictionary` | `ASLDictionary` | ASL dictionary with videos |
| `/flashcards` | `Flashcards` | Flashcard study mode |
| `/lessons` | `Lessons` | Structured lesson modules |
| `/profile` | `UserProfile` | User profile & settings |
| `/stats` | `Dashboard` | Statistics view |
| `/test-connection` | `ConnectionTest` | Backend connectivity test |

---

## 🧩 Key Components

### SignToWord — Real-Time Sign Recognition
Captures webcam frames at configurable intervals and sends them to either the **ISL** or **ASL** model service for prediction. Supports model switching via a dropdown, displays detected signs with confidence scores, and builds a running sentence from sequential detections.

### Translator — Text & Speech to Sign
Converts typed text or speech input into sign language. Integrates with `react-speech-recognition` for voice input and the backend's text-to-sign conversion API. Displays sign videos/images for each word.

### Practice — Interactive Alphabet Practice
Camera-based practice mode where users sign letters and get real-time AI feedback. Supports both ISL and ASL alphabets with per-character routing.

### TracingPad — Handwriting Practice
Canvas-based letter tracing using `react-canvas-draw`. Validates strokes against checkpoint data in `LetterCheckpoints.ts` using the `HandwritingValidator` utility.

### Avatar3D — 3D Sign Language Avatar
Three.js-powered 3D avatar that performs sign language gestures, loaded from `.glb` model files.

### Dashboard — Analytics Hub
Displays user progress, weekly practice charts, daily streaks, and quick-access navigation to all features.

---

## 📜 Available Scripts

```bash
npm run dev       # Start Vite dev server on port 3000
npm run build     # Production build to dist/
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
```

---

## 🐳 Docker Reference

| File | Purpose |
|---|---|
| `Dockerfile` | Multi-stage build: Node 20 (build) → Nginx 1.25 (serve) |
| `docker-compose.yml` | Frontend service on port `3000:80` |
| `nginx.conf` | SPA routing + reverse proxy for 3 backend services |
| `.dockerignore` | Excludes `node_modules`, `dist`, `.git` from build context |

### Quick Commands

```bash
docker compose up -d          # Start frontend container
docker compose up -d --build  # Rebuild and start
docker compose down           # Stop and remove container
docker compose logs -f        # Follow container logs
```

---

## 📝 Notes

- **`--legacy-peer-deps`** is required during `npm install` due to `react-canvas-draw@1.2.1` only supporting React 16/17 as a peer dependency, while the project uses React 19.
- The **ISL model** uses an LSTM-based approach for alphabet recognition.
- The **ASL model** uses YOLOv11s (object detection) for alphabet recognition with bounding boxes.
- Dark mode preference is persisted to `localStorage`.
- The language context (`LanguageContext`) allows switching between ISL and ASL across all components.
