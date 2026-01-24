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
    Trash2,
    Share2,
    DollarSign
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getBuyRequestById, deleteBuyRequest } from '@/lib/actions/listings';
import {
    formatPrice,
    formatRelativeDate,
    CONTACT_CONFIG
} from '@/lib/utils';

interface BuyRequestPageProps {
    params: Promise<{ id: string }>;
}

export default async function BuyRequestPage({ params }: BuyRequestPageProps) {
    const { id } = await params;
    const { userId } = await auth();

    const { data: request, error } = await getBuyRequestById(id);

    if (error || !request) {
        notFound();
    }

    const contactConfig = CONTACT_CONFIG[request.contact_type];
    const isOwner = userId === request.owner_id;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back button */}
            <Link
                href="/bazaar"
                className="inline-flex items-center gap-2 text-foreground-muted hover:text-foreground mb-6 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Bazaar
            </Link>

            <div className="grid gap-8">
                <Card>
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row gap-8 justify-between">
                            <div className="space-y-4 flex-1">
                                <div className="space-y-2">
                                    <Badge variant="secondary" className="bg-primary-500/10 text-primary-400 border-primary-500/20">
                                        Buy Request
                                    </Badge>
                                    <h1 className="text-3xl font-bold text-foreground">
                                        {request.item_needed}
                                    </h1>
                                </div>

                                <div className="flex flex-wrap gap-4 text-sm text-foreground-muted">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        {request.location}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        Posted {formatRelativeDate(request.created_at)}
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <p className="text-sm font-medium text-foreground-muted mb-1">Max Budget</p>
                                    <div className="text-4xl font-bold text-primary-400">
                                        {formatPrice(request.max_budget)}
                                    </div>
                                </div>
                            </div>

                            {/* Action Sidebar Area */}
                            <div className="w-full md:w-80 space-y-4">
                                <div className="p-4 rounded-xl bg-background-elevated border border-border space-y-4">
                                    <h3 className="font-semibold text-foreground">Contact Buyer</h3>

                                    {/* Seller info */}
                                    {request.owner && (
                                        <div className="flex items-center gap-3 pb-4 border-b border-border">
                                            {request.owner.avatar_url ? (
                                                <Image
                                                    src={request.owner.avatar_url}
                                                    alt={request.owner.display_name || 'Buyer'}
                                                    width={40}
                                                    height={40}
                                                    className="rounded-full"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center">
                                                    <span className="text-primary-400 font-semibold">
                                                        {(request.owner.display_name || request.owner.email)[0].toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium text-foreground text-sm">
                                                    {request.owner.display_name || 'Anonymous Buyer'}
                                                </p>
                                                {request.owner.team_number && (
                                                    <p className="text-xs text-foreground-muted">
                                                        Team #{request.owner.team_number}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <a
                                        href={
                                            request.contact_type === 'telegram'
                                                ? `https://t.me/${request.contact_value.replace('@', '')}`
                                                : `tel:${request.contact_value}`
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block"
                                    >
                                        <Button variant="primary" className="w-full gap-2">
                                            {request.contact_type === 'telegram' ? (
                                                <MessageCircle className="h-4 w-4" />
                                            ) : (
                                                <Phone className="h-4 w-4" />
                                            )}
                                            Contact via {contactConfig.label}
                                        </Button>
                                    </a>
                                    <p className="text-xs text-foreground-subtle text-center">
                                        {contactConfig.prefix}{request.contact_value}
                                    </p>
                                </div>

                                <Button variant="ghost" className="w-full gap-2">
                                    <Share2 className="h-4 w-4" />
                                    Share Request
                                </Button>

                                {isOwner && (
                                    <form action={async () => {
                                        'use server';
                                        const result = await deleteBuyRequest(id);
                                        if (result.success) {
                                            redirect('/bazaar');
                                        }
                                    }}>
                                        <Button type="submit" variant="danger" className="w-full gap-2">
                                            <Trash2 className="h-4 w-4" />
                                            Delete Request
                                        </Button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
