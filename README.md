# enterprise-etl-dashboard

Enterprise ETL dashboard using React, TypeScript, Vite, Material UI, React Router, Axios, and a FastAPI backend.

## API connection

The dashboard reads backend data from these endpoints:

- `GET /api/pipelines`
- `GET /api/jobs`
- `GET /api/metrics`
- `GET /api/logs`

During local development, Vite proxies `/api` to `http://localhost:8000`. Copy `.env.example` to `.env` to change the FastAPI target or the browser-facing API URL. List endpoints can return a direct array or an object containing `items`, resource-specific keys, or `data`. Both FastAPI-style snake_case and camelCase fields are supported.

## Run the complete stack with Docker

Docker Compose starts the React frontend, FastAPI backend, PostgreSQL, and an
Airflow webserver and scheduler:

```bash
docker compose up --build -d
docker compose ps
```

- Dashboard: http://localhost:3000
- FastAPI docs: http://localhost:8000/docs
- Airflow: http://localhost:8080 (username `admin`, password `admin`)
- PostgreSQL: `localhost:5432` (database `etl_dashboard`, user `etl_user`)

The API creates its tables and initial dashboard data on first startup. Airflow
uses a separate `airflow` database on the same PostgreSQL service. Override host
ports with the values documented in `.env.example`.

Stop the services with `docker compose down`. To also remove local database and
Airflow log volumes, use `docker compose down --volumes`.

## Run the frontend locally

```bash
npm install
npm run dev
```

Run FastAPI on port 8000 before opening the dashboard, or start `backend` and
`postgres` with Docker Compose.

## Build

```bash
npm run build
```

## Tests

Run the React component tests with:

```bash
npm test
```

Run the FastAPI integration tests against an isolated temporary database with:

```bash
python -m pip install -r backend/requirements-dev.txt
python -m pytest backend/tests
```
