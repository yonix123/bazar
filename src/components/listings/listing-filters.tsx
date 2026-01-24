'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, X } from 'lucide-react';
import { useState, useTransition, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CATEGORIES, CONDITIONS } from '@/lib/utils';
import { debounce } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export function ListingFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const t = useTranslations('Filters');
  const tCategories = useTranslations('Categories');
  const tConditions = useTranslations('Conditions');

  const TYPE_OPTIONS = [
    { value: 'all', label: t('allTypes') },
    { value: 'sell', label: t('forSale') },
    { value: 'buy', label: t('wanted') },
  ];

  const CATEGORY_OPTIONS = [
    { value: 'all', label: t('allCategories') },
    ...CATEGORIES.map(c => ({ value: c.value, label: `${c.icon} ${tCategories(c.value as any)}` })),
  ];

  const CONDITION_OPTIONS = [
    { value: 'all', label: t('anyCondition') },
    ...CONDITIONS.map(c => ({ value: c.value, label: tConditions(c.value as any) })),
  ];

  const SORT_OPTIONS = [
    { value: 'newest', label: t('newest') },
    { value: 'price_asc', label: t('priceLowHigh') },
    { value: 'price_desc', label: t('priceHighLow') },
  ];

  // Get current values from URL
  const currentSearch = searchParams.get('search') || '';
  const currentType = searchParams.get('type') || 'all';
  const currentCategory = searchParams.get('category') || 'all';
  const currentCondition = searchParams.get('condition') || 'all';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';

  const [search, setSearch] = useState(currentSearch);

  // Update URL with new params
  const updateFilters = useCallback((updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Reset to page 1 when filters change
    params.delete('page');

    startTransition(() => {
      router.replace(`?${params.toString()}`);
    });
  }, [router, searchParams]);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      updateFilters({ search: value });
    }, 300),
    [updateFilters]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  };

  const clearFilters = () => {
    setSearch('');
    // Remove query params but keep pathname
    router.push('?');
  };

  const hasActiveFilters = currentSearch || currentType !== 'all' ||
    currentCategory !== 'all' || currentCondition !== 'all' ||
    currentMinPrice || currentMaxPrice;

  return (
    <div className="space-y-4">
      {/* Search and mobile filter toggle */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
          <Input
            type="text"
            placeholder={t('search')}
            value={search}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
        <Button
          variant="secondary"
          className="md:hidden"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Desktop filters */}
      <div className={`grid gap-3 ${showMobileFilters ? 'grid-cols-1' : 'hidden md:grid md:grid-cols-5'}`}>
        <Select
          options={TYPE_OPTIONS}
          value={currentType}
          onValueChange={(value) => updateFilters({ type: value })}
        />
        <Select
          options={CATEGORY_OPTIONS}
          value={currentCategory}
          onValueChange={(value) => updateFilters({ category: value })}
        />
        <Select
          options={CONDITION_OPTIONS}
          value={currentCondition}
          onValueChange={(value) => updateFilters({ condition: value })}
        />
        <Select
          options={SORT_OPTIONS}
          value={currentSort}
          onValueChange={(value) => updateFilters({ sort: value })}
        />
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder={t('minPrice')}
            value={currentMinPrice}
            onChange={(e) => updateFilters({ minPrice: e.target.value })}
            className="w-full"
          />
          <Input
            type="number"
            placeholder={t('maxPrice')}
            value={currentMaxPrice}
            onChange={(e) => updateFilters({ maxPrice: e.target.value })}
            className="w-full"
          />
        </div>
      </div>

      {/* Active filters summary */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-foreground-subtle">{t('activeFilters')}</span>
          {currentSearch && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-background-elevated border border-border">
              "{currentSearch}"
            </span>
          )}
          {currentType !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-background-elevated border border-border">
              {TYPE_OPTIONS.find(t => t.value === currentType)?.label}
            </span>
          )}
          {currentCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-background-elevated border border-border">
              {CATEGORY_OPTIONS.find(c => c.value === currentCategory)?.label}
            </span>
          )}
          {currentCondition !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-background-elevated border border-border">
              {CONDITION_OPTIONS.find(c => c.value === currentCondition)?.label}
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs text-primary-400 hover:text-primary-300"
          >
            <X className="h-3 w-3 mr-1" />
            {t('clearAll')}
          </Button>
        </div>
      )}

      {/* Loading indicator */}
      {isPending && (
        <div className="h-1 w-full bg-background-elevated rounded-full overflow-hidden">
          <div className="h-full w-1/3 bg-primary-500 rounded-full animate-[slideRight_1s_ease-in-out_infinite]" />
        </div>
      )}
    </div>
  );
}
