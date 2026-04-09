## ecoLoop — Full‑Stack Marketplace (React + Express + MongoDB)

This repo contains:

- **Frontend**: `frontend/` (React + Vite + Tailwind, JWT in localStorage, protected routes)
- **Backend**: `server/` (Node + Express + MongoDB/Mongoose, JWT auth, products, orders, profile, wishlist)

### Features

- **Modern marketplace UI**: navbar with icons, responsive product grid, hover effects
- **Auth**: register/login with JWT, protected pages
- **Products**: browse + search + price filter, sell items, image upload (base64 or Cloudinary optional)
- **Delivery system**: checkout with full address fields + dummy payment, order ID + statuses
- **My Orders**: user-specific orders with status tracker
- **Wishlist**: save/remove products
- **Dark mode**: toggle stored in localStorage

---

## Setup (Local)

### 1) Prerequisites

- Node.js 18+ (recommended)
- MongoDB running locally (or use MongoDB Atlas)

### 2) Backend env

Copy:

- `server/.env.example` → `server/.env`

Edit `server/.env`:

- `MONGODB_URI=...`
- `JWT_SECRET=...`
- `CLIENT_ORIGIN=http://localhost:5173`

Optional Cloudinary (to store product images as URLs instead of base64):

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### 3) Start backend

```bash
cd server
npm install
npm run dev
```

Backend runs on `http://localhost:8080`.

### 4) Frontend env

Copy:

- `frontend/.env.example` → `frontend/.env`

### 5) Start frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

---

## Deploy (Get an “original/public URL”)

You’ll deploy **one service** that serves both:
- React build (frontend)
- Express API (backend)

### Option A (Recommended): Render + MongoDB Atlas

1) **Push this project to GitHub**

2) **Create MongoDB Atlas cluster**
- Create a free cluster
- Create DB user + allow IP (0.0.0.0/0 for quick testing)
- Copy connection string as `MONGODB_URI`

3) **Deploy on Render**
- Create “New Web Service”
- Connect GitHub repo
- Render will read `render.yaml`
- Set **Environment Variable**:
  - `MONGODB_URI` = your Atlas URI

4) After deploy, Render will give a public URL like:
- `https://ecoloop.onrender.com`

That URL is your **original site URL** (same URL for frontend + API).

### Frontend API base in production

In production the frontend automatically uses the same origin, so you don’t need to set `VITE_API_BASE_URL`.

## API Endpoints

Base URL: `/api`

### Auth

- `POST /api/register`
- `POST /api/login`

### Users

- `GET /api/profile` (JWT)
- `GET /api/wishlist` (JWT)
- `POST /api/wishlist/:productId` (JWT) — toggle

### Products

- `GET /api/products`
- `POST /api/products` (JWT) — sell item

### Orders

- `POST /api/order` (JWT)
- `GET /api/orders` (JWT) — user-specific
# 🌐 Live Website
https://tranquil-douhua-6afeef.netlify.app
