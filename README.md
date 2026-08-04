# enterprise-etl-dashboard

Enterprise ETL dashboard using React, TypeScript, Vite, Material UI, React Router, Axios, and a FastAPI backend.

## API connection

The dashboard reads backend data from these endpoints:

- `GET /api/pipelines`
- `GET /api/jobs`
- `GET /api/metrics`

During local development, Vite proxies `/api` to `http://localhost:8000`. Copy `.env.example` to `.env` to change the FastAPI target or the browser-facing API URL. List endpoints can return a direct array or an object containing `items`, `pipelines`/`jobs`, or `data`. Both FastAPI-style snake_case and camelCase fields are supported.

## Run locally

```bash
npm install
npm run dev
```

Run FastAPI on port 8000 before opening the dashboard.

## Build

```bash
npm run build
```
