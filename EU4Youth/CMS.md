# EU4Youth CMS (local)

Admin back-office + API for the programme site. This is not FI2T and not Next.js.
Content lives in `backend/data/store.json` (JSON store). Preprod currently serves the public SPA only.

| Folder | Role | Local URL |
|--------|------|-----------|
| `eu4youth-website/` | Public site (Vite + React SPA) | http://localhost:3030 |
| `frontend/` | Admin CMS + Live Editor | http://localhost:3040 |
| `backend/` | Express API + JSON store | http://localhost:8040 |

## Start all three

```powershell
cd EU4Youth
.\tools\start-local.ps1
```

Or in three terminals:

```powershell
cd backend
npm install
npm run dev

cd ..\eu4youth-website
npm install
npm run dev

cd ..\frontend
npm install
npm run dev
```

Login: Super Admin only at bootstrap (`EU4Y_ADMIN_EMAIL` / `EU4Y_ADMIN_PASSWORD`, or the existing local admin if `store.json` already exists). Passwords are hashed (scrypt). No demo staff accounts.

Open **Contenu du site** (`/pages`) — the page tree matches the public site. **Live Editor** clicks the same fields. Catalogues (news, map, projects) are programme data, not invented portraits.

## How it fits together

1. Public site proxies `/api` to `localhost:8040`.
2. Catalogs (news, publications, agenda, opportunities, projects, map, stories, videos, glossary) are served from the store.
3. Contact and newsletter POST to `/api/forms/*` and land in **Formulaires**.
4. Admin **Live Editor** opens the public site with an `edit_token`. Click orange texts, then **Enregistrer** in the bottom bar. Saves go to the store.
5. Collection studios (Actualités, Youth Stories, etc.) write the same catalogs the public pages read.

Health check: http://localhost:8040/api/health
