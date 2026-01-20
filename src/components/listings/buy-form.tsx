'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createBuyRequest } from '@/lib/actions/listings';
import { CONTACT_CONFIG } from '@/lib/utils';
import type { CreateBuyRequestInput } from '@/types/database';

const CONTACT_OPTIONS = Object.entries(CONTACT_CONFIG).map(([value, config]) => ({
  value,
  label: `${config.icon} ${config.label}`,
}));

export function BuyForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<CreateBuyRequestInput>({
    item_needed: '',
    max_budget: 0,
    location: '',
    contact_type: 'telegram',
    contact_value: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      newErrors.item_needed = 'Please describe what you need';
    } else if (formData.item_needed.length < 10) {
      newErrors.item_needed = 'Please provide more detail (at least 10 characters)';
    }

    if (formData.max_budget <= 0) {
      newErrors.max_budget = 'Budget must be greater than 0';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.contact_value.trim()) {
      newErrors.contact_value = 'Contact information is required';
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
      const { data, error } = await createBuyRequest(formData);

      if (error) {
        toast.error(error);
        return;
      }

      toast.success('Buy request posted successfully!');
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
          <CardTitle>What are you looking for?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            label="Item Description"
            name="item_needed"
            value={formData.item_needed}
            onChange={handleChange}
            placeholder="Describe the item(s) you need, including any specific requirements like brand, model, condition, etc."
            rows={4}
            error={!!errors.item_needed}
            helperText={errors.item_needed || 'Be specific to get better responses'}
          />

          <Input
            label="Maximum Budget (USD)"
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact & Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Your Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., San Francisco, CA"
            error={!!errors.location}
            helperText={errors.location || 'Helps sellers know if they can ship to you'}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Preferred Contact Method"
              name="contact_type"
              value={formData.contact_type}
              onChange={handleChange}
              options={CONTACT_OPTIONS}
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
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
        >
          Post Buy Request
        </Button>
      </div>
    </form>
  );
}
