# FRC Bazaar - FIRST Robotics Parts Marketplace

## Complete Implementation Plan & Architecture Document

---

## Executive Summary

FRC Bazaar is a web-based marketplace designed specifically for FIRST Robotics teams to buy, sell, and exchange robot parts. The platform aims to reduce inequality between teams by making robotics components more accessible and affordable through peer-to-peer exchange.

---

## 1. Technology Stack Recommendations

### Authentication: **Clerk** (Recommended over Firebase Auth)

**Why Clerk wins for this project:**

| Factor | Clerk | Firebase Auth |
|--------|-------|---------------|
| **Next.js Integration** | First-class App Router support, native RSC integration | Problematic SSR, requires workarounds |
| **Setup Time** | 5-15 minutes with pre-built components | 30-60 minutes + complex SSR configuration |
| **Pre-built UI** | Full suite (SignIn, SignUp, UserButton) | None - must build from scratch |
| **Free Tier** | 10,000 MAU | 50,000 MAU (but more complexity) |
| **Developer Experience** | 10/10 - plug and play | 6/10 - requires service workers, dual SDK |
| **Middleware Support** | Native Edge runtime support | Edge runtime incompatibilities |

**Key advantages for your use case:**
- Zero-configuration security with breach detection and bot protection
- Pre-built, customizable components that match your dark/red theme
- Native Supabase integration with Row Level Security (RLS) support
- OAuth providers (Google) work out of the box

### Database & Backend: **Supabase** (Recommended over Neon)

**Why Supabase wins for this project:**

| Factor | Supabase | Neon |
|--------|----------|------|
| **Architecture** | Full BaaS (Backend-as-a-Service) | Pure database only |
| **Auth** | Built-in (but we use Clerk) | None |
| **Storage** | S3-compatible object storage included | None - need separate service |
| **Real-time** | Built-in subscriptions | None |
| **APIs** | Auto-generated REST/GraphQL | Manual setup required |
| **Free Tier** | 500MB database, 1GB storage, unlimited users | 0.5GB storage, 191.9 compute hours |

**Critical for your project:**
- **Storage included**: Perfect for listing images (1-5 per listing)
- **Row Level Security**: Users can only edit/delete their own listings
- **Real-time**: Live updates when new listings are posted
- **Auto-generated APIs**: Faster development with PostgREST

### Complete Stack Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│   Next.js 14 (App Router) + TypeScript + Tailwind CSS       │
│   • Server Components for SEO                                │
│   • Client Components for interactivity                      │
│   • React Server Actions for mutations                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     AUTHENTICATION                           │
│                         Clerk                                │
│   • Google OAuth + Email/Password                            │
│   • Pre-built UI components                                  │
│   • Middleware for protected routes                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE & STORAGE                         │
│                        Supabase                              │
│   • PostgreSQL database                                      │
│   • Row Level Security policies                              │
│   • Object storage for images                                │
│   • Real-time subscriptions                                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        HOSTING                               │
│                         Vercel                               │
│   • Edge functions                                           │
│   • Automatic HTTPS                                          │
│   • Global CDN                                               │
│   • Preview deployments                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Database Schema Design

### Entity Relationship Diagram

```
┌──────────────────┐       ┌──────────────────┐
│     profiles     │       │   sell_listings  │
├──────────────────┤       ├──────────────────┤
│ id (PK, FK)      │◄──────│ owner_id (FK)    │
│ email            │       │ id (PK)          │
│ display_name     │       │ title            │
│ avatar_url       │       │ description      │
│ team_number      │       │ category         │
│ created_at       │       │ condition        │
│ updated_at       │       │ price            │
└──────────────────┘       │ location         │
         │                 │ contact_type     │
         │                 │ contact_value    │
         │                 │ images[]         │
         │                 │ created_at       │
         │                 │ updated_at       │
         │                 └──────────────────┘
         │
         │                 ┌──────────────────┐
         │                 │   buy_requests   │
         └────────────────►├──────────────────┤
                           │ owner_id (FK)    │
                           │ id (PK)          │
                           │ item_needed      │
                           │ max_budget       │
                           │ location         │
                           │ contact_type     │
                           │ contact_value    │
                           │ created_at       │
                           │ updated_at       │
                           └──────────────────┘
```

