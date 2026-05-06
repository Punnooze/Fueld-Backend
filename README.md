# FUELD Backend

NestJS + MongoDB REST API for the FUELD calorie and macro tracking app.

## Running locally

1. Copy the env file and fill in your MongoDB URI:
   ```bash
   cp .env.example .env
   # edit .env and set MONGODB_URI
   ```

2. Install dependencies and start in dev mode:
   ```bash
   npm install
   npm run start:dev
   ```

The server runs on **http://localhost:3001**. On first boot it seeds 10 preloaded food items if the collection is empty.

## API

### Foods
| Method | Path | Description |
|--------|------|-------------|
| GET | `/foods` | All food items |
| POST | `/foods` | Add a custom food item |
| DELETE | `/foods/:id` | Delete a custom food item only |

### Logs
| Method | Path | Description |
|--------|------|-------------|
| GET | `/logs?date=YYYY-MM-DD` | Entries for a specific day (populated) |
| GET | `/logs/week?startDate=YYYY-MM-DD` | 7-day entries grouped by date |
| POST | `/logs` | Add a log entry `{ foodItemId, quantity, date }` |
| DELETE | `/logs/:id` | Delete a log entry |

## Deploying to Render (free tier)

1. Push this repo to GitHub.
2. Create a new **Web Service** on Render pointing to the repo.
3. Set the following:
   - **Build command:** `npm run build`
   - **Start command:** `node dist/main`
   - **Environment variable:** `MONGODB_URI` → your MongoDB Atlas connection string
4. Deploy.

> **Note:** Render's free tier spins down after 15 minutes of inactivity. The first request after a cold start can take 30–60 seconds. The frontend should show a loading state and retry gracefully.
