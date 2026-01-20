# Technical Task: FRC Bazaar Bug Fixes & Design Improvements

## Project Overview
FRC Bazaar - marketplace for FIRST Robotics teams to buy/sell robot parts.
Tech Stack: Next.js 14, TypeScript, Tailwind CSS, Clerk Auth, Supabase

---

## 🐛 BUG FIXES (Priority: High)

### Bug #1: Edit Listing Returns 404
**Current Behavior:** 
- User creates a listing → clicks "Edit" → gets 404 error

**Root Cause:**
- Missing edit page at `/listing/[id]/edit`

**Solution:**
Create file: `src/app/(main)/listing/[id]/edit/page.tsx`
```tsx
// Fetch listing by ID
// Check if current user is owner
// Render SellForm with pre-filled data
// On submit: call updateSellListing() action
```

**Files to modify:**
- Create: `src/app/(main)/listing/[id]/edit/page.tsx`
- Update: `src/components/listings/sell-form.tsx` - add `initialData` prop for edit mode

---

### Bug #2: Delete Listing Stays on 404 Page
**Current Behavior:**
- User deletes listing → page stays on `/listing/[id]` → shows 404

**Root Cause:**
- No redirect after successful deletion

**Solution:**
Modify `src/app/(main)/listing/[id]/page.tsx`:
```tsx
// Change delete form action to:
import { redirect } from 'next/navigation';

async function handleDelete() {
  'use server';
  const result = await deleteSellListing(id);
  if (result.success) {
    redirect('/profile'); // or '/bazaar'
  }
}
```

**Alternative:** Use client-side deletion with `useRouter`:
```tsx
const router = useRouter();
const handleDelete = async () => {
  await deleteSellListing(id);
  router.push('/profile');
};
```

---

### Bug #3: Buy Request Detail Returns 404
**Current Behavior:**
- User creates buy request → clicks to view → 404 at `/buy/[id]`

**Root Cause:**
- Missing buy request detail page

**Solution:**
Create file: `src/app/(main)/buy/[id]/page.tsx`
```tsx
// Similar to listing/[id]/page.tsx but for buy requests
// Fetch buy request by ID using getBuyRequestById()
// Display: item_needed, max_budget, location, contact info
// Show edit/delete buttons if owner
```

**Files to create:**
- `src/app/(main)/buy/[id]/page.tsx`
- Optional: `src/app/(main)/buy/[id]/edit/page.tsx`

---

### Bug #4: Filters Not Working
**Current Behavior:**
- Selecting category/condition/price filters doesn't filter results

**Root Cause:**
Likely issues in `src/app/(main)/bazaar/page.tsx` or `src/lib/actions/listings.ts`:
1. Search params not being passed correctly
2. Filter values not applied to Supabase query
3. Type mismatch ('all' string vs actual enum values)

**Solution:**

1. Debug `src/app/(main)/bazaar/page.tsx`:
```tsx
// Add console.log to check params
console.log('Filters:', params);
```

2. Fix `src/lib/actions/listings.ts` - `getSellListings()`:
```tsx
export async function getSellListings(filters: BazaarFilters = {}, page: number = 1) {
  const supabase = await createServerSupabaseClient();
  
  let query = supabase
    .from('sell_listings')
    .select('*, owner:profiles(*)', { count: 'exact' });

  // FIX: Check for valid enum values, not just truthy
  if (filters.category && filters.category !== 'all') {
    query = query.eq('category', filters.category);
  }
  
  if (filters.condition && filters.condition !== 'all') {
    query = query.eq('condition', filters.condition);
  }
  
  // FIX: Handle price filters properly
  if (filters.minPrice !== undefined && filters.minPrice > 0) {
    query = query.gte('price', filters.minPrice);
  }
  
  if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
    query = query.lte('price', filters.maxPrice);
  }
  
  // FIX: Use ilike for case-insensitive search
  if (filters.search && filters.search.trim() !== '') {
    query = query.ilike('title', `%${filters.search.trim()}%`);
  }

  // ... rest of function
}
```

