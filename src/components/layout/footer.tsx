import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Github, Instagram } from 'lucide-react';

export function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="border-t border-border bg-background-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="https://boltm3.image.firstinspireskz.org/a.svg"
                alt="FTC Bazaar"
                width={40}
                height={40}
                className="w-7 h-7 object-contain"
              />
              <span className="text-xl font-bold font-heading text-foreground">{t('brand')}</span>
            </Link>
            <p className="mt-4 text-foreground-muted text-sm max-w-md">
              {t('description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/bazaar" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                  {t('browseListings')}
                </Link>
              </li>
              <li>
                <Link href="/sell/new" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                  {t('sellParts')}
                </Link>
              </li>
              <li>
                <Link href="/buy/new" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                  {t('postBuyRequest')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">{t('resources')}</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.firstinspires.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-foreground-muted hover:text-foreground transition-colors"
                >
                  First Tech Challenge
                </a>
              </li>
              <li>
                <a
                  href="https://www.ustem.kz/kz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-foreground-muted hover:text-foreground transition-colors"
                >
                  USTEM Foundation
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/bolt.m3?igsh=MXNzZmlid3N2aGc1dQ%3D%3D&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-foreground-muted hover:text-foreground transition-colors"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-foreground-subtle">
            {t('copyright', { year: new Date().getFullYear() })}
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/bolt.m3?igsh=MXNzZmlid3N2aGc1dQ%3D%3D&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground-muted hover:text-foreground transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground-muted hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <span className="flex items-center gap-1.5 text-sm text-foreground-subtle">
              {t('developedBy')}
              <Image
                src="https://boltm3.image.firstinspireskz.org/a.svg"
                alt="T"
                width={20}
                height={20}
                className="h-5 w-5 object-contain inline-block"
              />
              {t('forTeams')}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
