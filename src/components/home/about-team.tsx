import Link from 'next/link';
import { ArrowRight, Heart, Target, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AboutTeam() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-96 bg-primary-500/5 rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-6">
              <Heart className="h-4 w-4" />
              About Our Mission
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Leveling the Playing Field for All Teams
            </h2>

            <div className="space-y-4 text-foreground-muted">
              <p>
                We started this project because we saw firsthand how budget disparities
                affect FTC teams. While some teams have access to unlimited resources,
                others struggle to afford even basic components.
              </p>
              <p>
                FTC Bazaar was born from a simple idea: <strong className="text-foreground">what if teams could
                  easily share resources?</strong> Parts that sit unused in one team's
                workshop could be exactly what another team needs to complete their robot.
              </p>
              <p>
                Our platform is <strong className="text-foreground">100% free</strong> and
                always will be. No listing fees, no transaction fees, no premium tiers.
                Just teams helping teams.
              </p>
            </div>

            <div className="mt-8">
              <Link href="/sign-up">
                <Button size="lg" className="gap-2">
                  Join the Community
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Values cards */}
          <div className="space-y-4">
            <div className="p-6 rounded-xl bg-background-card border border-border hover:border-primary-500/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center shrink-0">
                  <Target className="h-5 w-5 text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Our Mission</h3>
                  <p className="text-sm text-foreground-muted">
                    To reduce inequality in FIRST Robotics by making parts more
                    accessible and affordable for all teams, regardless of budget.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-background-card border border-border hover:border-primary-500/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center shrink-0">
                  <Lightbulb className="h-5 w-5 text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Built by Teams</h3>
                  <p className="text-sm text-foreground-muted">
                    Created and maintained by FTC team members who understand the
                    challenges of building competitive robots on a tight budget.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-background-card border border-border hover:border-primary-500/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center shrink-0">
                  <Heart className="h-5 w-5 text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Community First</h3>
                  <p className="text-sm text-foreground-muted">
                    Every feature we build is driven by community feedback. We're
                    here to serve the FTC community, not to make a profit.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
