# Workcove UI

React frontend for the Workcove worker experience. Talks to the DRF API at `http://localhost:8000`.

## Docker (recommended)

Same pattern as the backend:

```bash
cd /Users/heeshinkim/Desktop/workcove/ui
APP_USER=$(id -un) APP_UID=$(id -u) docker compose -f docker-compose_dev.yml up -d --build
```

App: [http://localhost:3000](http://localhost:3000)

API base URL comes from `.env_dev` (`VITE_API_BASE_URL=http://localhost:8000`). Keep the backend CORS allowlist including `http://localhost:3000`.

Stop:

```bash
docker compose -f docker-compose_dev.yml down
```

## Local (without Docker)

```bash
npm install
npm run dev
```

## Flows

1. **Register** → create a worker account (SMS consent required)
2. **Sign in** → email + password → SMS challenge
3. **Verify** → 6-digit code → JWT stored locally
4. **Jobs** → paginated open job feed; open a job for details / apply

Auth header format: `Authorization: JWT <access_token>`

## Scripts

- `npm run dev` — Vite dev server on port 3000
- `npm run build` — production build
- `npm run preview` — preview production build
