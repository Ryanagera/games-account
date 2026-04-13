# 🎮 GAMES-ACCOUNT MARKETPLACE — FULL BLUEPRINT

> **Status Proyek:** Terinisialisasi (client/ + server/ sudah ada)
> **Stack:** React+Vite+TS | Express+Prisma+PostgreSQL | Clerk Auth | Midtrans

---

## DAFTAR ISI

1. [Arsitektur Sistem](#1-arsitektur-sistem)
2. [Struktur Folder Lengkap](#2-struktur-folder-lengkap)
3. [Database Schema (Prisma)](#3-database-schema-prisma)
4. [API Contract (Endpoint Map)](#4-api-contract-endpoint-map)
5. [Frontend Page Map & Component Tree](#5-frontend-page-map--component-tree)
6. [Implementation Plan — Fase per Fase](#6-implementation-plan--fase-per-fase)
7. [Plan Koneksi Frontend ↔ Backend](#7-plan-koneksi-frontend--backend)
8. [Payment Flow Diagram](#8-payment-flow-diagram)
9. [Environment Variables Reference](#9-environment-variables-reference)
10. [Definition of Done per Fitur](#10-definition-of-done-per-fitur)

---

## 1. ARSITEKTUR SISTEM

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (port 5173)                    │
│  React + Vite + TypeScript                                   │
│  ┌──────────┐  ┌──────────────┐  ┌────────────────────────┐ │
│  │ Clerk    │  │ React Query  │  │ Tailwind CSS + shadcn   │ │
│  │ (Auth)   │  │ (API State)  │  │ (UI Layer)             │ │
│  └────┬─────┘  └──────┬───────┘  └────────────────────────┘ │
│       │               │                                       │
└───────┼───────────────┼───────────────────────────────────────┘
        │ JWT Token      │ HTTP Requests (Axios)
        ▼               ▼
┌─────────────────────────────────────────────────────────────┐
│                    SERVER (port 3000)                        │
│  Express.js + TypeScript                                     │
│  ┌────────────┐  ┌────────────┐  ┌──────────────────────┐  │
│  │ Clerk      │  │  Routes /  │  │  Midtrans SDK        │  │
│  │ Middleware │  │ Controllers│  │  (Payment Gateway)   │  │
│  └────────────┘  └─────┬──────┘  └──────────────────────┘  │
│                        │                                      │
│                   ┌────▼──────┐                              │
│                   │  Prisma   │                              │
│                   │   ORM     │                              │
│                   └────┬──────┘                              │
└────────────────────────┼────────────────────────────────────┘
                         │
                    ┌────▼──────┐
                    │PostgreSQL │
                    │(Database) │
                    └───────────┘

         ┌──────────────────────┐
         │   Midtrans / Xendit  │ ──→ Webhook → /api/payment/webhook
         │  (Payment Provider)  │
         └──────────────────────┘

         ┌──────────────────────┐
         │   Clerk Dashboard    │ (User Management External)
         └──────────────────────┘
```

---

## 2. STRUKTUR FOLDER LENGKAP

### CLIENT (client/)

```
client/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/                    # Static assets (images, icons)
│   │   └── games/                 # Game logo assets
│   │
│   ├── components/                # Reusable UI components
│   │   ├── ui/                    # shadcn/ui base components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   └── skeleton.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Navbar.tsx         # Top navigation bar
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx        # Dashboard sidebar
│   │   │   └── MobileMenu.tsx
│   │   │
│   │   ├── product/
│   │   │   ├── ProductCard.tsx    # Card listing produk
│   │   │   ├── ProductGrid.tsx    # Grid container
│   │   │   ├── ProductFilter.tsx  # Filter sidebar
│   │   │   ├── ProductSearch.tsx  # Search bar + autocomplete
│   │   │   └── ProductBadge.tsx   # Tag: "Verified", "Hot", dll
│   │   │
│   │   ├── checkout/
│   │   │   ├── CheckoutForm.tsx   # Form data pembeli
│   │   │   ├── PaymentMethod.tsx  # Pilihan metode bayar
│   │   │   └── OrderSummary.tsx   # Ringkasan pesanan
│   │   │
│   │   └── common/
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       ├── EmptyState.tsx
│   │       └── ImageWithFallback.tsx
│   │
│   ├── pages/                     # Route-level components
│   │   ├── HomePage.tsx           # Landing + featured products
│   │   ├── BrowsePage.tsx         # Browse semua akun
│   │   ├── ProductDetailPage.tsx  # Detail 1 akun
│   │   ├── CheckoutPage.tsx       # Halaman checkout
│   │   ├── PaymentSuccessPage.tsx
│   │   ├── PaymentPendingPage.tsx
│   │   │
│   │   ├── auth/
│   │   │   ├── SignInPage.tsx     # Clerk Sign In
│   │   │   └── SignUpPage.tsx     # Clerk Sign Up
│   │   │
│   │   └── dashboard/             # Protected routes
│   │       ├── DashboardPage.tsx  # Overview
│   │       ├── MyOrdersPage.tsx   # Riwayat transaksi buyer
│   │       ├── MyListingsPage.tsx # Produk yang dijual (seller)
│   │       ├── CreateListingPage.tsx
│   │       ├── EditListingPage.tsx
│   │       └── ProfilePage.tsx
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── useProducts.ts         # React Query hooks untuk produk
│   │   ├── useTransactions.ts
│   │   ├── useCheckout.ts
│   │   └── useUser.ts
│   │
│   ├── lib/                       # Utilities & config
│   │   ├── api.ts                 # Axios instance (base URL, interceptors)
│   │   ├── queryClient.ts         # React Query client config
│   │   └── utils.ts               # Helper functions (formatRupiah, dll)
│   │
│   ├── types/                     # TypeScript type definitions
│   │   ├── product.types.ts
│   │   ├── transaction.types.ts
│   │   └── user.types.ts
│   │
│   ├── router/
│   │   └── index.tsx              # React Router v6 config
│   │
│   ├── App.tsx
│   ├── main.tsx                   # ✅ sudah ada (Clerk + QueryClient)
│   └── index.css
│
├── .env                           # ✅ sudah ada
├── .gitignore                     # ✅ sudah ada
├── vite.config.ts                 # ✅ sudah ada
└── package.json                   # ✅ sudah ada
```

### SERVER (server/)

```
server/
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── migrations/               # Auto-generated migrations
│
├── src/
│   ├── config/
│   │   ├── database.ts            # Prisma client singleton
│   │   └── midtrans.ts            # Midtrans config & instance
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts     # Clerk JWT verification
│   │   ├── error.middleware.ts    # Global error handler
│   │   └── validate.middleware.ts # Request body validation (Zod)
│   │
│   ├── modules/                   # Feature-based structure
│   │   ├── user/
│   │   │   ├── user.routes.ts
│   │   │   ├── user.controller.ts
│   │   │   └── user.service.ts
│   │   │
│   │   ├── product/
│   │   │   ├── product.routes.ts
│   │   │   ├── product.controller.ts
│   │   │   ├── product.service.ts
│   │   │   └── product.schema.ts  # Zod validation schema
│   │   │
│   │   ├── transaction/
│   │   │   ├── transaction.routes.ts
│   │   │   ├── transaction.controller.ts
│   │   │   └── transaction.service.ts
│   │   │
│   │   └── payment/
│   │       ├── payment.routes.ts
│   │       ├── payment.controller.ts
│   │       └── payment.service.ts
│   │
│   ├── utils/
│   │   ├── response.ts            # Standardized API response helper
│   │   └── logger.ts
│   │
│   ├── types/
│   │   └── express.d.ts           # Augment Request type (add user)
│   │
│   └── index.ts                   # Express app entry point
│
├── .env                           # ✅ sudah ada
├── .env.example                   # ✅ sudah ada
├── .gitignore                     # ✅ sudah ada
└── package.json                   # ✅ sudah ada
```

---

## 3. DATABASE SCHEMA (PRISMA)

```prisma
// server/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── USER ───────────────────────────────────────────────
model User {
  id          String   @id @default(cuid())
  clerkId     String   @unique         // ID dari Clerk Auth
  email       String   @unique
  username    String?
  avatarUrl   String?
  role        Role     @default(BUYER)
  isVerified  Boolean  @default(false)  // Seller verification
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  products     Product[]
  transactions Transaction[] @relation("BuyerTransactions")
  reviews      Review[]

  @@map("users")
}

enum Role {
  BUYER
  SELLER
  ADMIN
}

// ─── PRODUCT (Akun Game) ────────────────────────────────
model Product {
  id           String        @id @default(cuid())
  sellerId     String
  seller       User          @relation(fields: [sellerId], references: [id])

  title        String
  description  String        @db.Text
  game         GameType      // Enum game
  price        Int           // dalam Rupiah (IDR)
  rank         String?       // e.g. "Mythic", "Grandmaster"
  server       String?       // e.g. "Asia", "NA"
  heroes       String[]      // List nama hero/karakter
  imageUrls    String[]      // Array URL gambar screenshot

  accountLevel Int?
  winRate      Float?

  status       ProductStatus @default(PENDING)
  isFeatured   Boolean       @default(false)
  viewCount    Int           @default(0)

  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  transactions Transaction[]
  reviews      Review[]

  @@map("products")
}

enum GameType {
  MOBILE_LEGENDS
  FREE_FIRE
  PUBG_MOBILE
  GENSHIN_IMPACT
  VALORANT
  LEAGUE_OF_LEGENDS
  OTHER
}

enum ProductStatus {
  PENDING    // Menunggu verifikasi admin
  ACTIVE     // Tersedia untuk dibeli
  SOLD       // Sudah terjual
  REJECTED   // Ditolak admin
  DELETED
}

// ─── TRANSACTION ────────────────────────────────────────
model Transaction {
  id              String            @id @default(cuid())
  buyerId         String
  buyer           User              @relation("BuyerTransactions", fields: [buyerId], references: [id])
  productId       String
  product         Product           @relation(fields: [productId], references: [id])

  amount          Int               // Total bayar (IDR)
  platformFee     Int               // Fee marketplace (misal 5%)
  sellerRevenue   Int               // amount - platformFee

  status          TransactionStatus @default(PENDING)
  paymentMethod   String?           // "bank_transfer", "gopay", dll

  // Midtrans fields
  midtransOrderId String?           @unique
  midtransToken   String?
  paymentUrl      String?
  paidAt          DateTime?

  // Setelah bayar, akun diberikan ke buyer
  accountEmail    String?           // Kredensial akun game
  accountPassword String?           // PENTING: encrypt sebelum simpan
  accountNotes    String?

  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  @@map("transactions")
}

enum TransactionStatus {
  PENDING     // Belum bayar
  PAID        // Sudah bayar, proses transfer akun
  COMPLETED   // Akun sudah diserahkan
  FAILED      // Pembayaran gagal
  CANCELLED   // Dibatalkan
  REFUNDED    // Dikembalikan
}

// ─── REVIEW ─────────────────────────────────────────────
model Review {
  id        String  @id @default(cuid())
  userId    String
  user      User    @relation(fields: [userId], references: [id])
  productId String
  product   Product @relation(fields: [productId], references: [id])

  rating    Int     // 1-5
  comment   String? @db.Text

  createdAt DateTime @default(now())

  @@unique([userId, productId])   // 1 user = 1 review per produk
  @@map("reviews")
}
```

---

## 4. API CONTRACT (ENDPOINT MAP)

### Base URL: `http://localhost:3000/api`

```
AUTH MIDDLEWARE: Header  →  Authorization: Bearer <clerk_jwt_token>
RESPONSE FORMAT:
  Success: { success: true, data: {...}, message: "..." }
  Error:   { success: false, error: "...", message: "..." }
```

### 🔵 USER ROUTES — `/api/users`

| Method | Endpoint | Auth | Deskripsi                                            |
| ------ | -------- | ---- | ---------------------------------------------------- |
| POST   | `/sync`  | ✅   | Sync user Clerk ke DB (dipanggil saat pertama login) |
| GET    | `/me`    | ✅   | Get profil user sendiri                              |
| PATCH  | `/me`    | ✅   | Update profil (username, avatar)                     |
| GET    | `/:id`   | ❌   | Get profil publik seller                             |

### 🟢 PRODUCT ROUTES — `/api/products`

| Method | Endpoint       | Auth        | Deskripsi                                          |
| ------ | -------------- | ----------- | -------------------------------------------------- |
| GET    | `/`            | ❌          | List produk (with filter: game, rank, price, sort) |
| GET    | `/:id`         | ❌          | Detail produk + seller info                        |
| POST   | `/`            | ✅ (SELLER) | Buat listing baru                                  |
| PATCH  | `/:id`         | ✅ (owner)  | Update listing                                     |
| DELETE | `/:id`         | ✅ (owner)  | Hapus listing (soft delete)                        |
| GET    | `/my/listings` | ✅          | Produk milik seller sendiri                        |

**Query Params GET /products:**

```
?game=MOBILE_LEGENDS
&minPrice=100000
&maxPrice=500000
&rank=Mythic
&status=ACTIVE
&sort=price_asc | price_desc | newest | popular
&page=1
&limit=12
```

### 🟡 TRANSACTION ROUTES — `/api/transactions`

| Method | Endpoint        | Auth        | Deskripsi                               |
| ------ | --------------- | ----------- | --------------------------------------- |
| POST   | `/`             | ✅          | Buat transaksi baru (initiate checkout) |
| GET    | `/my`           | ✅          | Riwayat transaksi buyer                 |
| GET    | `/:id`          | ✅          | Detail transaksi (buyer/seller/admin)   |
| GET    | `/seller/sales` | ✅ (SELLER) | Penjualan seller                        |

### 🔴 PAYMENT ROUTES — `/api/payment`

| Method | Endpoint           | Auth          | Deskripsi                            |
| ------ | ------------------ | ------------- | ------------------------------------ |
| POST   | `/create-token`    | ✅            | Buat Midtrans Snap token             |
| POST   | `/webhook`         | ❌ (Midtrans) | Webhook notifikasi status pembayaran |
| GET    | `/status/:orderId` | ✅            | Cek status pembayaran                |

---

## 5. FRONTEND PAGE MAP & COMPONENT TREE

```
App
├── Layout (Navbar + Footer)
│   │
│   ├── / → HomePage
│   │   ├── HeroBanner
│   │   ├── GameCategoryBar (ML, FF, PUBG, dll)
│   │   ├── FeaturedProducts → ProductGrid → ProductCard[]
│   │   └── HowItWorks (3 langkah)
│   │
│   ├── /browse → BrowsePage
│   │   ├── ProductFilter (sidebar)
│   │   │   ├── FilterByGame
│   │   │   ├── FilterByPrice (range slider)
│   │   │   └── FilterByRank
│   │   ├── ProductSearch
│   │   ├── SortDropdown
│   │   └── ProductGrid (infinite scroll / pagination)
│   │
│   ├── /product/:id → ProductDetailPage
│   │   ├── ImageGallery (screenshots)
│   │   ├── ProductInfo (title, rank, server, heroes)
│   │   ├── SellerInfo + SellerRating
│   │   ├── BuyButton → redirect ke /checkout/:id
│   │   └── ReviewList
│   │
│   ├── /checkout/:productId → CheckoutPage [PROTECTED]
│   │   ├── OrderSummary
│   │   ├── BuyerContactForm (email, phone)
│   │   ├── PaymentMethod (Midtrans Snap popup)
│   │   └── ConfirmPayButton
│   │
│   ├── /payment/success → PaymentSuccessPage
│   ├── /payment/pending → PaymentPendingPage
│   │
│   ├── /sign-in → ClerkSignInPage
│   ├── /sign-up → ClerkSignUpPage
│   │
│   └── /dashboard [PROTECTED]
│       ├── /dashboard → DashboardOverview
│       │   ├── WelcomeCard
│       │   ├── RecentOrders
│       │   └── QuickActions
│       │
│       ├── /dashboard/orders → MyOrdersPage
│       │   └── TransactionTable
│       │
│       ├── /dashboard/listings → MyListingsPage (SELLER)
│       │   ├── ListingTable
│       │   └── CreateListingButton
│       │
│       ├── /dashboard/listings/create → CreateListingPage
│       │   └── MultiStepForm
│       │       ├── Step 1: Game Info
│       │       ├── Step 2: Account Details
│       │       ├── Step 3: Pricing
│       │       └── Step 4: Upload Screenshots
│       │
│       └── /dashboard/profile → ProfilePage
```

---

## 6. IMPLEMENTATION PLAN — FASE PER FASE

### ━━━ FASE 0 — Foundation Setup (1–2 hari) ━━━

> **Goal:** Project bisa jalan, DB terkoneksi, basic auth bekerja.

#### 0.1 — Server Setup

```bash
# Install dependencies yang mungkin kurang
cd server
npm install express cors helmet morgan zod
npm install @clerk/express          # Clerk server-side middleware
npm install midtrans-client         # Payment gateway SDK

# Dev dependencies
npm install -D typescript @types/express @types/node ts-node-dev
```

**Task list:**

- [ ] Buat `src/index.ts` — Express app dengan CORS, helmet, morgan
- [ ] Konfigurasi CORS untuk allow `http://localhost:5173`
- [ ] Buat `src/config/database.ts` — Prisma client singleton
- [ ] Set `DATABASE_URL` di `.env`
- [ ] Jalankan `npx prisma migrate dev --name init` dengan schema dasar
- [ ] Test koneksi: `GET /api/health` → `{ status: "ok" }`

#### 0.2 — Prisma Schema

- [ ] Copy schema dari Section 3 blueprint ini ke `prisma/schema.prisma`
- [ ] Run migration: `npx prisma migrate dev --name init`
- [ ] Run `npx prisma generate`

#### 0.3 — Client Setup

```bash
cd client
npm install axios react-router-dom
npm install @radix-ui/react-dialog @radix-ui/react-select  # Jika pakai shadcn
npm install lucide-react                                    # Icons
npm install react-hot-toast                                 # Notifications
```

- [ ] Buat `src/lib/api.ts` — Axios instance dengan base URL
- [ ] Buat `src/router/index.tsx` — React Router setup
- [ ] Update `App.tsx` untuk render `RouterProvider`

---

### ━━━ FASE 1 — Auth Integration (1 hari) ━━━

> **Goal:** User bisa sign up, sign in, dan server bisa verifikasi JWT Clerk.

#### 1.1 — Server: Clerk Middleware

```typescript
// src/middleware/auth.middleware.ts
import { clerkMiddleware, getAuth } from "@clerk/express";

export const requireAuth = clerkMiddleware();

export const getCurrentUser = (req, res, next) => {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  req.userId = userId;
  next();
};
```

- [ ] Tambah `CLERK_SECRET_KEY` ke `.env` server
- [ ] Apply middleware ke route yang butuh auth
- [ ] Buat `POST /api/users/sync` — dipanggil setelah login pertama

#### 1.2 — Client: Auth Pages & User Sync

```typescript
// src/hooks/useUser.ts
// Setelah Clerk sign in, panggil /api/users/sync
// Simpan user data di React Query cache
```

- [ ] Buat `SignInPage.tsx` dengan komponen `<SignIn />` dari Clerk
- [ ] Buat `SignUpPage.tsx` dengan komponen `<SignUp />` dari Clerk
- [ ] Buat `ProtectedRoute.tsx` — wrap halaman yang butuh auth
- [ ] Hook `useUser.ts` — sync user ke backend setelah sign in

#### 1.3 — Test Auth Flow

```
[ ] Sign up berhasil → user masuk ke DB
[ ] Sign in berhasil → dapat JWT
[ ] Request ke protected route tanpa token → 401
[ ] Request dengan token valid → 200
```

---

### ━━━ FASE 2 — Product CRUD (2–3 hari) ━━━

> **Goal:** Seller bisa upload listing, buyer bisa browse & lihat detail.

#### 2.1 — Server: Product Module

- [ ] `product.routes.ts` — define semua route
- [ ] `product.service.ts` — business logic (query Prisma)
- [ ] `product.controller.ts` — handle req/res
- [ ] `product.schema.ts` — Zod validation untuk create/update

**Prioritas endpoint:**

1. `GET /api/products` (dengan pagination + filter)
2. `GET /api/products/:id`
3. `POST /api/products` (protected, seller only)

#### 2.2 — Client: Browse & Detail

- [ ] `useProducts.ts` — React Query hooks

  ```typescript
  export const useProducts = (filters) =>
    useQuery(["products", filters], () =>
      api.get("/products", { params: filters }),
    );

  export const useProduct = (id) =>
    useQuery(["product", id], () => api.get(`/products/${id}`));
  ```

- [ ] `BrowsePage.tsx` — ProductGrid + filter sidebar
- [ ] `ProductDetailPage.tsx` — detail + buy button

#### 2.3 — Client: Create Listing (Dashboard)

- [ ] Multi-step form dengan state management lokal
- [ ] Image upload (gunakan Cloudinary atau base64 sementara)
- [ ] `useMutation` untuk POST /api/products

---

### ━━━ FASE 3 — Payment Integration (2–3 hari) ━━━

> **Goal:** Buyer bisa checkout dan bayar via Midtrans.

#### 3.1 — Server: Payment Module

```typescript
// src/config/midtrans.ts
import Midtrans from "midtrans-client";

export const snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
});
```

- [ ] `POST /api/payment/create-token`
  - Buat transaksi di DB (status: PENDING)
  - Generate Snap token dari Midtrans
  - Return `{ token, redirect_url }`
- [ ] `POST /api/payment/webhook`
  - Verifikasi signature dari Midtrans
  - Update status transaksi di DB
  - Jika PAID: kirim credentials akun ke buyer (via email / tampil di dashboard)

#### 3.2 — Client: Checkout Flow

```typescript
// CheckoutPage.tsx
// 1. Panggil POST /api/payment/create-token
// 2. Dapat snap_token
// 3. Panggil window.snap.pay(snap_token, { ... callbacks })
```

- [ ] Load Midtrans Snap JS di `index.html`:
  ```html
  <script
    src="https://app.sandbox.midtrans.com/snap/snap.js"
    data-client-key="YOUR_CLIENT_KEY"
  ></script>
  ```
- [ ] `CheckoutPage.tsx` — form + trigger payment
- [ ] Handle callback success/error dari Snap popup
- [ ] Redirect ke `/payment/success` atau `/payment/pending`

---

### ━━━ FASE 4 — Dashboard & Polish (2 hari) ━━━

- [ ] `MyOrdersPage` — list transaksi buyer + status badge
- [ ] `MyListingsPage` — list produk seller + manage
- [ ] Admin: approve/reject listing (opsional, bisa hardcode dulu)
- [ ] Review system
- [ ] Loading skeleton, empty states, error states
- [ ] Responsive mobile

---

## 7. PLAN KONEKSI FRONTEND ↔ BACKEND

> Ini adalah bagian paling kritis untuk dikerjakan **sekarang** karena client dan server belum terhubung sama sekali.

### Step 1 — Axios Instance (client)

**Buat file: `client/src/lib/api.ts`**

```typescript
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: otomatis inject Clerk JWT ke setiap request
api.interceptors.request.use(async (config) => {
  // Ambil token dari Clerk (window.__clerk atau useAuth hook)
  const token = await window.Clerk?.session?.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: handle error global
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect ke sign in
      window.location.href = "/sign-in";
    }
    return Promise.reject(error.response?.data || error);
  },
);

export default api;
```

### Step 2 — CORS Setup (server)

**Update: `server/src/index.ts`**

```typescript
import cors from "cors";

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
```

### Step 3 — Environment Variables

**`client/.env`** (tambahkan):

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...   # ✅ sudah ada
VITE_API_URL=http://localhost:3000/api
VITE_MIDTRANS_CLIENT_KEY=Client-xxx
```

**`server/.env`** (tambahkan):

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/games_account
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
CLIENT_URL=http://localhost:5173
MIDTRANS_SERVER_KEY=SB-Mid-server-xxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxx
PORT=3000
```

### Step 4 — User Sync Hook (client)

**Buat file: `client/src/hooks/useUserSync.ts`**

```typescript
import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";

export const useUserSync = () => {
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();

  const syncMutation = useMutation({
    mutationFn: () =>
      api.post("/users/sync", {
        email: user?.primaryEmailAddress?.emailAddress,
        username: user?.username,
        avatarUrl: user?.imageUrl,
      }),
  });

  useEffect(() => {
    if (isSignedIn && user) {
      syncMutation.mutate();
    }
  }, [isSignedIn, user?.id]);
};
```

**Panggil di `App.tsx`:**

```typescript
function App() {
  useUserSync()   // ← tambahkan ini
  return <RouterProvider router={router} />
}
```

### Step 5 — Standardized Response (server)

**Buat file: `server/src/utils/response.ts`**

```typescript
import { Response } from "express";

export const sendSuccess = (
  res: Response,
  data: any,
  message = "Success",
  status = 200,
) => {
  return res.status(status).json({ success: true, data, message });
};

export const sendError = (res: Response, message: string, status = 500) => {
  return res.status(status).json({ success: false, error: message });
};
```

### Step 6 — Auth Middleware (server)

**Buat file: `server/src/middleware/auth.middleware.ts`**

```typescript
import { clerkMiddleware, getAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";
import prisma from "@/config/database";

// Apply globally di index.ts
export const clerkAuth = clerkMiddleware();

// Gunakan di route yang perlu user object dari DB
export const requireUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId: clerkId } = getAuth(req);

  if (!clerkId) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  const user = await prisma.user.findUnique({ where: { clerkId } });

  if (!user) {
    return res
      .status(404)
      .json({ success: false, error: "User not found. Please sync account." });
  }

  req.dbUser = user; // Augmented dengan types/express.d.ts
  next();
};
```

### Step 7 — Health Check Test

Setelah semua setup, test koneksi dengan:

```bash
# Terminal 1 — jalankan server
cd server && npm run dev

# Terminal 2 — jalankan client
cd client && npm run dev
```

```typescript
// Tambahkan sementara di HomePage.tsx untuk test koneksi
useEffect(() => {
  fetch("http://localhost:3000/api/health")
    .then((r) => r.json())
    .then((data) => console.log("Server OK:", data))
    .catch((err) => console.error("Server ERROR:", err));
}, []);
```

---

## 8. PAYMENT FLOW DIAGRAM

```
BUYER                    CLIENT                    SERVER                 MIDTRANS
  │                        │                          │                       │
  │── klik "Beli" ────────►│                          │                       │
  │                        │── POST /transactions ───►│                       │
  │                        │                          │── createTransaction() │
  │                        │                          │── (save to DB PENDING)│
  │                        │                          │── snap.createTransaction►│
  │                        │                          │◄─── { snap_token } ──│
  │                        │◄── { snap_token } ───────│                       │
  │                        │                          │                       │
  │                        │ window.snap.pay(token)   │                       │
  │◄── Midtrans Popup ─────│                          │                       │
  │── pilih metode bayar   │                          │                       │
  │── bayar ──────────────►│                          │──────────────────────►│
  │                        │                          │                       │
  │                        │                          │◄── WEBHOOK (status) ──│
  │                        │                          │── update DB PAID      │
  │                        │                          │── kirim kredensial    │
  │◄── sukses callback ────│                          │                       │
  │                        │── redirect /success ─────│                       │
```

---

## 9. ENVIRONMENT VARIABLES REFERENCE

### client/.env.example

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxx
VITE_API_URL=http://localhost:3000/api
VITE_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxxxxxx
```

### server/.env.example

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/games_account_db

# Server
PORT=3000
NODE_ENV=development

# CORS
CLIENT_URL=http://localhost:5173

# Clerk Auth
CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxx

# Midtrans (Sandbox)
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxxxxxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxxxxxx
MIDTRANS_IS_PRODUCTION=false

# Security
JWT_SECRET=your-super-secret-jwt-string-here
ENCRYPTION_KEY=32-char-key-for-encrypting-passwords
```

---

## 10. DEFINITION OF DONE PER FITUR

### ✅ Checklist per Fitur Sebelum Merge

| Fitur              | Backend Done               | Frontend Done       | Terintegrasi           | Tested |
| ------------------ | -------------------------- | ------------------- | ---------------------- | ------ |
| Auth (Clerk sync)  | POST /users/sync           | useUserSync hook    | User tersimpan di DB   | ☐      |
| Browse Produk      | GET /products              | BrowsePage + filter | Data tampil dari DB    | ☐      |
| Detail Produk      | GET /products/:id          | ProductDetailPage   | Data real dari API     | ☐      |
| Buat Listing       | POST /products             | CreateListingPage   | Form submit ke DB      | ☐      |
| Checkout           | POST /transactions         | CheckoutPage        | Transaksi terbuat      | ☐      |
| Payment            | POST /payment/create-token | Snap popup          | Token dari Midtrans    | ☐      |
| Webhook            | POST /payment/webhook      | PaymentSuccessPage  | Status update otomatis | ☐      |
| Dashboard Orders   | GET /transactions/my       | MyOrdersPage        | List dari DB           | ☐      |
| Dashboard Listings | GET /products/my           | MyListingsPage      | List dari DB           | ☐      |

---

## URUTAN PENGERJAAN YANG DISARANKAN

```
MINGGU 1:
  Hari 1-2: FASE 0 — Server + DB running, Health check endpoint OK
  Hari 3:   FASE 1 — Auth middleware server + useUserSync client
  Hari 4-5: Koneksi client-server (Section 7), test auth end-to-end

MINGGU 2:
  Hari 1-2: FASE 2 — Product backend (GET list, GET detail, POST create)
  Hari 3-4: FASE 2 — Product frontend (BrowsePage, DetailPage, CreateListing)
  Hari 5:   Testing + bugfix

MINGGU 3:
  Hari 1-3: FASE 3 — Payment (Midtrans token + webhook + checkout page)
  Hari 4-5: FASE 4 — Dashboard, polish, responsive

MINGGU 4:
  Deploy, staging test, fix bugs
```

---

_Blueprint ini dibuat berdasarkan struktur proyek yang sudah ada (`client/` + `server/`). Mulai dari Fase 0 dan ikuti urutan checklist agar tidak ada dependency yang terlewat._
