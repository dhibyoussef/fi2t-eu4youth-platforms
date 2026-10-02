# EU4Youth Tunisie

Public site: `eu4youth-website/` (Vite + React, not Next.js).
CMS demo: `frontend/` (admin) + `backend/` (API). See `CMS.md`.

## Public site

```bash
cd eu4youth-website
npm install
npm run dev      # http://localhost:3030
```

## CMS demo (admin + API)

```bash
cd backend
npm install
npm run dev      # http://localhost:8040

cd ../frontend
npm install
npm run dev      # http://localhost:3040
```

Login: the bootstrap Super Admin is created from `EU4Y_ADMIN_EMAIL` / `EU4Y_ADMIN_PASSWORD` (set them before the first start).

Demande serveur CMS (Nidhal): `SERVER-ACCESS-NIDHAL.md`
