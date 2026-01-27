import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import {
  MapPin,
  Clock,
  MessageCircle,
  Phone,
  ArrowLeft,
  Edit,
  Trash2,
  Share2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getListingById, deleteSellListing } from '@/lib/actions/listings';
import {
  formatPrice,
  formatRelativeDate,
  CONDITION_CONFIG,
  CONTACT_CONFIG
} from '@/lib/utils';

interface ListingPageProps {
  params: Promise<{ id: string }>;
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { id } = await params;
  const { userId } = await auth();

  const { data: listing, error } = await getListingById(id);

  if (error || !listing) {
    notFound();
  }

  const conditionConfig = CONDITION_CONFIG[listing.condition];
  const contactConfig = CONTACT_CONFIG[listing.contact_type];
  const isOwner = userId === listing.owner_id;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <Link
        href="/bazaar"
        className="inline-flex items-center gap-2 text-foreground-muted hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Bazaar
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image gallery */}
          <Card>
            <CardContent className="p-0">
              <div className="relative aspect-video">
                {listing.images[0] ? (
                  <Image
                    src={listing.images[0]}
                    alt={listing.title}
                    fill
                    className="object-cover rounded-t-xl"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-background-elevated text-foreground-subtle">
                    <div className="w-20 h-20 bg-primary-500/20 rounded-full flex items-center justify-center">
                      <div className="w-10 h-10 border-2 border-primary-500 rounded-sm" />
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnail strip */}
              {listing.images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {listing.images.map((image, index) => (
                    <div
                      key={image}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 ${index === 0 ? 'border-primary-500' : 'border-transparent'
                        }`}
                    >
                      <Image
                        src={image}
                        alt={`${listing.title} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Description</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-foreground-muted whitespace-pre-wrap">
                  {listing.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Main info card */}
          <Card>
            <CardContent className="p-6 space-y-4">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${conditionConfig.color}`}>
                  {conditionConfig.label}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-foreground">
                {listing.title}
              </h1>

              {/* Price */}
              <div className="text-3xl font-bold text-primary-400">
                {formatPrice(listing.price)}
              </div>

              {/* Meta info */}
              <div className="space-y-2 text-sm text-foreground-muted">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {listing.location}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Posted {formatRelativeDate(listing.created_at)}
                </div>
              </div>

              {/* Contact button */}
              <div className="pt-4 border-t border-border">
                <a
                  href={
                    listing.contact_type === 'telegram'
                      ? `https://t.me/${listing.contact_value.replace('@', '')}`
                      : `tel:${listing.contact_value}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button variant="primary" className="w-full gap-2">
                    {listing.contact_type === 'telegram' ? (
                      <MessageCircle className="h-4 w-4" />
                    ) : (
                      <Phone className="h-4 w-4" />
                    )}
                    Contact via {contactConfig.label}
                  </Button>
                </a>
                <p className="text-xs text-foreground-subtle text-center mt-2">
                  {contactConfig.prefix}{listing.contact_value}
                </p>
              </div>

              {/* Share button */}
              <Button variant="ghost" className="w-full gap-2">
                <Share2 className="h-4 w-4" />
                Share Listing
              </Button>
            </CardContent>
          </Card>

          {/* Seller info */}
          {listing.owner && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-sm font-medium text-foreground-muted mb-4">Seller</h3>
                <div className="flex items-center gap-3">
                  {listing.owner.avatar_url ? (
                    <Image
                      src={listing.owner.avatar_url}
                      alt={listing.owner.display_name || 'Seller'}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary-500/10 flex items-center justify-center">
                      <span className="text-primary-400 font-semibold">
                        {(listing.owner.display_name || listing.owner.email)[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-foreground">
                      {listing.owner.display_name || 'Anonymous Seller'}
                    </p>
                    {listing.owner.team_number && (
                      <p className="text-sm text-foreground-muted">
                        Team #{listing.owner.team_number}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Owner actions */}
          {isOwner && (
            <Card>
              <CardContent className="p-6 space-y-3">
                <h3 className="text-sm font-medium text-foreground-muted mb-2">Manage Listing</h3>
                <Link href={`/listing/${listing.id}/edit`}>
                  <Button variant="secondary" className="w-full gap-2">
                    <Edit className="h-4 w-4" />
                    Edit Listing
                  </Button>
                </Link>
                <form action={async () => {
                  'use server';
                  const result = await deleteSellListing(id);
                  if (result.success) {
                    redirect('/bazaar');
                  }
                }}>
                  <Button type="submit" variant="danger" className="w-full gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete Listing
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
