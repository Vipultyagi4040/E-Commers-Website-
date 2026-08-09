# Bhaiya G Readymade Garments — Online Store

Full-stack e-commerce website: React + TypeScript frontend, Node.js + Express + TypeScript backend,
PostgreSQL + Prisma database, Cloudinary image storage, Razorpay payments.

```
bhaiya-g-garments/
├── apps/
│   ├── backend/     → Express + TypeScript + Prisma API
│   └── frontend/    → React + TypeScript + Vite + Tailwind
├── package.json
└── README.md
```

## 1. Prerequisites

- Node.js 18+ installed
- A PostgreSQL database — easiest free option: [Neon](https://neon.tech) (just sign up, create a project, copy the connection string)
- A [Cloudinary](https://cloudinary.com) account (free tier) — for product image uploads
- A [Razorpay](https://razorpay.com) account (test mode is fine) — for payments

## 2. Backend Setup

```bash
cd apps/backend
npm install
cp .env.example .env
```

Open `.env` and fill in:
- `DATABASE_URL` → your Neon/Postgres connection string
- `JWT_SECRET` → any long random string
- `CLOUDINARY_*` → from your Cloudinary dashboard
- `RAZORPAY_*` → from your Razorpay dashboard (test keys)

Then run:

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run seed        # creates an admin user + sample products
npm run dev
```

Backend runs at **http://localhost:5000**

Default admin login (from seed):
- Email: `admin@bhaiyag.com`
- Password: `admin123`

⚠️ Change this password immediately after first login in production.

Check tables anytime with:
```bash
npx prisma studio
```

## 3. Frontend Setup

Open a new terminal:

```bash
cd apps/frontend
npm install
cp .env.example .env
```

`.env` already points to `http://localhost:5000/api` by default — just add your
`VITE_RAZORPAY_KEY_ID` (same key id as backend).

```bash
npm run dev
```

Frontend runs at **http://localhost:5173**

## 4. Using the site

- Visit `http://localhost:5173` → browse products, add to cart, checkout (Razorpay test mode)
- Register a normal account to shop as a customer
- Login with the seeded admin account and go to `/admin/dashboard` to manage products & orders

## 5. Deployment (when ready)

| Part      | Recommended host        |
|-----------|--------------------------|
| Frontend  | Vercel                   |
| Backend   | Render or Railway        |
| Database  | Neon (PostgreSQL)        |
| Images    | Cloudinary               |

Remember to set the same environment variables on your hosting platform, and update
`CLIENT_URL` (backend) and `VITE_API_URL` (frontend) to your real deployed URLs.

## 6. Tech Stack

**Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router, Axios
**Backend:** Node.js, Express, TypeScript, Prisma ORM
**Database:** PostgreSQL
**Storage:** Cloudinary
**Payments:** Razorpay
**Auth:** JWT + bcrypt

## 7. Troubleshooting

- **Prisma migrate fails** → double check `DATABASE_URL` is correct and the database is reachable
- **Images not uploading** → check Cloudinary credentials in backend `.env`
- **Payment popup not opening** → check `VITE_RAZORPAY_KEY_ID` matches backend `RAZORPAY_KEY_ID`
- **CORS error** → make sure `CLIENT_URL` in backend `.env` matches your frontend URL exactly
