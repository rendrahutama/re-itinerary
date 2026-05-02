# RE-ITINERARY

RE-ITINERARY is a travel itinerary planner with a React frontend and a Go + SQLite backend. It helps organize trips, activities, dates, locations, and travel costs in a single timeline view.

## Stack

- Frontend: React + Vite
- Backend: Go
- Database: SQLite
- Maps: Leaflet + OpenStreetMap

## Project Structure

- [frontend](./frontend): React application
- [api](./api): Go API and SQLite integration
- [api/db/re_itinerary.db](./api/db/re_itinerary.db): SQLite database

## Quick Start

### 1. Start the API

```bash
cd api
go mod tidy
go run .
```

API default URL:

```bash
http://localhost:8080
```

### 2. Start the frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend default URL:

```bash
http://localhost:5173
```

### 3. Configure the frontend API URL

In `frontend/.env`:

```bash
VITE_API_BASE_URL=http://localhost:8080
```

## Features

- Create and edit itineraries
- Add, edit, delete, and reorder activities
- Group activities by day
- Auto-derived itinerary end date from activities
- Cost tracking per itinerary
- Interactive maps for activity locations
- LocalStorage import into SQLite

## Existing Docs

- API documentation: [api/README.md](./api/README.md)
- Frontend notes: [frontend/README.md](./frontend/README.md)
- Environment requirements: [requirements.txt](./requirements.txt)
