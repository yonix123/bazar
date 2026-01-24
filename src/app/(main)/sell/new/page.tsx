import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { SellForm } from '@/components/listings/sell-form';

export default async function SellPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in?redirect_url=/sell/new');
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Create Sell Listing</h1>
        <p className="text-foreground-muted mt-2">
          List your robot parts for other FTC teams to purchase
        </p>
      </div>

      <SellForm />
    </div>
  );
}
