# Jobfinder

A front‑end **Vanilla JS + HTML + CSS** project with a **Node/Express + MySQL** backend.

## Introduction
This repository contains a static front‑end (multi‑page layout under `src/public/`) for **JobFinder**, plus a backend scaffold and an SQL script to create the database schema. The project aims to **improve employability** for both individuals and companies by streamlining how candidates and employers connect.

## Features
- Multi‑page front‑end with dedicated views:
  - `loginCoder.html`, `loginCompany.html`
  - `registerCoder.html`, `registerCompany.html`
  - `dashboardCoder.html`, `dashboardCompany.html`
  - `profileCoder.html`, `profileCompany.html`
- Central `index.html` and a single stylesheet `css/style.css`
- Page‑specific JS under `public/js/` (e.g., `dashboardCoder.js`, `registerCompany.js`, etc.)
- Backend **placeholders**: `server.js`, Express routers (`routes/`), and `database.sql` for MySQL schema


## Project Structure
```

src
│  ├─ backend
│  │  ├─ database
│  │  │  ├─ database.sql
│  │  ├─ middlewares
│  │  │  ├─ auth.js
│  │  ├─ routes
│  │  │  ├─ coderRoutes.js
│  │  │  ├─ companyRoutes.js
│  │  ├─ server.js
│  ├─ public
│  │  ├─ assets
│  │  │  ├─ img
│  │  ├─ css
│  │  │  ├─ style.css
│  │  ├─ js
│  │  │  ├─ applications.js
│  │  │  ├─ dashboardCoder.js
│  │  │  ├─ dashboardCompany.js
│  │  │  ├─ loginCoder.js
│  │  │  ├─ loginCompany.js
│  │  │  ├─ offers.js
│  │  │  ├─ profile.js
│  │  │  ├─ profileCoder.js
│  │  │  ├─ profileCompany.js
│  │  │  ├─ recommendations.js
│  │  │  ├─ registerCoder.js
│  │  │  ├─ registerCompany.js
│  │  ├─ views
│  │  │  ├─ dashboardCoder.html
│  │  │  ├─ dashboardCompany.html
│  │  │  ├─ loginCoder.html
│  │  │  ├─ loginCompany.html
│  │  │  ├─ profileCoder.html
│  │  │  ├─ profileCompany.html
│  │  │  ├─ registerCoder.html
│  │  │  ├─ registerCompany.html
│  │  ├─ app.js
│  │  ├─ index.html
.gitignore
netlify.toml
package-lock.json
package.json
README.md
```

## Front‑end
- Entry: `src/public/index.html`
- Styles: `src/public/css/style.css`
- Views: `src/public/views/*.html`
- Scripts: `src/public/js/*.js`


## Backend
- Location: `src/backend/`
  - `server.js`
  - `routes/companyRoutes.js`
  - `routes/coderRoutes.js`
  - `middlewares/auth.js`
  - `database/database.sql`


## Database Schema
The SQL script at `src/backend/database/database.sql` creates the following tables:
- `Users`
- `Coders`
- `Companies`
- `JobOffers`
- `Applications`
- `Skills`
- `Coders_Skills` (M:N)
- `Offers_Skills` (M:N)


## Contributors (5)
- **Kevin Londoño** — _Product Owner_
- **Felipe Marín** — _Scrum Master_
- **Andrés Severino** — _Developer_
- **Emanuel Gaviria** — _Developer_
- **Samuel Monsalve** — _Developer_