3. Fix `src/components/listings/listing-filters.tsx`:
```tsx
// Ensure URL params are being set correctly
const updateFilters = useCallback((updates: Record<string, string>) => {
  const params = new URLSearchParams(searchParams.toString());
  
  Object.entries(updates).forEach(([key, value]) => {
    if (value && value !== 'all' && value !== '') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
  });
  
  params.delete('page'); // Reset pagination
  
  // FIX: Use router.replace for smoother UX
  startTransition(() => {
    router.replace(`/bazaar?${params.toString()}`);
  });
}, [router, searchParams]);
```

---

## 🎨 DESIGN IMPROVEMENTS (Priority: Medium)

### Task #5: Update Typography - Modern Minimalist Fonts

**Current:** System fonts / default

**Recommended Font Pairing:**
- **Headlines:** `Space Grotesk` or `Outfit` or `Manrope`
- **Body:** `Inter` or `DM Sans`

**Implementation:**

1. Update `src/app/layout.tsx`:
```tsx
import { Space_Grotesk, Inter } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

// In body tag:
<body className={`${spaceGrotesk.variable} ${inter.variable} font-body ...`}>
```

2. Update `tailwind.config.ts`:
```ts
fontFamily: {
  heading: ['var(--font-heading)', 'sans-serif'],
  body: ['var(--font-body)', 'sans-serif'],
},
```

3. Apply to components:
```tsx
<h1 className="font-heading text-4xl font-bold">...</h1>
<p className="font-body text-base">...</p>
```

---

### Task #6: Integrate Custom SVG Logos

**Location:** `/public/` folder

**Implementation:**

1. Check what SVGs exist:
```
/public/
  logo.svg
  logo-icon.svg
  etc.
```

2. Update `src/components/layout/navbar.tsx`:
```tsx
import Image from 'next/image';

// Replace the current logo div with:
<Link href="/" className="flex items-center gap-2">
  <Image 
    src="/logo.svg" 
    alt="FRC Bazaar" 
    width={40} 
    height={40}
    className="h-10 w-auto"
  />
  <span className="text-xl font-heading font-bold">Bazaar</span>
</Link>
```

3. Update `src/components/layout/footer.tsx` - same approach

4. Update auth pages `src/app/(auth)/sign-in/[[...sign-in]]/page.tsx`

---

## 📁 FILES TO CREATE/MODIFY

### New Files:
```
src/app/(main)/listing/[id]/edit/page.tsx    # Edit sell listing
src/app/(main)/buy/[id]/page.tsx             # Buy request detail
src/app/(main)/buy/[id]/edit/page.tsx        # Edit buy request (optional)
```

### Files to Modify:
```
src/app/(main)/listing/[id]/page.tsx         # Fix delete redirect
src/app/(main)/bazaar/page.tsx               # Debug filter passing
src/lib/actions/listings.ts                  # Fix filter logic
src/components/listings/listing-filters.tsx  # Fix URL param handling
src/components/listings/sell-form.tsx        # Add edit mode support
src/app/layout.tsx                           # Add custom fonts
src/components/layout/navbar.tsx             # Add SVG logo
src/components/layout/footer.tsx             # Add SVG logo
tailwind.config.ts                           # Add font families
```

---

## 🧪 TESTING CHECKLIST

After fixes, verify:

- [ ] Create sell listing → Edit → saves changes
- [ ] Create sell listing → Delete → redirects to /profile or /bazaar
- [ ] Create buy request → Click to view → shows detail page
- [ ] Create buy request → Delete → redirects correctly
- [ ] Filter by category → shows only that category
- [ ] Filter by condition → shows only that condition
- [ ] Filter by price range → shows only items in range
- [ ] Search by title → shows matching items
- [ ] Combine multiple filters → works correctly
- [ ] Clear filters → shows all items
- [ ] New fonts display correctly
- [ ] SVG logos appear in navbar and footer

---

## 📝 NOTES

1. **Supabase RLS:** Ensure Row Level Security policies allow the operations
2. **Clerk Auth:** All protected actions should verify `userId` before executing
3. **Error Handling:** Show user-friendly toast messages on errors
4. **Loading States:** Show skeleton/spinner while data loads
5. **Mobile:** Test all changes on mobile viewport

---

## 🚀 DEPLOYMENT NOTES

After fixes, deploy to Vercel and:
1. Set up Clerk webhook for user sync
2. Test all functionality in production
3. Monitor Supabase logs for any query errors
