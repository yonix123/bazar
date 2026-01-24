import { notFound, redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { getListingById } from '@/lib/actions/listings';
import { SellForm } from '@/components/listings/sell-form';
import { getTranslations } from 'next-intl/server';

interface EditListingPageProps {
    params: Promise<{ id: string; locale: string }>;
}

export default async function EditListingPage({ params }: EditListingPageProps) {
    const { id, locale } = await params;
    const { userId } = await auth();
    const t = await getTranslations({ locale, namespace: 'Forms.Sell' });

    const { data: listing, error } = await getListingById(id);

    if (error || !listing) {
        notFound();
    }

    // Check ownership
    if (userId !== listing.owner_id) {
        redirect(`/listing/${id}`);
    }

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">{t('editTitle')}</h1>
                <p className="text-foreground-muted mt-2">
                    {t('subtitle')}
                </p>
            </div>

            <SellForm initialData={listing} isEditMode={true} />
        </div>
    );
}
