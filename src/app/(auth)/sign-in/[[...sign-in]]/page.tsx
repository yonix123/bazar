import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 bg-radial-glow" />

      {/* Logo */}
      <Link href="/" className="relative z-10 flex items-center gap-2 mb-8">
        <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xl">FRC</span>
        </div>
        <span className="text-2xl font-bold text-foreground">Bazaar</span>
      </Link>

      {/* Sign in component */}
      <div className="relative z-10">
        <SignIn 
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'bg-background-card border border-border shadow-2xl shadow-primary-500/10',
            },
          }}
        />
      </div>
    </div>
  );
}
