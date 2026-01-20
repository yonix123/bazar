import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { BuyForm } from '@/components/listings/buy-form';

export default async function BuyPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in?redirect_url=/buy/new');
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Create Buy Request</h1>
        <p className="text-foreground-muted mt-2">
          Let other teams know what parts you're looking for
        </p>
      </div>

      <BuyForm />
    </div>
  );
}
