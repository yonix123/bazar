'use client';

import { useCurrency, type Currency } from '@/context/currency-context';
import { Select } from '@/components/ui/select';

export function CurrencySwitcher() {
    const { currency, setCurrency } = useCurrency();

    const handleCurrencyChange = (curr: string) => {
        setCurrency(curr as Currency);
    };

    const options = [
        { value: 'KZT', label: 'KZT' },
        { value: 'USD', label: 'USD' },
        { value: 'KGS', label: 'KGS' },
        { value: 'UZS', label: 'UZS' },
    ];

    return (
        <div className="w-16">
            <Select
                value={currency}
                onValueChange={handleCurrencyChange}
                options={options}
                className="py-1 pl-2 pr-6 text-xs bg-transparent border-none shadow-none focus:ring-0 text-foreground-muted hover:text-foreground"
            />
        </div>
    );
}
