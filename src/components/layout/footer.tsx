import Link from 'next/link';
import Image from 'next/image';

// ...


import { Github, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-background-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/bright_red.svg"
                alt="FRC Bazaar"
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
              />
              <span className="text-xl font-bold font-heading text-foreground">Bazaar</span>
            </Link>
            <p className="mt-4 text-foreground-muted text-sm max-w-md">
              A marketplace for FIRST Robotics teams to buy, sell, and exchange robot parts.
              Reducing inequality in robotics, one part at a time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/bazaar" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                  Browse Listings
                </Link>
              </li>
              <li>
                <Link href="/sell/new" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                  Sell Parts
                </Link>
              </li>
              <li>
                <Link href="/buy/new" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                  Post Buy Request
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.firstinspires.org/robotics/frc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-foreground-muted hover:text-foreground transition-colors"
                >
                  FIRST Robotics
                </a>
              </li>
              <li>
                <a
                  href="https://www.thebluealliance.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-foreground-muted hover:text-foreground transition-colors"
                >
                  The Blue Alliance
                </a>
              </li>
              <li>
                <a
                  href="https://www.chiefdelphi.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-foreground-muted hover:text-foreground transition-colors"
                >
                  Chief Delphi
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-foreground-subtle">
            © {new Date().getFullYear()} FRC Bazaar. Open source project.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground-muted hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <span className="flex items-center gap-1.5 text-sm text-foreground-subtle">
              Developed by
              <Image
                src="/bright_red.svg"
                alt="Team Bolts"
                width={20}
                height={20}
                className="h-5 w-5 object-contain inline-block"
              />
              for FRC teams
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
