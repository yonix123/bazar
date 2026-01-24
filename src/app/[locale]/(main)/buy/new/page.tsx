import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { BuyForm } from '@/components/listings/buy-form';
import { getTranslations } from 'next-intl/server';

export default async function BuyPage({ params: { locale } }: { params: { locale: string } }) {
  const { userId } = await auth();
  const t = await getTranslations({ locale, namespace: 'Forms.Buy' });

  if (!userId) {
    redirect('/sign-in?redirect_url=/buy/new');
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
        <p className="text-foreground-muted mt-2">
          {t('subtitle')}
        </p>
      </div>

      <BuyForm />
    </div>
  );
}
