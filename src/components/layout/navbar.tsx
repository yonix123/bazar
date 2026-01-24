'use client';

import Link from 'next/link';
import Image from 'next/image';

// ...

<Link href="/" className="flex items-center gap-2">
  <Image
    src=""
    alt="FTC Bazaar"
    width={40}
    height={40}
    className="w-10 h-10 object-contain"
    priority
  />
  <span className="text-xl font-bold font-heading text-foreground hidden sm:block">
    Bazaar
  </span>
</Link>
import { usePathname } from 'next/navigation';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Menu, X, Plus, ShoppingBag, User } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'FTC Bazaar', href: '/bazaar' },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            {/* <div className="relative">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-foreground hidden sm:block">
                  FTC
                </span>
              </div>
              <div className="absolute inset-0 bg-primary-500/30 rounded-lg blur-lg -z-10" />
            </div> */}
            <img src="https://boltm3.image.firstinspireskz.org/a.svg" alt="FTC" className="w-7 h-7 object-contain" />
            <span className="text-xl font-bold text-foreground hidden sm:block">
              Bazaar
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'text-primary-400 bg-primary-500/10'
                    : 'text-foreground-muted hover:text-foreground hover:bg-background-elevated'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <SignedOut>
              <Link href="/sign-in">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center gap-2">
                <Link href="/sell/new">
                  <Button variant="primary" size="sm" className="gap-1">
                    <Plus className="h-4 w-4" />
                    Sell
                  </Button>
                </Link>
                <Link href="/buy/new">
                  <Button variant="secondary" size="sm" className="gap-1">
                    <ShoppingBag className="h-4 w-4" />
                    Buy
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

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-elevated"
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
            {navigation.map((item) => (
              <Link
                key={item.name}
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
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </SignedOut>

              <SignedIn>
                <Link href="/sell/new" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full gap-2">
                    <Plus className="h-4 w-4" />
                    Create Sell Listing
                  </Button>
                </Link>
                <Link href="/buy/new" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" className="w-full gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    Create Buy Request
                  </Button>
                </Link>
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full gap-2">
                    <User className="h-4 w-4" />
                    Profile
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
