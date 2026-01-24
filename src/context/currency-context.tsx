'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Currency = 'KZT' | 'USD' | 'KGS' | 'UZS';

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    formatPrice: (price: number) => string; // Price is assumed to be in KZT in DB
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Mock exchange rates (Base: KZT)
export const EXCHANGE_RATES: Record<Currency, number> = {
    KZT: 1,
    USD: 0.002, // 1 KZT = 0.002 USD (approx 500 KZT/USD)
    KGS: 0.17,  // 1 KZT = 0.17 KGS (approx 5.8 KZT/KGS)
    UZS: 25,    // 1 KZT = 25 UZS
};

const CURRENCY_SYMBOLS: Record<Currency, string> = {
    KZT: '₸',
    USD: '$',
    KGS: 'с',
    UZS: 'сум',
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrencyState] = useState<Currency>('KZT');

    useEffect(() => {
        const saved = localStorage.getItem('currency') as Currency;
        if (saved && EXCHANGE_RATES[saved]) {
            setCurrencyState(saved);
        }
    }, []);

    const setCurrency = (c: Currency) => {
        setCurrencyState(c);
        localStorage.setItem('currency', c);
    };

    const formatPrice = (priceInKzt: number) => {
        const rate = EXCHANGE_RATES[currency];
        const converted = priceInKzt * rate;

        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: currency === 'UZS' ? 0 : 2
        }).format(converted);
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}
