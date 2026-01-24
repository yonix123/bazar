import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { CurrencyProvider } from '@/context/currency-context';
import type { Metadata } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'sonner';
import '../globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  // ... existing metadata ...
};

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <ClerkProvider
      appearance={{
        // ... existing appearance ...
      }}
    >
      <html lang={locale} className="dark" suppressHydrationWarning>
        <body className={`${spaceGrotesk.variable} ${inter.variable} font-body bg-background text-foreground antialiased`}>
          <NextIntlClientProvider messages={messages}>
            <CurrencyProvider>
              {children}
              <Toaster
                position="bottom-right"
                theme="dark"
                toastOptions={{
                  style: {
                    background: '#1a1a1a',
                    border: '1px solid #262626',
                    color: '#fafafa',
                  },
                }}
              />
            </CurrencyProvider>
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
