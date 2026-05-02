# Reitinerary API

Go + SQLite backend for the existing itinerary frontend.

## What it provides

- `GET /health`
- `POST /api/import/local-storage`
- `GET /api/itineraries`
- `POST /api/itineraries`
- `GET /api/itineraries/:id`
- `PUT` or `PATCH /api/itineraries/:id`
- `DELETE /api/itineraries/:id`
- `GET /api/itineraries/:id/activities`
- `POST /api/itineraries/:id/activities`
- `GET /api/itineraries/:id/activities/:activityId`
- `PUT` or `PATCH /api/itineraries/:id/activities/:activityId`
- `DELETE /api/itineraries/:id/activities/:activityId`
- `POST /api/itineraries/:id/activities/:activityId/move`

The JSON response shape matches the current frontend mock data:

```json
{
  "id": "1",
  "name": "Yogyakarta 2026",
  "description": "Trip details",
  "startDate": "2026-05-29",
  "endDate": "2026-05-31",
  "currency": "IDR",
  "estimatedCost": 1600000,
  "image": null,
  "createdAt": "2026-04-01T00:00:00Z",
  "activities": [
    {
      "id": "1",
      "datetime": "2026-05-29T09:30",
      "type": "Train",
      "identification": "Taksaka (7007)",
      "location": {
        "name": "Gambir Train Station",
        "address": "Jl. Medan Merdeka...",
        "lat": -6.1762,
        "lng": 106.8304
      },
      "cost": 550000,
      "ticketStatus": "Secured",
      "details": "Datang 30 menit sebelum keberangkatan",
      "sortOrder": 0
    }
  ]
}
```

## Run it

1. Install Go 1.24+.
2. From [api/main.go](/Users/rendrahutama/PROJECTS/WEBAPP/REITINERARY/api/main.go), fetch dependencies:

```bash
go mod tidy
```

3. Start the API:

```bash
go run .
```

## Import current browser localStorage

The backend cannot read the browser's `localStorage` by itself. It accepts the current frontend array shape at `POST /api/import/local-storage`, and the frontend exposes a dev helper for sending it.

1. Start the API on `http://localhost:8080`.
2. Start the frontend as usual.
3. In the browser console, run:

```js
await window.importReitineraryLocalStorage()
```

By default this replaces existing itineraries for the demo user in SQLite with the browser's current `reitinerary_data`.

If you want to test the endpoint without the browser bridge first:

```bash
curl -X POST http://localhost:8080/api/import/local-storage \
  -H 'Content-Type: application/json' \
  --data @api/examples/localstorage-import.sample.json
```

Default settings:

- `PORT=8080`
- `SQLITE_PATH=db/re_itinerary.db`
- `DEFAULT_USER_NAME=Demo User`
- `DEFAULT_USER_EMAIL=demo@reitinerary.local`
- `DEFAULT_USER_PASSWORD=demo-password`

## Example requests

Create an itinerary:

```bash
curl -X POST http://localhost:8080/api/itineraries \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Bandung 2027",
    "description": "Weekend food trip",
    "startDate": "2027-02-14",
    "currency": "IDR"
  }'
```

Move an activity:

```bash
curl -X POST http://localhost:8080/api/itineraries/1/activities/2/move \
  -H 'Content-Type: application/json' \
  -d '{"direction":"up"}'
```

## Frontend integration note

The React frontend now uses fetch calls to this API through `ItineraryContext.jsx`.

Set the frontend API base URL with [frontend/.env.example](/Users/rendrahutama/PROJECTS/WEBAPP/REITINERARY/frontend/.env.example):

```bash
VITE_API_BASE_URL=http://localhost:8080
```
