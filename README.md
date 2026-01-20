# FRC Bazaar

A marketplace for FIRST Robotics teams to buy, sell, and exchange robot parts.

![FRC Bazaar](https://img.shields.io/badge/FRC-Bazaar-red?style=for-the-badge)

## Features

- 🛒 **Buy & Sell** - List parts for sale or post what you need
- 🔍 **Search & Filter** - Find parts by category, condition, price
- 🔐 **Secure Auth** - Google OAuth and email/password via Clerk
- 📱 **Responsive** - Works on desktop and mobile
- 🌙 **Dark Mode** - Modern dark theme with red accents
- 🆓 **100% Free** - No fees, no premium tiers

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Authentication**: Clerk
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Clerk account
- Supabase account

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/frc-bazaar.git
cd frc-bazaar
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Clerk

1. Create a new application at [clerk.com](https://clerk.com)
2. Enable Google OAuth provider
3. Copy your API keys to `.env.local`
4. Set up webhook endpoint for user sync:
   - URL: `https://your-domain.com/api/webhooks/clerk`
   - Events: `user.created`, `user.updated`, `user.deleted`

### 4. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `docs/IMPLEMENTATION_PLAN.md`
3. Create a storage bucket named `listing-images` with public access
4. Copy your API keys to `.env.local`

### 5. Configure environment variables

```bash
cp .env.local.example .env.local
# Edit .env.local with your actual keys
```

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Database Schema

See `docs/IMPLEMENTATION_PLAN.md` for the complete SQL schema.

### Tables

- `profiles` - User profiles synced from Clerk
- `sell_listings` - Items for sale
- `buy_requests` - Items wanted

### Row Level Security

- Public read access for all listings
- Users can only create/edit/delete their own listings

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables
4. Deploy!

The project is configured for optimal Vercel deployment with:
- Edge runtime for middleware
- Serverless functions for API routes
- Image optimization
- Preview deployments

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages
│   ├── (main)/            # Main pages
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   ├── listings/         # Listing-related components
│   └── home/             # Home page components
├── lib/                   # Utilities and actions
│   ├── supabase/         # Supabase clients
│   └── actions/          # Server actions
└── types/                # TypeScript types
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details.

---

Built with ❤️ for the FRC community
