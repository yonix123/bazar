export const dynamic = 'force-dynamic';
import { Suspense } from 'react';
import Link from 'next/link';
import { Plus, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { ListingFilters } from '@/components/listings/listing-filters';
import { SellListingCard, BuyRequestCard } from '@/components/listings/listing-card';
import { SkeletonListingGrid } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { getSellListings, getBuyRequests } from '@/lib/actions/listings';
import type { BazaarFilters } from '@/types/database';

interface BazaarPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function ListingsGrid({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const type = searchParams.type || 'all';
  const page = parseInt(searchParams.page || '1');

  const filters: BazaarFilters = {
    type: type as 'all' | 'sell' | 'buy',
    category: searchParams.category as BazaarFilters['category'],
    condition: searchParams.condition as BazaarFilters['condition'],
    minPrice: searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined,
    search: searchParams.search,
    sort: searchParams.sort as BazaarFilters['sort'],
  };

  // Fetch data based on type
  const showSell = type === 'all' || type === 'sell';
  const showBuy = type === 'all' || type === 'buy';

  const [sellResult, buyResult] = await Promise.all([
    showSell ? getSellListings(filters, page) : { data: [], count: 0, totalPages: 0 },
    showBuy && type !== 'sell' ? getBuyRequests(page) : { data: [], count: 0, totalPages: 0 },
  ]);

  const totalItems = (showSell ? sellResult.count : 0) + (showBuy ? buyResult.count : 0);
  const maxPages = Math.max(sellResult.totalPages || 0, buyResult.totalPages || 0);

  // Empty state
  if (sellResult.data.length === 0 && buyResult.data.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">No listings found</h3>
        <p className="text-foreground-muted mb-6">
          Try adjusting your filters or be the first to create a listing!
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/sell/new">
            <Button variant="primary" className="gap-2">
              <Plus className="h-4 w-4" />
              Sell Something
            </Button>
          </Link>
          <Link href="/buy/new">
            <Button variant="secondary" className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              Post Buy Request
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Build URL for pagination
  const buildPageUrl = (pageNum: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && key !== 'page') {
        params.set(key, value);
      }
    });
    params.set('page', pageNum.toString());
    return `/bazaar?${params.toString()}`;
  };

  return (
    <div className="space-y-8">
      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-foreground-muted">
          Showing {totalItems} {totalItems === 1 ? 'result' : 'results'}
        </p>
      </div>

      {/* Listings grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sell listings */}
        {sellResult.data.map((listing) => (
          <SellListingCard key={`sell-${listing.id}`} listing={listing} />
        ))}

        {/* Buy requests */}
        {buyResult.data.map((request) => (
          <BuyRequestCard key={`buy-${request.id}`} request={request} />
        ))}
      </div>

      {/* Pagination */}
      {maxPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {page > 1 && (
            <Link href={buildPageUrl(page - 1)}>
              <Button variant="secondary" size="sm" className="gap-1">
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
            </Link>
          )}

          <span className="px-4 py-2 text-sm text-foreground-muted">
            Page {page} of {maxPages}
          </span>

          {page < maxPages && (
            <Link href={buildPageUrl(page + 1)}>
              <Button variant="secondary" size="sm" className="gap-1">
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default async function BazaarPage({ searchParams }: BazaarPageProps) {
  const resolvedParams = await searchParams;
  const params: Record<string, string | undefined> = {};
  Object.entries(resolvedParams).forEach(([key, value]) => {
    params[key] = Array.isArray(value) ? value[0] : value;
  });
  console.log('BazaarPage params:', params);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bazaar</h1>
          <p className="text-foreground-muted mt-1">
            Find parts to buy or see what teams are looking for
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/sell/new">
            <Button variant="primary" className="gap-2">
              <Plus className="h-4 w-4" />
              Sell
            </Button>
          </Link>
          <Link href="/buy/new">
            <Button variant="secondary" className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              Buy
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <Suspense fallback={<div className="h-12 bg-background-elevated rounded-lg animate-pulse" />}>
          <ListingFilters />
        </Suspense>
      </div>

      {/* Listings */}
      <Suspense fallback={<SkeletonListingGrid count={6} />}>
        <ListingsGrid searchParams={params} />
      </Suspense>
    </div>
  );
}
