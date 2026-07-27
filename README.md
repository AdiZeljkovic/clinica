# Bioclinica

Web platforma za Bioclinica SWP prirodne dodatke prehrani — frontend,
admin panel i API.

> ## ⚠️ REPO MORA BITI PRIVATAN
> `server/db-init/01-init.sql` sadrži kompletan sadržaj baze, uključujući
> bcrypt hash admin korisnika. Ne objavljivati javno.

## Struktura

| Dio | Tehnologija | Dev port | Build |
|---|---|---|---|
| Frontend (`src/`) | React 19 + Vite + Tailwind 4 + motion | 3002 | `dist/` |
| Admin (`admin/`) | React + Vite | 3001 | `dist-admin/` |
| API (`server/`) | Express + TypeScript + pg | 4000 | `server/dist/` |
| Baza | PostgreSQL 18 | 5432 | — |

## Lokalni dev

```bash
# .env u rootu (vidi .env.example)
npm install && npm run dev            # frontend
cd admin && npm install && npm run dev
cd server && npm install && npm run dev
```

Baza: PostgreSQL, šema u `server/schema.postgres.sql`, podaci u
`server/db-init/01-init.sql`.

## Deploy

Docker Compose za Dokploy — vidi **[deploy.md](deploy.md)**.
