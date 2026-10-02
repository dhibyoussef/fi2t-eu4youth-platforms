# FI2T & EU4Youth — Web Platforms & Live CMS Workspace

Welcome to the **fi2t-live-editor** workspace. This repository hosts the complete source code, content management systems (CMS), and public-facing portals for two institutional projects in Tunisia:

1. **FI2T (Fédération Interprofessionnelle du Tourisme Tunisien)** — A full-stack trilingual platform built with **Laravel 11 / PHP 8.3**, **React 18 / Vite**, and **Tailwind CSS**, featuring an integrated in-place **Live Visual Editor** and an administrative back-office.
2. **EU4Youth Tunisie (Eforyouth)** — A trilingual public portal and content engine built with **Node.js / Express 5**, **React 19 / Vite 8**, and a JSON document store, featuring catalog studios (Projects, News, Opportunities, Stories, Publications, Interactive Map, and Glossary) and live editing capabilities.

---

## Table of Contents

- [Architectural Overview](#architectural-overview)
- [Project 1: FI2T Platform](#project-1-fi2t-platform)
  - [Architecture & Tech Stack](#fi2t-architecture--tech-stack)
  - [Directory Structure](#fi2t-directory-structure)
  - [The CMS & Live Editor Deep Dive](#fi2t-cms--live-editor-deep-dive)
  - [Prerequisites & System Requirements](#fi2t-prerequisites)
  - [Local Installation & Setup](#fi2t-local-setup)
  - [Build & Deployment Guide](#fi2t-deployment)
- [Project 2: EU4Youth Platform (Eforyouth)](#project-2-eu4youth-platform-eforyouth)
  - [Architecture & Tech Stack](#eu4youth-architecture--tech-stack)
  - [Directory Structure](#eu4youth-directory-structure)
  - [The CMS & Content Engine Deep Dive](#eu4youth-cms--content-engine-deep-dive)
  - [Prerequisites & System Requirements](#eu4youth-prerequisites)
  - [Local Installation & Setup](#eu4youth-local-setup)
  - [Build & Deployment Guide](#eu4youth-deployment)
- [CMS Comparison: FI2T vs. EU4Youth](#cms-comparison-fi2t-vs-eu4youth)
- [Trilingual Localization & RTL Engineering](#trilingual-localization--rtl-engineering)
- [Troubleshooting & FAQs](#troubleshooting--faqs)
- [Security & Environment Guidelines](#security--environment-guidelines)

---

## Architectural Overview

Both platforms solve a common enterprise challenge: **allowing non-technical administrators to edit website content directly on the page or through a structured studio, without requiring redeployments or risking layout breakage.**

```
fi2t-live-editor/
├── fi2T/                  # FI2T Platform
│   ├── backend/           # Laravel 11 REST API + MySQL + Media Storage
│   ├── frontend/          # React 19 Admin Back-Office (CMS Studio)
│   ├── website/           # React 18 Public Website with Live In-Place Editor
│   └── deploy/            # Docker, Nginx, and staging build scripts
│
├── EU4Youth/              # EU4Youth Tunisie Platform
│   ├── backend/           # Express 5 REST API + JSON Document Store
│   ├── frontend/          # React 19 Admin Back-Office (Catalog Studios)
│   ├── eu4youth-website/  # React 19 Public Portal with Live Editor Hook
│   └── docs/              # Specifications, test plans, and architecture notes
│
├── tools/                 # Data extraction and parsing scripts (DOCX to text)
└── website/               # Standalone production build artifacts & UI audit reports
```

---

## Project 1: FI2T Platform

### FI2T Architecture & Tech Stack

FI2T operates on a decoupled **three-tier architecture**:

| Tier | Component | Technology | Default Port | Role |
| :--- | :--- | :--- | :--- | :--- |
| **Presentation** | `website/` | React 18, Vite, React Router DOM 6, i18next, Swiper | `http://localhost:3002` | Public website with in-place click-to-edit capabilities |
| **Administration** | `frontend/` | React 19, Vite, Tailwind CSS v4, TanStack Query, Zustand | `http://localhost:3000` | Back-office dashboard for managing pages, users, and roles |
| **Data & Services** | `backend/` | Laravel 11 (PHP 8.3+), Laravel Sanctum, Spatie Permission, MySQL | `http://localhost:8000` | REST API, database persistence, media handling, and RBAC |

```
┌────────────────────────────────────────────────────────┐
│                   FI2T Public Site                     │
│               (React 18 / Vite :3002)                  │
│                                                        │
│  EditableText  ◄───►  EditModeProvider  ◄───► Content  │
│  Components           (Session Token)         Provider │
└───────────────────────────┬────────────────────────────┘
                            │
               Bearer Token │ /api/content/blocks
                            ▼
┌────────────────────────────────────────────────────────┐
│                   FI2T Laravel API                     │
│               (PHP 8.3 / Sanctum :8000)                │
│                                                        │
│  Auth (Sanctum)  │  ContentController  │ MediaStorage  │
└───────────────────────────▲────────────────────────────┘
                            │
               Bearer Token │ /api/admin/*
                            │
┌───────────────────────────┴────────────────────────────┐
│                   FI2T Admin Studio                    │
│             (React 19 / Tailwind :3000)                │
│                                                        │
│  Page Builder  │  Translations  │  User/Role Manager   │
└────────────────────────────────────────────────────────┘
```

---

### FI2T Directory Structure

```
fi2T/
├── backend/
│   ├── app/
│   │   ├── Http/Controllers/    # API Controllers (Auth, Content, Media, Users, Roles)
│   │   ├── Models/                 # Eloquent models (User, ContentBlock, CmsPage, etc.)
│   │   └── Services/               # Media upload, image sizing, and sanitization services
│   ├── database/
│   │   ├── migrations/             # Database schema migrations
│   │   └── seeders/                # Default pages, blocks, and trilingual translations
│   ├── routes/
│   │   └── api.php                 # Protected and public API endpoints
│   ├── storage/app/public/website/ # User-uploaded images and documents
│   └── composer.json               # PHP dependencies (Laravel 11, Sanctum, Spatie)
│
├── frontend/
│   ├── src/
│   │   ├── api/client.ts           # Axios instance with auth interceptor
│   │   ├── pages/content/          # Page builder, section editor, site settings
│   │   ├── pages/users/            # User creation, role assignments, permissions
│   │   └── pages/translations/     # Translation matrix editor
│   └── package.json
│
└── website/
    ├── src/
    │   ├── api/client.ts           # API client with token support
    │   ├── cms/
    │   │   ├── ContentProvider.tsx # In-memory block state, local fallback cache
    │   │   ├── EditModeProvider.tsx# Token verification and edit mode state
    │   │   ├── EditableText.tsx    # Click-to-edit inline text component
    │   │   └── defaults/           # Hardcoded local fallbacks (per page, per locale)
    │   ├── components/fi2t/        # Header, Footer, Hero, Navigation
    │   ├── pages/                  # Accueil, Qui Sommes-Nous, Organisation, Actualités, etc.
    │   └── i18n/locales/           # Static UI translations (fr.ts, en.ts, ar.ts)
    └── package.json
```

---

### FI2T CMS & Live Editor Deep Dive

The FI2T CMS is built around a **dual editing workflow**:

#### 1. In-Place Live Visual Editing (Website)
- **Authentication Handshake**: An administrator in the Admin Studio (`:3000`) clicks **"Modifier le site"** (Live Edit). The admin panel generates a signed session URL:  
  `http://localhost:3002/?edit_token=<TOKEN>`
- **Token Capture**: `EditModeProvider.tsx` on the website reads the `edit_token` from query parameters, stores it in `sessionStorage`, strips the parameter from the browser URL via `history.replaceState` (to prevent bookmarking or leakage), and validates it against `GET /api/auth/me`.
- **Role Verification**: Only users with `admin` or `super-admin` roles unlock the editing controls.
- **Editable Components**:
  - `EditableText`: Replaces static text with clickable highlighted boxes. Clicking opens an inline editing drawer or input. Supports single-line, multi-line paragraphs, and heading types (`h1`–`h3`, `p`, `span`, `div`).
  - `EditableImage`: Allows one-click replacement of imagery directly on the page, uploading the file to the media API and persisting the new relative URL.
- **Pending Changes Queue**: Edits are held locally in `ContentProvider`. Editors can preview changes live in context, make additional edits across different sections, and click **"Enregistrer"** in the floating bottom toolbar to batch-persist updates to `POST /api/content/blocks`.
- **Zero-Downtime Fallbacks**: Every editable component accepts a `fallback` string or references `defaults/`. If the Laravel backend is offline or unreachable, the website transparently renders the built-in default content without breaking.

#### 2. Admin Back-Office (Frontend)
- **Page Anatomy & Section Editor**: Provides a structured form-based interface matching the real hierarchy of every page (`Accueil`, `Organisation`, `Groupements`, etc.).
- **Media Upload Security**: Uploads via `POST /api/media` strictly validate MIME types (JPEG, PNG, WebP, GIF), limit file sizes to ~2MB, and deliberately block raw SVG uploads to prevent Stored Cross-Site Scripting (XSS).
- **Role-Based Access Control (RBAC)**: Powered by Spatie Permission (`super-admin`, `admin`, `editeur`). Super admins can create staff users and assign granular permissions.

---

### FI2T Prerequisites

Ensure the following runtimes and tools are installed on your system:

- **PHP**: `^8.3` (with extensions: `pdo_mysql`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `curl`, `fileinfo`)
- **Composer**: `^2.7`
- **Node.js**: `^18.0.0` or `^20.0.0` (LTS recommended)
- **npm**: `^9.0.0` or `^10.0.0`
- **MySQL**: `^8.0` or **MariaDB** `^10.6`

---

### FI2T Local Setup

#### Step 1: Configure & Start the Backend API

```powershell
cd fi2T/backend

# Install PHP dependencies
composer install

# Set up environment file
copy .env.example .env

# Configure your local database in .env:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=fi2t
# DB_USERNAME=root
# DB_PASSWORD=your_local_password

# Generate application encryption key
php artisan key:generate

# Run schema migrations and load default seeders
php artisan migrate --seed

# Create storage symlink for uploaded media
php artisan storage:link

# Start the Laravel local development server (Port 8000)
php artisan serve --host=127.0.0.1 --port=8000
```

#### Step 2: Configure & Start the Admin Back-Office

```powershell
cd ../frontend

# Install JavaScript dependencies
npm install

# Start the admin development server (Port 3000)
npm run dev
```

#### Step 3: Configure & Start the Public Website

```powershell
cd ../website

# Install JavaScript dependencies
npm install

# Start the public website (Port 3002)
npm run dev
```

- **Public Website**: Open [http://localhost:3002](http://localhost:3002)
- **Admin Studio**: Open [http://localhost:3000](http://localhost:3000)
- **Backend API**: Running at [http://127.0.0.1:8000/api](http://127.0.0.1:8000/api)

---

### FI2T Deployment

#### Subpath Configuration
When deploying behind a reverse proxy (e.g., Nginx) where the application is served under a subpath (e.g., `/fi2t/` and `/fi2t/admin/`):

1. **Website Build**:
   ```powershell
   cd fi2T/website
   $env:VITE_BASE="/fi2t/"
   npm run build
   # Outputs to fi2T/website/dist/
   ```
2. **Frontend Admin Build**:
   ```powershell
   cd fi2T/frontend
   $env:VITE_BASE="/fi2t/admin/"
   npm run build
   # Outputs to fi2T/frontend/dist/
   ```
3. **Backend Optimization**:
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

---

## Project 2: EU4Youth Platform (Eforyouth)

### EU4Youth Architecture & Tech Stack

EU4Youth Tunisie is engineered with a **Node.js/Express service architecture** backed by an atomic JSON document store:

| Tier | Component | Technology | Default Port | Role |
| :--- | :--- | :--- | :--- | :--- |
| **Presentation** | `eu4youth-website/` | React 19, Vite 8, React Router DOM 7, i18next | `http://localhost:3030` | Trilingual public portal with dynamic catalogs and live edit mode |
| **Administration** | `frontend/` | React 19, Vite 8, TanStack Query 5, Lucide Icons | `http://localhost:3040` | Back-office catalog studios and site hierarchy manager |
| **Data & Services** | `backend/` | Node.js (ESM), Express 5, Atomic JSON Store | `http://localhost:8040` | API for catalogs, live editor sync, translations, and forms |

```
┌────────────────────────────────────────────────────────┐
│                 EU4Youth Public Site                   │
│               (React 19 / Vite :3030)                  │
│                                                        │
│  Pages: Actualités, Opportunités, Projets, Carte, etc. │
│  EditableText  ◄──►  ContentProvider  ◄──► useCatalog  │
└───────────────────────────┬────────────────────────────┘
                            │
               X-EU4Y-Token │ /api/catalogues/*
                            ▼
┌────────────────────────────────────────────────────────┐
│                 EU4Youth Express API                   │
│              (Node.js / Express :8040)                 │
│                                                        │
│  Catalog Engine  │  Auth & Permissions  │ JSON Store   │
│                  │  (scrypt / tokens)   │ (store.json) │
└───────────────────────────▲────────────────────────────┘
                            │
               X-EU4Y-Token │ /api/admin/*
                            │
┌───────────────────────────┴────────────────────────────┐
│                 EU4Youth Admin Studio                  │
│               (React 19 / Vite :3040)                  │
│                                                        │
│  News Studio  │  Projects Studio  │  Live Editor Host  │
└────────────────────────────────────────────────────────┘
```

---

### EU4Youth Directory Structure

```
EU4Youth/
├── backend/
│   ├── data/
│   │   └── store.json          # Main atomic JSON database (catalogs, pages, users)
│   ├── src/
│   │   ├── server.mjs          # Express 5 application and route controllers
│   │   ├── store.mjs           # Atomic loadStore / saveStore operations
│   │   ├── catalogues.mjs      # Catalog filtering, search, and pagination helpers
│   │   ├── permissions.mjs     # Project-scoped permission verification
│   │   ├── auth.mjs            # scrypt password hashing and token generation
│   │   └── localeSync.mjs      # Trilingual synchronizer across catalog items
│   └── package.json
│
├── frontend/                   # Admin Back-Office (CMS)
│   ├── src/
│   │   ├── api/client.ts       # Axios client with X-EU4Y-Token support
│   │   ├── pages/content/      # Page editor and live editor embed
│   │   ├── pages/catalogs/     # Dedicated studios (News, Opportunities, Projects, etc.)
│   │   └── pages/users/        # Account management with project-level scopes
│   └── package.json
│
└── eu4youth-website/           # Public Portal
    ├── src/
    │   ├── cms/                # ContentProvider, EditModeProvider, EditableText
    │   ├── components/         # Funder flags, project banners, interactive map pins
    │   ├── pages/              # Actualités, Opportunités, Carte, Projets, Glossaire, etc.
    │   ├── data/               # Program data defaults and regional metadata
    │   └── styles/             # Modular CSS, responsive sheets, RTL overrides
    └── package.json
```

---

### EU4Youth CMS & Content Engine Deep Dive

The EU4Youth platform is designed around structured program data rather than raw HTML blobs:

#### 1. The Atomic JSON Store (`backend/data/store.json`)
- All system entities reside in a structured JSON database:
  - `pages`: Keyed hierarchy of pages and sections with localized strings.
  - `news`: Program articles with dates, categories, excerpts, and body text.
  - `projects`: Program initiatives (Go4Youth, Irada4Youth, Jeuness, Maghroumin, Swafy, Fe3ila) with partners, budgets, and beneficiary territories.
  - `opportunities`: Calls for projects, funding, workshops, and trainings.
  - `stories`: Field testimonials from young beneficiaries across Tunisian governorates.
  - `publications`: PDF reports, guides, and studies available for download.
  - `events`: Program calendar items.
  - `glossary`: Terms and definitions related to international cooperation and youth initiatives.
- Safe file I/O operations write to a temporary file before renaming (`atomic rename`), preventing data corruption during concurrent write requests.

#### 2. Dual Header Authentication (`X-EU4Y-Token` & Bearer)
- When deployed behind enterprise reverse proxies that use HTTP Basic Authentication, standard `Authorization: Bearer` headers can be stripped or overridden by the gateway.
- The EU4Youth backend accepts tokens in either `Authorization: Bearer <TOKEN>` or `X-EU4Y-Token: <TOKEN>`, ensuring unbroken sessions in all network environments.
- Passwords are encrypted using Node's native `crypto.scrypt`.

#### 3. Live Editor & Catalog Synchronization
- The admin back-office embeds the public site in an interactive frame using an `edit_token`.
- Editors click directly on texts marked with `data-cms-block` to make corrections.
- Saving updates writes directly to `store.json` and immediately refreshes both the public site and admin catalog listings without server restarts.

---

### EU4Youth Prerequisites

- **Node.js**: `^18.18.0` or `^20.0.0` (LTS recommended)
- **npm**: `^9.0.0` or `^10.0.0`
- Python `3.x` (optional, for running document extraction tools in `tools/`)

---

### EU4Youth Local Setup

#### Step 1: Start the Backend API

```powershell
cd EU4Youth/backend

# Install dependencies
npm install

# Choose the bootstrap Super Admin account (used only when no store exists yet).
# If EU4Y_ADMIN_PASSWORD is not set, a random password is generated and printed in the console.
$env:EU4Y_ADMIN_EMAIL="you@example.org"
$env:EU4Y_ADMIN_PASSWORD="choose-a-strong-password"

# Start the API server in watch mode (Port 8040)
# On first start, backend/data/store.json is created and seeded automatically.
npm run dev
```

#### Step 2: Start the Admin Back-Office

```powershell
cd ../frontend

# Install dependencies
npm install

# Start the admin development server (Port 3040)
npm run dev
```

#### Step 3: Start the Public Portal

```powershell
cd ../eu4youth-website

# Install dependencies
npm install

# Start the public site (Port 3030)
npm run dev
```

- **Public Website**: Open [http://localhost:3030](http://localhost:3030)
- **Admin CMS**: Open [http://localhost:3040](http://localhost:3040)
- **Backend API**: Running at [http://localhost:8040/api](http://localhost:8040/api)
- **API Health Check**: [http://localhost:8040/api/health](http://localhost:8040/api/health)

---

### EU4Youth Deployment

To build the static bundles for production:

```powershell
# Build the public portal
cd EU4Youth/eu4youth-website
npm run build
# Outputs to dist/

# Build the admin portal
cd ../frontend
npm run build
# Outputs to dist/
```

To run the Node.js API process in production, use a process manager like PM2:

```bash
cd EU4Youth/backend
npm install --omit=dev
pm2 start src/server.mjs --name "eu4youth-api"
```

---

## CMS Comparison: FI2T vs. EU4Youth

| Feature | FI2T Platform | EU4Youth Platform |
| :--- | :--- | :--- |
| **Primary Domain** | Tourism Federation (institutional & regional) | Youth Empowerment & International Cooperation |
| **Backend Framework** | Laravel 11 (PHP 8.3) | Express 5 (Node.js ESM) |
| **Persistence Engine** | MySQL / MariaDB (Relational) | Atomic JSON Document Store (`store.json`) |
| **Authentication** | Laravel Sanctum (Bearer Token) | Custom JWT / scrypt (`X-EU4Y-Token` & Bearer) |
| **Role Management** | Spatie RBAC (`super-admin`, `admin`, `editeur`) | Project-scoped roles (`superadmin`, `directeur`, `editeur`) |
| **Editing Mode** | Click-to-edit inline overlays on the live DOM | Click-to-edit + structured catalog studios |
| **Media Handling** | Server-side validation, storage symlink, SVG blocking | Multipart upload to `uploads/` directory |
| **Offline Resilience** | Hardcoded page defaults in TypeScript per locale | Hardcoded initial fallbacks + local storage |
| **Supported Languages**| French (`fr`), English (`en`), Arabic (`ar`) | French (`fr`), English (`en`), Arabic (`ar`) |

---

## Trilingual Localization & RTL Engineering

Both projects feature full support for **French**, **English**, and **Arabic**, including comprehensive **Right-To-Left (RTL)** layout mirroring.

### RTL Implementation Strategy
1. **Dynamic HTML Direction**: When switching to Arabic, the root element updates to `<html dir="rtl" lang="ar">`.
2. **Logical CSS Properties**: Styles prioritize `margin-inline-start`, `padding-inline-end`, and flexbox direction over hardcoded left/right values.
3. **Dedicated RTL Style Overrides**:
   - `eu4youth-website/src/styles/rtl.css`: Custom overrides for navigation menus, breadcrumbs, search bars, and card icons.
   - `eu4youth-website/src/styles/pages-rtl.css`: Specific alignments for project timelines, metric callouts, and quote quotation marks.
4. **Font Selection**:
   - **Latin (FR/EN)**: *Barlow*, *Poppins*, *Outfit*.
   - **Arabic (AR)**: *Changa*, *Cairo* with adjusted line-heights to preserve typographic balance.

---

## Troubleshooting & FAQs

### 1. The public site displays content, but changes saved in CMS do not appear
- Ensure the respective backend is running (`:8000` for FI2T, `:8040` for EU4Youth).
- In FI2T, check if the browser is displaying a cached response. Trigger a hard reload (`Ctrl + F5` or `Cmd + Shift + R`).
- Verify that your user role has write permissions for the requested section.

### 2. Live Edit mode does not open or redirects to login
- In FI2T, live edit requires an authenticated session. Log in at `http://localhost:3000` first, then click **"Modifier le site"**.
- Ensure third-party cookies or session storage are not blocked by browser privacy extensions.

### 3. Image uploads fail
- In FI2T, ensure you ran `php artisan storage:link` inside `fi2T/backend`. Verify write permissions on `backend/storage/app/public/`.
- Ensure the image is a valid format (JPEG, PNG, WebP) and under 2MB. SVG uploads are restricted by default for security.

### 4. CORS errors during local development
- Default allowed origins for FI2T API include `http://localhost:3000` and `http://localhost:3002`.
- Default allowed origins for EU4Youth API include `http://localhost:3030` and `http://localhost:3040`.
- If running on custom ports, update `CORS_ORIGINS` in `EU4Youth/backend/src/server.mjs` or `cors.php` in `fi2T/backend/config/`.

---

## Security & Environment Guidelines

- **Environment Files**: Never commit `.env`, `.env.production`, or private configuration files containing passwords or keys. Use `.env.example` templates for configuration reference.
- **Credential Hygiene**: Keep database credentials, API secrets, and server access tokens in secure secret managers.
- **File Uploads**: Always sanitize user-provided file names and validate MIME types on the server side prior to disk storage.