### SQL Schema

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (synced with Clerk)
CREATE TABLE profiles (
  id TEXT PRIMARY KEY,  -- Clerk user ID
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  team_number INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories enum
CREATE TYPE listing_category AS ENUM (
  'motors',
  'sensors',
  'controllers',
  'wheels',
  'structure',
  'electronics',
  'other'
);

-- Condition enum
CREATE TYPE item_condition AS ENUM (
  'new',
  'used',
  'repaired'
);

-- Contact type enum
CREATE TYPE contact_type AS ENUM (
  'telegram',
  'phone'
);

-- Sell listings table
CREATE TABLE sell_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category listing_category NOT NULL,
  condition item_condition NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  location TEXT NOT NULL,
  contact_type contact_type NOT NULL,
  contact_value TEXT NOT NULL,
  images TEXT[] NOT NULL CHECK (array_length(images, 1) BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Buy requests table
CREATE TABLE buy_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  item_needed TEXT NOT NULL,
  max_budget DECIMAL(10, 2) NOT NULL CHECK (max_budget >= 0),
  location TEXT NOT NULL,
  contact_type contact_type NOT NULL,
  contact_value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_sell_listings_category ON sell_listings(category);
CREATE INDEX idx_sell_listings_condition ON sell_listings(condition);
CREATE INDEX idx_sell_listings_price ON sell_listings(price);
CREATE INDEX idx_sell_listings_created_at ON sell_listings(created_at DESC);
CREATE INDEX idx_sell_listings_owner_id ON sell_listings(owner_id);
CREATE INDEX idx_sell_listings_title_search ON sell_listings USING GIN(to_tsvector('english', title));

CREATE INDEX idx_buy_requests_created_at ON buy_requests(created_at DESC);
CREATE INDEX idx_buy_requests_owner_id ON buy_requests(owner_id);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sell_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE buy_requests ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Sell listings policies
CREATE POLICY "Sell listings are viewable by everyone"
  ON sell_listings FOR SELECT
  USING (true);

CREATE POLICY "Users can create sell listings"
  ON sell_listings FOR INSERT
  WITH CHECK (owner_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own sell listings"
  ON sell_listings FOR UPDATE
  USING (owner_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can delete own sell listings"
  ON sell_listings FOR DELETE
  USING (owner_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Buy requests policies
CREATE POLICY "Buy requests are viewable by everyone"
  ON buy_requests FOR SELECT
  USING (true);

CREATE POLICY "Users can create buy requests"
  ON buy_requests FOR INSERT
  WITH CHECK (owner_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own buy requests"
  ON buy_requests FOR UPDATE
  USING (owner_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can delete own buy requests"
  ON buy_requests FOR DELETE
  USING (owner_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sell_listings_updated_at
  BEFORE UPDATE ON sell_listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_buy_requests_updated_at
  BEFORE UPDATE ON buy_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## 3. Folder Structure

```
frc-bazaar/
├── public/
│   ├── images/
│   │   └── logo.svg
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── sign-in/[[...sign-in]]/
│   │   │   │   └── page.tsx
│   │   │   └── sign-up/[[...sign-up]]/
│   │   │       └── page.tsx
│   │   ├── (main)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                    # Home
│   │   │   ├── bazaar/
│   │   │   │   └── page.tsx                # Combined feed
│   │   │   ├── listing/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx            # Listing detail
│   │   │   ├── sell/
│   │   │   │   └── new/
│   │   │   │       └── page.tsx            # Create sell listing
│   │   │   ├── buy/
│   │   │   │   └── new/
│   │   │   │       └── page.tsx            # Create buy request
│   │   │   └── profile/
│   │   │       └── page.tsx                # User profile
│   │   ├── api/
│   │   │   ├── webhooks/
│   │   │   │   └── clerk/
│   │   │   │       └── route.ts            # Clerk webhook handler
│   │   │   └── listings/
│   │   │       └── route.ts                # API routes
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── badge.tsx
│   │   │   └── skeleton.tsx
│   │   ├── layout/
│   │   │   ├── navbar.tsx
│   │   │   ├── footer.tsx
│   │   │   └── mobile-nav.tsx
│   │   ├── listings/
│   │   │   ├── listing-card.tsx
│   │   │   ├── listing-grid.tsx
│   │   │   ├── listing-filters.tsx
│   │   │   ├── sell-form.tsx
│   │   │   └── buy-form.tsx
│   │   └── home/
│   │       ├── hero.tsx
│   │       ├── features.tsx
│   │       └── about-team.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts                   # Browser client
│   │   │   ├── server.ts                   # Server client
│   │   │   └── admin.ts                    # Service role client
│   │   ├── actions/
│   │   │   ├── listings.ts                 # Server actions
│   │   │   └── profile.ts
│   │   └── utils.ts
│   └── types/
│       ├── database.ts                     # Supabase types
│       └── listings.ts
├── middleware.ts                            # Clerk middleware
├── .env.local.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 4. Page Specifications

### Home Page (/)
- Hero section with CTA buttons
- Platform explanation (3-4 feature cards)
- "About our team" section
- Call-to-action for registration

### Bazaar Page (/bazaar)
- Search bar (title search)
- Filter sidebar/dropdown:
  - Type: All / Sell / Buy
  - Category: All categories enum
  - Condition: All / New / Used / Repaired
  - Price range: Min/Max sliders
- Listing grid (responsive: 1-3 columns)
- Pagination (20 items per page)
- Sort options: Newest / Price Low-High / Price High-Low

### Create Sell Listing (/sell/new) - Protected
- Multi-step form or single page with sections
- Image upload (drag & drop, 1-5 images)
- Category/condition dropdowns
- Price input with currency
- Location autocomplete (optional)
- Contact selection (Telegram/Phone)
- Preview before submit

### Create Buy Request (/buy/new) - Protected
- Simplified form
- Item description
- Budget input
- Location
- Contact info

### Listing Detail (/listing/[id])
- Image gallery (carousel)
- Full description
- Seller info with contact
- Edit/Delete buttons (owner only)
- Related listings (same category)

### User Profile (/profile) - Protected
- User info display
- Tab view: My Sell Listings / My Buy Requests
- Edit/Delete actions for each listing

---

## 5. Security Implementation

### Row Level Security (RLS)
- Public read access for all listings
- Write/update/delete restricted to owner
- Clerk JWT token passed to Supabase for authentication

### Image Upload Security
- File type validation (PNG, JPG, WebP only)
- Max file size: 5MB per image
- Unique filename generation (UUID)
- Supabase Storage policies

### Rate Limiting
- API routes: 100 requests/minute per IP
- Image uploads: 20/minute per user
- Implement via Vercel Edge middleware

### Input Sanitization
- Server-side validation with Zod
- HTML sanitization for descriptions
- SQL injection protection via Supabase client

---

## 6. Performance Optimization

### Database
- Indexed columns for filtering/sorting
- Full-text search index on titles
- Pagination with cursor-based approach

### Images
- Supabase image transformations (resize on delivery)
- Lazy loading for listing grids
- WebP format conversion
- Responsive images with srcset

### Frontend
- Server Components by default
- Dynamic imports for heavy components
- Image optimization via next/image
- Skeleton loaders for async content

### Caching
- Static generation for home page
- ISR for listing pages (revalidate: 60)
- Client-side caching with SWR

---

## 7. Deployment Guide

### Prerequisites
1. Create Clerk account and project
2. Create Supabase project
3. Create Vercel account

### Environment Variables
```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_***
CLERK_SECRET_KEY=sk_***
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/bazaar
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/bazaar
CLERK_WEBHOOK_SECRET=whsec_***

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://***.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ***
SUPABASE_SERVICE_ROLE_KEY=eyJ***
```

### Deployment Steps
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy
5. Set up Clerk webhook endpoint in Clerk dashboard
6. Configure Supabase storage bucket and policies

---

## 8. Cost Analysis (Free Tier)

| Service | Free Tier Limits | Expected Usage |
|---------|------------------|----------------|
| **Vercel** | 100GB bandwidth, serverless | ✅ Sufficient |
| **Clerk** | 10,000 MAU | ✅ Sufficient for 50-100 users |
| **Supabase** | 500MB DB, 1GB storage, 50K requests/month | ✅ Sufficient |

**Total Monthly Cost: $0** (within free tier limits)

---

## 9. Scaling Considerations

When exceeding free tiers:
- **Clerk**: $0.02/MAU after 10K ($25/month for Pro features)
- **Supabase**: $25/month Pro tier (8GB DB, 100GB storage)
- **Vercel**: $20/month Pro tier (1TB bandwidth)

The architecture supports horizontal scaling without code changes.
