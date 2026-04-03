# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**mirabile** — an AI career roadmap website that converts a user's dream career into a personalized learning roadmap with resources.

## Repository Structure

Monorepo with two independent packages:

```
client/       — React 19 frontend (create-react-app)
server/       — Express 5 backend API
```

## Tech Stack

| Layer    | Technology                                |
|----------|-------------------------------------------|
| Frontend | React 19, create-react-app (react-scripts 5.0.1) |
| Backend  | Express 5, cors                           |
| Testing  | Jest + React Testing Library (client-side) |

## Key Commands

### Frontend (client/)

```bash
cd client
npm start          # Dev server (default port 3000)
npm test           # Run tests in watch mode
npm run build      # Production build
npm run eject      # Eject from CRA (irreversible)
```

To run a single test:
```bash
cd client
npm test -- --testPathPattern=App.test
```

### Backend (server/)

```bash
cd server
node index.js      # Start server on port 5000
```

The backend exposes API routes at `GET /api/*`. CORS is enabled for cross-origin requests from the frontend dev server.

## Architecture

- **Client-server model**: React SPA (client) communicates with Express REST API (server) on port 5000.
- **No proxy configured**: The frontend and backend run on separate ports; API calls from the client should target `http://localhost:5000`.
- The frontend is a minimal CRA scaffold — no routing library or state management library is set up yet.
- The backend currently has a single test endpoint at `GET /api/message`.
