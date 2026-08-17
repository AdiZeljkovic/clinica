# Bioclinica — deploy (Dokploy / Docker Compose)

Stack se builda iz ovog repoa kao **Docker Compose** iza Traefik proxyja
(HTTPS rješava Dokploy/Traefik). Nema PM2, nema nginx-a na hostu.

## Servisi

| Servis | Šta je | Interni port | Izlaže se na proxy? |
|---|---|---|---|
| `bioclinica-web` | Frontend (nginx statika + `^~ /api/` i `^~ /uploads/` proxy na API) | 80 | **DA** — glavna domena |
| `bioclinica-admin` | Admin panel (nginx statika + isti proxy) | 80 | **DA** — admin subdomena |
| `bioclinica-api` | Express API (Node 22, sluša na `0.0.0.0:4000`) | 4000 | NE — samo interna mreža |
| `db` | PostgreSQL 18 (alpine) | 5432 | NE — samo interna mreža |

U Dokployu domene se kače na `bioclinica-web:80` (npr. `bioclinica.ba`) i
`bioclinica-admin:80` (npr. `admin.bioclinica.ba`). API i baza nemaju
mapirane portove — sav promet ide kroz nginx u web/admin kontejnerima.

## Env varijable (postaviti u Dokployu)

| Varijabla | Obavezna | Opis |
|---|---|---|
| `DB_PASSWORD` | **DA** | Lozinka Postgres korisnika `bioclinica` |
| `JWT_SECRET` | **DA** | Random string (npr. `openssl rand -base64 32`) |
| `ADMIN_USERNAME` | preporučeno | Admin korisničko ime — upsertuje se na svakom bootu |
| `ADMIN_PASSWORD` | preporučeno | Admin lozinka (mijenja hash u bazi ako se razlikuje) |
| `ADMIN_EMAIL` | ne | Email admin korisnika (samo pri kreiranju) |
| `CORS_ORIGIN` | ne | Zarezom odvojeni origini (za direktan pristup API-ju; kroz nginx proxy nije potreban) |
| `SITE_URL` | ne | Javni URL frontenda — koristi se kao build arg za admin preview `/slike/...` putanja |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM` | preporučeno | SMTP za kontakt formu — bez `SMTP_HOST` poruke se čuvaju samo u bazi (admin panel) |
| `CONTACT_EMAIL` | ne | Kome stižu poruke s kontakt forme (default: adriaticsm@sunwavepharma.com) |

`VITE_API_URL` je fiksiran na `/api` u composeu (peče se u build) jer nginx
u istom kontejneru proxyja `/api` na `bioclinica-api`.

## Podaci

- **Prvi boot** (prazan `db-data` volumen): Postgres automatski izvrši
  `server/db-init/01-init.sql` — kompletna šema + trenutni sadržaj
  (proizvodi, hero slajdovi, blog, SEO). Redeploy NE dira postojeće podatke.
- **Uploadi iz admina** idu u imenovani volumen `uploads`
  (`/app/uploads` u API kontejneru) — preživljavaju redeploy.
- Seed admin korisnika poštuje `ADMIN_USERNAME`/`ADMIN_PASSWORD` env i
  idempotentan je (piše samo kad se lozinka promijeni). Dump sadrži
  postojećeg `admin` korisnika — postavljanjem env varijabli lozinka se
  odmah pregazi na bootu.

## Lokalna proba (opciono)

```bash
docker network create dokploy-network   # ako ne postoji
DB_PASSWORD=test JWT_SECRET=test docker compose up --build
```

## Napomene

- `server/db-init/01-init.sql` sadrži bcrypt hash admin korisnika i
  sadržaj sajta — **repo mora ostati privatan**.
- Mail se ne šalje ni odakle (kontakt poruke se čitaju u admin panelu);
  ako se doda mail, koristiti SMTP env varijable, ne sendmail.
- Stari HestiaCP deploy (git pull + build + public_html) je zamijenjen
  ovim — ne koristiti oboje istovremeno.
