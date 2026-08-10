# 🍛 Foody Cloud

![Foody Cloud Banner](public/banner.jpg)

> **Pure Veg Home Kitchen** — Production-grade cloud kitchen e-commerce platform

Foody Cloud is a full-stack, database-driven food ordering platform for a pure vegetarian home kitchen. Built to be managed entirely by a non-technical business owner through the admin dashboard — no code changes required for day-to-day operations.

## ✨ Features

- **Customer Website**: Browse menu, search, add to cart, checkout, track order
- **Admin Dashboard**: Manage foods, categories, orders, offers, customers, settings
- **Database-driven**: All content managed through admin panel — no hardcoded data
- **Order Integrity**: Historical order data preserved even when foods are removed
- **Kitchen Controls**: Open/close kitchen, pause orders, set delivery settings
- **Media Library**: Cloud-hosted food images via Cloudinary
- **SEO Ready**: Sitemap, robots.txt, Open Graph, structured metadata
- **Mobile-first**: Responsive across all devices

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | NextAuth.js v5 (Credentials) |
| Validation | Zod |
| Image Storage | Cloudinary |
| Deployment | Vercel |

## 📋 Prerequisites

- **Node.js** v18 or later ([nodejs.org](https://nodejs.org))
- **npm** v9 or later
- **PostgreSQL** database (recommended: [Supabase](https://supabase.com) free tier)
- **Cloudinary** account ([cloudinary.com](https://cloudinary.com) free tier)

## ⚡ Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in all required values:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_URL` | Your app URL (http://localhost:3000 for dev) |
| `NEXTAUTH_SECRET` | Random secret (generate with `openssl rand -base64 32`) |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin login password |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Same as CLOUDINARY_CLOUD_NAME |
| `NEXT_PUBLIC_APP_URL` | Your app URL |

### 3. Set up the database

```bash
# Run migrations
npm run db:migrate

# Seed with real Foody Cloud menu data
npm run db:seed
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the customer website.

Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the admin dashboard.

## 🔐 Admin Access

After seeding:

| Field | Value |
|-------|-------|
| URL | `/admin/login` |
| Email | Value of `ADMIN_EMAIL` in `.env` |
| Password | Value of `ADMIN_PASSWORD` in `.env` |

> ⚠️ **Important**: Change the default password before deploying to production.

## 📁 Project Structure

```
foody-cloud/
├── app/
│   ├── (store)/           # Customer-facing pages
│   │   ├── page.tsx       # Homepage
│   │   ├── menu/          # Menu page
│   │   ├── cart/          # Cart page
│   │   ├── checkout/      # Checkout page
│   │   └── order/         # Order confirmation
│   ├── (admin)/admin/     # Admin dashboard (protected)
│   │   ├── page.tsx       # Dashboard overview
│   │   ├── orders/        # Order management
│   │   ├── foods/         # Food/menu management
│   │   ├── categories/    # Category management
│   │   ├── offers/        # Offers & discounts
│   │   ├── customers/     # Customer list
│   │   ├── media/         # Image library
│   │   └── settings/      # Business settings
│   ├── api/
│   │   ├── admin/         # Protected admin APIs
│   │   └── store/         # Public customer APIs
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── admin/             # Admin UI components
│   └── store/             # Customer UI components
├── context/
│   └── CartContext.tsx    # Shopping cart state
├── lib/
│   ├── prisma.ts          # Prisma client singleton
│   ├── auth.ts            # NextAuth configuration
│   ├── utils.ts           # Utility functions
│   └── validations.ts     # Zod schemas
├── middleware.ts           # Auth guard for /admin/*
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seeder
├── .env.example
├── next.config.ts
├── tailwind.config.ts
└── README.md
```

## 🗄️ Database Schema

Key entities:

- **AdminUser** — Dashboard users
- **Category** — Food categories (Roti & Paratha, Sabzi, etc.)
- **Food** — Menu items (soft-deleted to preserve order history)
- **FoodVariant** / **AddOn** — Future extensibility for size/extras
- **Offer** — Discount/promo codes
- **Customer** — Order customers
- **Order** + **OrderItem** — Orders with historical snapshots
- **BusinessSettings** — All business configuration
- **HomepageSettings** — Homepage content control
- **Media** — Cloudinary image library

## 🚀 Deployment (Vercel)

### 1. Create a Vercel project

Connect your GitHub repository to Vercel.

### 2. Set environment variables

In Vercel → Settings → Environment Variables, add all variables from `.env.example`.

### 3. Database

Use [Supabase](https://supabase.com) for managed PostgreSQL:
1. Create a new project
2. Go to Settings → Database → Connection string
3. Copy the connection URI and set as `DATABASE_URL`

### 4. Run migrations

Run from your local machine targeting the production database:

```bash
npm run db:migrate
npm run db:seed
```

### 5. Deploy

Push to your main branch. Vercel will build and deploy automatically.

## 👨‍💻 Development Notes

### Adding a new food item (via admin)

1. Log into `/admin`
2. Go to **Menu & Food** → **Add Food**
3. Fill in the details and save
4. The food immediately appears on the customer website

No code changes required.

### Adding a new food item (via seed, for developers)

Edit `prisma/seed.ts` and add an entry to the `foods` array, then run:

```bash
npm run db:seed
```

### Key architectural decisions

**Soft deletion**: Foods are never permanently deleted. Setting `isDeleted: true` hides them from the menu while preserving order history. This ensures historical orders always display their original item names and prices.

**Order snapshots**: `OrderItem` stores `foodName`, `unitPrice`, `categoryName` etc. at time of purchase — independent of the current food record. Even if a food is renamed or deleted, old orders remain accurate.

**Separate payment & order status**: Payment status (PENDING/PAID/etc.) is independent of order status (NEW/PREPARING/etc.), enabling future payment gateway integration without schema changes.

**Server components**: Data-heavy pages (menu, orders list) use Next.js Server Components for fast initial load without client-side waterfalls.

## 📞 Business Contact

- **Phone/WhatsApp**: 90071 82421
- **Instagram**: [@foody.cloud](https://www.instagram.com/foody.cloud)
- **Location**: Chinar Park, Kolupukur
- **FSSAI**: 22826136000840

## 📄 License

This project is proprietary software for Foody Cloud. All rights reserved.
