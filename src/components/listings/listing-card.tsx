import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  formatPrice, 
  formatRelativeDate, 
  truncate,
  CATEGORY_CONFIG,
  CONDITION_CONFIG 
} from '@/lib/utils';
import type { SellListing, BuyRequest } from '@/types/database';

interface SellListingCardProps {
  listing: SellListing;
}

export function SellListingCard({ listing }: SellListingCardProps) {
  const categoryConfig = CATEGORY_CONFIG[listing.category];
  const conditionConfig = CONDITION_CONFIG[listing.condition];

  return (
    <Link href={`/listing/${listing.id}`}>
      <Card hoverable className="h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-background-elevated">
          {listing.images[0] ? (
            <Image
              src={listing.images[0]}
              alt={listing.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-foreground-subtle">
              <span className="text-4xl">{categoryConfig.icon}</span>
            </div>
          )}
          
          {/* Badges overlay */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <Badge variant="primary" className="backdrop-blur-sm bg-primary-500/80">
              {categoryConfig.icon} {categoryConfig.label}
            </Badge>
          </div>
          
          {/* Condition badge */}
          <div className="absolute top-3 right-3">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border backdrop-blur-sm ${conditionConfig.color}`}>
              {conditionConfig.label}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col">
          <h3 className="font-semibold text-foreground line-clamp-2 mb-2">
            {listing.title}
          </h3>
          
          <p className="text-sm text-foreground-muted line-clamp-2 mb-3 flex-1">
            {truncate(listing.description, 100)}
          </p>

          {/* Meta info */}
          <div className="flex items-center gap-3 text-xs text-foreground-subtle mb-3">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {listing.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatRelativeDate(listing.created_at)}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <span className="text-lg font-bold text-primary-400">
              {formatPrice(listing.price)}
            </span>
            <Badge variant="secondary" className="text-xs">
              FOR SALE
            </Badge>
          </div>
        </div>
      </Card>
    </Link>
  );
}

interface BuyRequestCardProps {
  request: BuyRequest;
}

export function BuyRequestCard({ request }: BuyRequestCardProps) {
  return (
    <Link href={`/buy/${request.id}`}>
      <Card hoverable className="h-full flex flex-col">
        {/* Header area (no image for buy requests) */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-primary-500/10 to-primary-500/5 flex items-center justify-center">
          <div className="text-center px-4">
            <span className="text-5xl mb-2 block">🔍</span>
            <Badge variant="warning" className="backdrop-blur-sm">
              WANTED
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col">
          <h3 className="font-semibold text-foreground line-clamp-2 mb-2">
            Looking for: {request.item_needed}
          </h3>

          {/* Meta info */}
          <div className="flex items-center gap-3 text-xs text-foreground-subtle mb-3 flex-1">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {request.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatRelativeDate(request.created_at)}
            </span>
          </div>

          {/* Budget */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <span className="text-sm text-foreground-muted">
              Budget up to:
            </span>
            <span className="text-lg font-bold text-yellow-400">
              {formatPrice(request.max_budget)}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
