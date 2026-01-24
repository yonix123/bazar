'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { useTransition } from 'react';
import { Select } from '@/components/ui/select';

export function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const handleLocaleChange = (nextLocale: string) => {
        startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
        });
    };

    const options = [
        { value: 'en', label: 'En' },
        { value: 'ru', label: 'Ru' },
        { value: 'kz', label: 'Kz' },
    ];

    return (
        <div className="w-16">
            <Select
                value={locale}
                onValueChange={handleLocaleChange}
                options={options}
                className="py-1 pl-2 pr-6 text-xs bg-transparent border-none shadow-none focus:ring-0 text-foreground-muted hover:text-foreground"
                disabled={isPending}
            />
        </div>
    );
}
