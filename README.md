Let me create the contracts file and then build the backend.
Action: file_editor create /app/contracts.md --file-text "# API Contracts — Daniel Gaudreault Portfolio

## Overview
The frontend currently runs on mock data in `/app/frontend/src/mock.js`. This doc defines what moves to the backend and how integration happens.

---

## What stays static (keep in `mock.js` / re-export as static)
These rarely change and don't need persistence for an MVP:
- `personal` (name, bio, contact info, socials)
- `stats` (years of exp, projects shipped, etc.)
- `skills` (grouped skill list with levels)
- `experience` (work history timeline)
- `testimonials` (quotes on contact page)

These will remain imported from `mock.js` on the frontend.

## What moves to backend (MongoDB + FastAPI)

### 1. Projects (`projects`)
Read-only for public, seeded from existing mock data.
**Model (`Project`)**:
- `id: str` (slug, e.g. `\"northwind-analytics\"`)
- `title: str`
- `category: str`
- `year: int`
- `description: str`
- `tech: list[str]`
- `image: str` (URL)
- `link: str`
- `featured: bool = False`
- `order: int = 0`

**Endpoints**:
- `GET /api/projects` → `list[Project]` (sorted by `order` asc, then year desc)

### 2. Blog Posts (`posts`)
Read-only public, seeded from mock.
**Model (`Post`)**:
- `id: str` (slug)
- `title: str`
- `excerpt: str`
- `date: str` (human-friendly)
- `read_time: str` (e.g. \"6 min\")  → serialized as `readTime` in response
- `tag: str`
- `cover: str`
- `body: list[str]` (array of paragraphs; optional, fallback to placeholder)

**Endpoints**:
- `GET /api/posts` → `list[Post]`
- `GET /api/posts/{id}` → `Post` or 404

### 3. Contact Messages (`contact_messages`)
Write-only for public; create-only.
**Model (`ContactMessage`)**:
- `id: str` (uuid4)
- `name: str`
- `email: str` (EmailStr)
- `budget: str | None`
- `message: str`
- `created_at: datetime`

**Endpoints**:
- `POST /api/contact` body `{name, email, budget?, message}` → `{id, ok: true}`
  - Validation: `name` (2-100 chars), valid email, `message` (10-4000 chars)
  - On failure returns 422 with details.

---

## Seeding
On backend startup (`@app.on_event(\"startup\")`):
- If `projects` collection empty → insert mock projects.
- If `posts` collection empty → insert mock posts with placeholder `body`.

Seed data lives in `/app/backend/seed_data.py`.

---

## Frontend Integration Plan
Create `/app/frontend/src/api.js` that exports:
```js
getProjects()  // GET /api/projects
getPosts()     // GET /api/posts
getPost(id)    // GET /api/posts/:id
sendContact(payload) // POST /api/contact
```
Uses `axios` with `${REACT_APP_BACKEND_URL}/api` base.

Components update:
- `Projects.jsx` → fetch via `getProjects()` in `useEffect`; fallback to mock on error.
- `BlogPreview.jsx` / `BlogList.jsx` → fetch via `getPosts()`.
- `BlogDetail.jsx` → fetch via `getPost(id)`; uses `body` from API.
- `Contact.jsx` → replace `localStorage` write with `sendContact()` call; keep toast feedback; show errors on 422.

`mock.js` keeps `personal`, `stats`, `skills`, `experience`, `testimonials`. Exports for `projects` / `posts` remain as **fallback** only.

---

## Error Handling
- All fetches wrapped in try/catch → fallback to mock data; log errors to console.
- `Contact.jsx` shows backend error message in toast on failure.
"
Observation: Create successful: /app/contracts.md
