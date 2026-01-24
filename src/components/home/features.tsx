import { Recycle, DollarSign, Globe, Shield, Zap, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Recycle,
    title: 'Reduce Waste',
    description: 'Give unused parts a second life instead of letting them collect dust in storage.',
  },
  {
    icon: DollarSign,
    title: 'Save Money',
    description: 'Find quality components at a fraction of retail prices from teams who no longer need them.',
  },
  {
    icon: Globe,
    title: 'Global Network',
    description: 'Connect with FTC teams worldwide. Find rare parts or sell to teams across the country.',
  },
  {
    icon: Shield,
    title: 'Team Verified',
    description: 'Every seller is a real FTC team member. Trade with confidence in our trusted community.',
  },
  {
    icon: Zap,
    title: 'Fast & Simple',
    description: 'List items in minutes. No fees, no middlemen. Direct contact with buyers and sellers.',
  },
  {
    icon: Users,
    title: 'Level the Field',
    description: 'Help teams with smaller budgets access the parts they need to compete at their best.',
  },
];

export function Features() {
  return (
    <section className="py-24 bg-background-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Why FTC Teams Love Us
          </h2>
          <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
            Built by robotics teams, for robotics teams. We understand the unique
            challenges of FTC and designed our platform to solve them.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              hoverable
              className="bg-background-card/50 backdrop-blur-sm"
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-foreground-muted">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
