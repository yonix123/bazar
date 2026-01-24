'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createBuyRequest } from '@/lib/actions/listings';
import { CONTACT_CONFIG } from '@/lib/utils';
import type { CreateBuyRequestInput } from '@/types/database';
import { type Currency, EXCHANGE_RATES } from '@/context/currency-context';

export function BuyForm() {
  const t = useTranslations('Forms.Buy');
  const tVal = useTranslations('Forms.Validation');
  const tSell = useTranslations('Forms.Sell'); // Reuse common fields like location/contact

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('KZT');
  const [formData, setFormData] = useState<CreateBuyRequestInput>({
    item_needed: '',
    max_budget: 0,
    location: '',
    contact_type: 'telegram',
    contact_value: '',
  });

  const contactOptions = Object.entries(CONTACT_CONFIG).map(([value, config]) => ({
    value,
    label: `${config.icon} ${config.label}`,
  }));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | { target: { name: string; value: any } }
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'max_budget' ? parseFloat(value) || 0 : value,
    }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.item_needed.trim()) {
      newErrors.item_needed = tVal('required');
    } else if (formData.item_needed.length < 10) {
      newErrors.item_needed = tVal('tooShort');
    }

    if (formData.max_budget < 0) {
      newErrors.max_budget = tVal('nonNegative');
    }

    if (!formData.location.trim()) {
      newErrors.location = tVal('required');
    }

    if (!formData.contact_value.trim()) {
      newErrors.contact_value = tVal('required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fix the errors below');
      return;
    }

    setLoading(true);

    try {
      // Convert budget to KZT
      const rate = EXCHANGE_RATES[selectedCurrency];
      const budgetInKzt = formData.max_budget / rate;

      const { data, error } = await createBuyRequest({
        ...formData,
        max_budget: budgetInKzt,
      });

      if (error) {
        toast.error(error);
        return;
      }

      toast.success(t('submit') + ' success!');
      router.push('/bazaar?type=buy');
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to create buy request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('detailsTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            label={t('fields.itemNeeded')}
            name="item_needed"
            value={formData.item_needed}
            onChange={handleChange}
            placeholder={t('fields.itemNeededPlaceholder')}
            rows={4}
            error={!!errors.item_needed}
            helperText={errors.item_needed || 'Be specific to get better responses'}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <Input
                label={t('fields.budget')}
                name="max_budget"
                type="number"
                min="0"
                step="0.01"
                value={formData.max_budget || ''}
                onChange={handleChange}
                placeholder="0.00"
                error={!!errors.max_budget}
                helperText={errors.max_budget || 'The maximum you\'re willing to pay'}
              />
            </div>
            <div className="col-span-1">
              <Select
                label={tSell('fields.currency')}
                value={selectedCurrency}
                onValueChange={(value) => setSelectedCurrency(value as Currency)}
                options={[
                  { value: 'KZT', label: 'KZT (₸)' },
                  { value: 'USD', label: 'USD ($)' },
                  { value: 'KGS', label: 'KGS (с)' },
                  { value: 'UZS', label: 'UZS (сум)' },
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact & Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label={tSell('fields.location')}
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder={tSell('fields.locationPlaceholder')}
            error={!!errors.location}
            helperText={errors.location || 'Helps sellers know if they can ship to you'}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label={tSell('fields.contactType')}
              name="contact_type"
              value={formData.contact_type}
              onValueChange={(value) => handleChange({ target: { name: 'contact_type', value } })}
              options={contactOptions}
            />

            <Input
              label={formData.contact_type === 'telegram' ? 'Telegram Username' : 'Phone Number'}
              name="contact_value"
              value={formData.contact_value}
              onChange={handleChange}
              placeholder={formData.contact_type === 'telegram' ? '@username' : '+1 234 567 8900'}
              error={!!errors.contact_value}
              helperText={errors.contact_value}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          disabled={loading}
        >
          {tSell('cancel')}
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
        >
          {t('submit')}
        </Button>
      </div>
    </form>
  );
}
