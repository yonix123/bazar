import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { ArrowRight, Heart, Target, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AboutTeam() {
  const t = useTranslations('AboutTeam');

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
              {t('badge')}
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              {t('title')}
            </h2>

            <div className="space-y-4 text-foreground-muted">
              <p>{t('p1')}</p>
              <p dangerouslySetInnerHTML={{ __html: t.raw('p2') }} />
              <p dangerouslySetInnerHTML={{ __html: t.raw('p3') }} />
            </div>

            <div className="mt-8">
              <Link href="/sign-up">
                <Button size="lg" className="gap-2">
                  {t('cta')}
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
                  <h3 className="font-semibold text-foreground mb-1">{t('cards.mission.title')}</h3>
                  <p className="text-sm text-foreground-muted">
                    {t('cards.mission.desc')}
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
                  <h3 className="font-semibold text-foreground mb-1">{t('cards.builtBy.title')}</h3>
                  <p className="text-sm text-foreground-muted">
                    {t('cards.builtBy.desc')}
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
                  <h3 className="font-semibold text-foreground mb-1">{t('cards.community.title')}</h3>
                  <p className="text-sm text-foreground-muted">
                    {t('cards.community.desc')}
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
