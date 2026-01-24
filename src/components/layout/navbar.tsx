'use client';

import { Link } from '@/i18n/routing';
import { usePathname } from '@/i18n/routing';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Menu, X, Plus, ShoppingBag, User } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from './language-switcher';
import { CurrencySwitcher } from './currency-switcher';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations('Navbar');

  const navigation = [
    { name: t('home'), href: '/' },
    { name: t('bazaar'), href: '/bazaar' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center h-16">
          {/* Logo (Far Left) */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <img src="https://boltm3.image.firstinspireskz.org/a.svg" alt="FTC" className="w-7 h-7 object-contain" />
              <span className="text-xl font-bold text-foreground hidden sm:block">
                Bazaar
              </span>
            </Link>
          </div>

          {/* Desktop Navigation (Absolute Center) */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary-500',
                  pathname === item.href
                    ? 'text-primary-500'
                    : 'text-foreground-muted'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions (Far Right) */}
          <div className="hidden md:flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-2">
              <CurrencySwitcher />
              <div className="h-4 w-px bg-border" /> {/* Separator */}
              <LanguageSwitcher />
            </div>

            <SignedOut>
              <div className="flex items-center gap-2">
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm">
                    {t('signIn')}
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button variant="primary" size="sm">
                    {t('getStarted')}
                  </Button>
                </Link>
              </div>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center gap-2">
                <Link href="/sell/new">
                  <Button variant="primary" size="sm" className="gap-1">
                    <Plus className="h-4 w-4" />
                    {t('sell')}
                  </Button>
                </Link>
                <Link href="/buy/new">
                  <Button variant="secondary" size="sm" className="gap-1">
                    <ShoppingBag className="h-4 w-4" />
                    {t('buy')}
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4" />
                  </Button>
                </Link>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: 'w-8 h-8',
                    },
                  }}
                />
              </div>
            </SignedIn>
          </div>

          {/* Mobile menu button (Far Right) */}
          <button
            className="md:hidden ml-auto p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-elevated"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background-secondary">
          <div className="px-4 py-4 space-y-2">
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <div className="flex gap-2">
                <CurrencySwitcher />
                <LanguageSwitcher />
              </div>
            </div>

            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'block px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'text-primary-400 bg-primary-500/10'
                    : 'text-foreground-muted hover:text-foreground hover:bg-background-elevated'
                )}
              >
                {item.name}
              </Link>
            ))}

            <div className="pt-4 border-t border-border space-y-2">
              <SignedOut>
                <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" className="w-full">
                    {t('signIn')}
                  </Button>
                </Link>
                <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full">
                    {t('getStarted')}
                  </Button>
                </Link>
              </SignedOut>

              <SignedIn>
                <Link href="/sell/new" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full gap-2">
                    <Plus className="h-4 w-4" />
                    {t('sell')}
                  </Button>
                </Link>
                <Link href="/buy/new" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" className="w-full gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    {t('buy')}
                  </Button>
                </Link>
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full gap-2">
                    <User className="h-4 w-4" />
                    {t('profile')}
                  </Button>
                </Link>
              </SignedIn>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
