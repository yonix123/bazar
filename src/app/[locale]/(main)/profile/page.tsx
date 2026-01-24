import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, ShoppingBag, Edit, Trash2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getUserListings, deleteSellListing, deleteBuyRequest } from '@/lib/actions/listings';
import { getCurrentProfile } from '@/lib/actions/profile';
import { formatPrice, formatRelativeDate, CATEGORY_CONFIG, CONDITION_CONFIG } from '@/lib/utils';

export default async function ProfilePage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect('/sign-in?redirect_url=/profile');
  }

  const [{ sellListings, buyRequests }, { data: profile }] = await Promise.all([
    getUserListings(),
    getCurrentProfile(),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile header */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            {user.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt={user.firstName || 'Profile'}
                width={80}
                height={80}
                className="rounded-full"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary-500/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-400">
                  {(user.firstName || user.emailAddresses[0].emailAddress)[0].toUpperCase()}
                </span>
              </div>
            )}

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-foreground-muted">
                {user.emailAddresses[0].emailAddress}
              </p>
              {profile?.team_number && (
                <Badge variant="primary" className="mt-2">
                  Team #{profile.team_number}
                </Badge>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 w-full sm:w-auto">
              <Link href="/sell/new" className="flex-1 sm:flex-initial">
                <Button variant="primary" className="w-full gap-2">
                  <Plus className="h-4 w-4" />
                  Sell
                </Button>
              </Link>
              <Link href="/buy/new" className="flex-1 sm:flex-initial">
                <Button variant="secondary" className="w-full gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Buy
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Listings sections */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Sell listings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">My Sell Listings</CardTitle>
            <Badge variant="secondary">{sellListings.length}</Badge>
          </CardHeader>
          <CardContent>
            {sellListings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-foreground-muted mb-4">
                  You haven't listed any items yet
                </p>
                <Link href="/sell/new">
                  <Button variant="secondary" size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Listing
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {sellListings.map((listing) => {
                  const categoryConfig = CATEGORY_CONFIG[listing.category];
                  const conditionConfig = CONDITION_CONFIG[listing.condition];

                  return (
                    <div
                      key={listing.id}
                      className="flex items-start gap-4 p-4 rounded-lg bg-background-elevated border border-border hover:border-border-accent transition-colors"
                    >
                      {/* Thumbnail */}
                      <div className="w-16 h-16 rounded-lg bg-background-card shrink-0 overflow-hidden">
                        {listing.images[0] ? (
                          <Image
                            src={listing.images[0]}
                            alt={listing.title}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-primary-300 bg-primary-500/10">
                            <div className="w-6 h-6 border-2 border-primary-500 rounded-sm" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/listing/${listing.id}`}>
                          <h3 className="font-medium text-foreground truncate hover:text-primary-400 transition-colors">
                            {listing.title}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-semibold text-primary-400">
                            {formatPrice(listing.price)}
                          </span>
                          <span className={`text-xs px-1.5 py-0.5 rounded ${conditionConfig.color}`}>
                            {conditionConfig.label}
                          </span>
                        </div>
                        <p className="text-xs text-foreground-subtle mt-1">
                          {formatRelativeDate(listing.created_at)}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1">
                        <Link href={`/listing/${listing.id}/edit`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <form action={async () => {
                          'use server';
                          await deleteSellListing(listing.id);
                        }}>
                          <Button type="submit" variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400 hover:text-red-300">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Buy requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">My Buy Requests</CardTitle>
            <Badge variant="secondary">{buyRequests.length}</Badge>
          </CardHeader>
          <CardContent>
            {buyRequests.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-foreground-muted mb-4">
                  You haven't posted any buy requests yet
                </p>
                <Link href="/buy/new">
                  <Button variant="secondary" size="sm" className="gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    Post Request
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {buyRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-start gap-4 p-4 rounded-lg bg-background-elevated border border-border hover:border-border-accent transition-colors"
                  >
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-lg bg-yellow-500/10 shrink-0 flex items-center justify-center">
                      <span className="text-2xl">🔍</span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground">
                        {request.item_needed}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-foreground-muted">
                          Budget up to:
                        </span>
                        <span className="text-sm font-semibold text-yellow-400">
                          {formatPrice(request.max_budget)}
                        </span>
                      </div>
                      <p className="text-xs text-foreground-subtle mt-1">
                        {formatRelativeDate(request.created_at)}
                      </p>
                    </div>

                    {/* Actions */}
                    <form action={async () => {
                      'use server';
                      await deleteBuyRequest(request.id);
                    }}>
                      <Button type="submit" variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400 hover:text-red-300">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
