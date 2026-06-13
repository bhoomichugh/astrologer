# Project Notes: Astrologer CRM & Client Portal

This document provides a comprehensive overview of the **Astrologer CRM** application, detailing the technology stack, system architecture, key development assumptions, and potential future improvements.

---

## 🚀 1. Tech Stack

The application is structured as a full-stack JavaScript monorepo, divided into a client-side frontend and a server-side backend.

### Frontend
- **Library/Framework**: [React.js](https://react.dev/) (v18.3)
- **Build Tool**: [Vite](https://vite.dev/) (v8.0)
- **Icons**: [Lucide React](https://lucide.dev/) (v0.468)
- **HTTP Client**: [Axios](https://axios-http.com/) (v1.7) for API requests
- **Styling**: Pure, customized Vanilla CSS (`styles.css`) featuring:
  - Global variable tokens for a cohesive color theme (Orange-theme for CRM, Purple-theme for the Client Portal)
  - Glassmorphic panels, responsive flex/grid layouts, and responsive components
- **Routing**: SPA (Single Page Application) rendering using client-side react state hooks to manage navigation views.

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules configuration)
- **Framework**: [Express.js](https://expressjs.com/) (v4.21) for building RESTful endpoints
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose ODM](https://mongoosejs.com/) (v8.9)
- **Authentication**: JWT (JSON Web Tokens) with standard symmetric signature verification and custom authorization middleware
- **Security**: Password hashing using [bcryptjs](https://github.com/dcodeIO/bcrypt.js/) (v2.4) and CORS (Cross-Origin Resource Sharing) handling for local host origins
- **Artificial Intelligence**: [Google Gemini API](https://ai.google.dev/) via the official `@google/generative-ai` SDK (v0.24) using the `gemini-1.5-flash` model
- **Development Tooling**: `nodemon` for auto-restarts on codebase changes

---

## 🏛️ 2. Architecture

The codebase follows an organized, modular architecture separating the frontend client interface from the backend API logic.

### Directory Layout
```text
Astrologer/
├── backend/
│   ├── controllers/      # Route handlers implementing core business logic
│   ├── middleware/       # JWT authentication validation and role checking
│   ├── models/           # Mongoose schemas (User, Client, Consultation, Booking, Chat, etc.)
│   ├── routes/           # REST endpoint routers mapped to Express controllers
│   ├── seed/             # Seeding scripts for initializing mock astrologer records
│   ├── server.js         # Core entry point setting up express, CORS, mongoose, and routes
│   └── package.json      # Node server dependencies & run scripts
├── frontend/
│   ├── src/
│   │   ├── components/   # Shared UI parts (AppLayout, ErrorBoundary, ProtectedRoute)
│   │   ├── context/      # Context providers managing globally shared state (e.g., AuthContext)
│   │   ├── services/     # Axios instance configured with base URL
│   │   ├── App.jsx       # Custom SPA view container and state orchestrator
│   │   ├── main.jsx      # Portal selectors, landing views, user/astrologer routes, and HTML injection
│   │   └── styles.css    # Core stylesheet housing styling variables and theme layouts
│   └── package.json      # React dependencies & build scripts
├── README.md             # Standard setup, config, and installation instructions
└── package.json          # Root orchestration package for monorepo operations
```

### Key Architectural Concepts
1. **Multi-Portal Experience**: 
   - **Astrologer/Admin CRM Portal (Orange Theme)**: For administrators to manage staff accounts and for astrologers to track clients, register consultations, and generate AI-driven summaries.
   - **User/Client Portal (Purple Theme)**: For end-users/clients to log in, discover astrologers, book slots, read localized horoscopes, track payment history, and exchange messages.
2. **AI Summarization Pipeline**: The `aiController` makes secure calls to the Gemini API, utilizing `gemini-1.5-flash` to process unstructured, raw conversation notes and transform them into concise, actionable consultation summaries with client concerns and recommendations.
3. **Database Relationships**: 
   - `User` schema acts as a single model supporting `admin`, `astrologer`, and `user` roles.
   - `Client` holds birth details (for zodiac computation) and is linked to an assigned `User` (astrologer).
   - `Consultation` and `Booking` records reference client/user and astrologer IDs to establish relational linkage.

---

## 💡 3. Key Assumptions

- **Local Host Mapping**: Development configurations assume the client runs on `http://localhost:5173` and the backend service listens on port `5000`.
- **Role Permissions**:
  - `admin`: Full access to create/update staff accounts (astrologers) and assign clients.
  - `astrologer`: Access to view assigned clients, manage their consultations, confirm/cancel bookings, and trigger AI summary generations.
  - `user`: Custom client role allowed to explore astrologers, register booking requests, view horoscopes, simulate payments, and exchange messages.
- **Seeding Behavior**: The backend seeds default astrologers on connection to MongoDB if their corresponding accounts do not exist in the collection.
- **API Key Configuration**: The server requires a valid `GEMINI_API_KEY` environmental variable to activate consultation summary generation.

---

## 🔮 4. Future Improvements

To scale this application into a production-ready software product, the following features are recommended:

1. **Robust Client-Side Routing**: Replace custom state-driven tab switches (`state.view`) in the frontend with a declarative routing library like `react-router-dom` to support nested views, URL parameters, and bookmarkable routes.
2. **Real-Time Communications**: Transition chat endpoints from simulated polling to real-time WebSockets (e.g., [Socket.io](https://socket.io/)) to enable instant text messaging and live video/audio consultation streams.
3. **True Payment Gateway Integration**: Replace mock payment forms with real production integrations (such as Stripe or Razorpay) supporting multi-currency transactions and automatic invoice generation.
4. **Interactive Calendaring & Scheduling**: Implement a visual calendar view (e.g., FullCalendar) allowing astrologers to define custom availability shifts and clients to select time zones and block calendars dynamically.
5. **Birth Chart (Kundli) Generator Engine**: Build an internal astrological calculation module or integrate external astronomical APIs (like Swiss Ephemeris) to dynamically draw birth charts, planetary transits, and compatibility maps.
6. **Detailed Reports & Documents Export**: Allow users to download consultation notes and AI summaries as customized, print-ready PDF reports.
