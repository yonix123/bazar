'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

export function TeamSection() {
    const t = useTranslations('Team');

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-500/5 -skew-x-12 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-1/4 h-2/3 bg-background-secondary -skew-x-12 -translate-x-1/2" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">

                    {/* Text Content */}
                    <div className="flex-1 space-y-8 animate-slide-right">
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-4xl font-bold font-heading">
                                <span className="gradient-text">{t('title')}</span>
                            </h2>
                            <div className="h-1 w-20 bg-primary-500 rounded-full" />
                        </div>

                        <p className="text-lg text-foreground-muted leading-relaxed">
                            {t('description')}
                        </p>

                        <div className="flex items-center gap-4 pt-4">
                            <div className="flex -space-x-4">
                                {/* Placeholder avatars or icons could go here to show "students" if we had them */}
                                <div className="w-10 h-10 rounded-full bg-surface-200 border-2 border-background flex items-center justify-center text-xs font-bold text-foreground-muted">9</div>
                                <div className="w-10 h-10 rounded-full bg-surface-300 border-2 border-background flex items-center justify-center text-xs font-bold text-foreground-muted">10</div>
                                <div className="w-10 h-10 rounded-full bg-surface-400 border-2 border-background flex items-center justify-center text-xs font-bold text-foreground-muted">11</div>
                            </div>
                            <span className="text-sm font-medium text-foreground-subtle">
                                Grades 9-11 Students
                            </span>
                        </div>
                    </div>

                    {/* Image */}
                    <div className="flex-1 w-full max-w-xl animate-scale-in">
                        <Card className="overflow-hidden border-0 shadow-2xl bg-surface-900/50 backdrop-blur-sm rotate-3 hover:rotate-0 transition-transform duration-500">
                            <CardContent className="p-0 relative aspect-[4/3]">
                                <Image
                                    src="/5442735707895040870.jpg"
                                    alt="bolt.m3"
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-700"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60" />
                                <div className="absolute bottom-6 left-6 right-6">
                                    <p className="text-white font-bold text-lg drop-shadow-md">bolt.m3</p>
                                    <p className="text-white/80 text-sm">NPsMS Almaty Robotics Team</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </section>
    );
}
