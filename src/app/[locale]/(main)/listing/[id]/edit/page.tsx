import { notFound, redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { getListingById } from '@/lib/actions/listings';
import { SellForm } from '@/components/listings/sell-form';

interface EditListingPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditListingPage({ params }: EditListingPageProps) {
    const { id } = await params;
    const { userId } = await auth();

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
                <h1 className="text-3xl font-bold text-foreground">Edit Listing</h1>
                <p className="text-foreground-muted mt-2">
                    Update the details of your listing below.
                </p>
            </div>

            <SellForm initialData={listing} isEditMode={true} />
        </div>
    );
}
