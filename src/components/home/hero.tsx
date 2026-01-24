import Link from 'next/link';
import { ArrowRight, Zap, Users, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="absolute inset-0 bg-radial-glow" />

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary-600/10 rounded-full blur-[80px] animate-pulse delay-1000" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-8 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500" />
          </span>
          <span className="text-sm text-primary-400 font-medium">
            For FIRST Robotics Teams
          </span>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-slide-up">
          <span className="text-foreground">The Place to Share</span>
          <br />
          <span className="gradient-text">FTC Components and Parts</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-foreground-muted max-w-2xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
          Buy, sell, and exchange FTC components with teams worldwide.
          Reduce waste, save money, and help level the playing field.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <Link href="/bazaar">
            <Button size="lg" className="gap-2 text-base px-8">
              Browse Listings
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button variant="secondary" size="lg" className="gap-2 text-base px-8">
              Start Selling
            </Button>
          </Link>
        </div>


      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-foreground-subtle flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-foreground-subtle rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
