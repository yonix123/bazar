'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { Upload, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createSellListing } from '@/lib/actions/listings';
import { CATEGORIES, CONDITIONS, CONTACT_CONFIG } from '@/lib/utils';
import { getClient } from '@/lib/supabase/client';
import { generateImageFilename, isValidImageType, isValidImageSize } from '@/lib/utils';
import type { CreateSellListingInput, ListingCategory, ItemCondition, ContactType } from '@/types/database';
import { type Currency, EXCHANGE_RATES } from '@/context/currency-context';

interface SellFormProps {
  initialData?: CreateSellListingInput & { id: string };
  isEditMode?: boolean;
}

export function SellForm({ initialData, isEditMode = false }: SellFormProps) {
  const t = useTranslations('Forms.Sell');
  const tVal = useTranslations('Forms.Validation');
  const tCats = useTranslations('Categories');
  const tConds = useTranslations('Conditions');

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('KZT');
  const [formData, setFormData] = useState<CreateSellListingInput>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || 'motors',
    condition: initialData?.condition || 'used',
    price: initialData?.price || 0,
    location: initialData?.location || '',
    contact_type: initialData?.contact_type || 'telegram',
    contact_value: initialData?.contact_value || '',
    images: initialData?.images || [],
  });

  const categoryOptions = CATEGORIES.map(c => ({
    value: c.value,
    label: tCats(c.value)
  }));

  const conditionOptions = CONDITIONS.map(c => ({
    value: c.value,
    label: tConds(c.value)
  }));

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
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check if adding these would exceed limit
    if (images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setUploadingImages(true);
    const supabase = getClient();
    const newImages: string[] = [];

    try {
      for (const file of Array.from(files)) {
        // Validate file
        if (!isValidImageType(file)) {
          toast.error(`Invalid file type: ${file.name}. Use PNG, JPG, or WebP.`);
          continue;
        }
        if (!isValidImageSize(file)) {
          toast.error(`File too large: ${file.name}. Max 5MB.`);
          continue;
        }

        const filename = generateImageFilename(file);
        const { data, error } = await supabase.storage
          .from('listing-images')
          .upload(filename, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (error) {
          toast.error(`Failed to upload ${file.name}`);
          console.error('Upload error:', error);
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('listing-images')
          .getPublicUrl(data.path);

        newImages.push(publicUrl);
      }

      setImages(prev => [...prev, ...newImages]);
      toast.success(`${newImages.length} image(s) uploaded`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = async (index: number) => {
    const imageUrl = images[index];
    const supabase = getClient();

    // Extract filename from URL
    const filename = imageUrl.split('/').pop();
    if (filename) {
      await supabase.storage.from('listing-images').remove([filename]);
    }

    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = tVal('required');
    } else if (formData.title.length < 5) {
      newErrors.title = tVal('tooShort');
    }

    if (!formData.description.trim()) {
      newErrors.description = tVal('required');
    } else if (formData.description.length < 20) {
      newErrors.description = tVal('tooShort');
    }

    if (formData.price < 0) {
      newErrors.price = tVal('nonNegative');
    }

    if (!formData.location.trim()) {
      newErrors.location = tVal('required');
    }

    if (!formData.contact_value.trim()) {
      newErrors.contact_value = tVal('required');
    }

    if (images.length === 0) {
      newErrors.images = tVal('required');
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
      // Convert price to KZT
      const rate = EXCHANGE_RATES[selectedCurrency];
      const priceInKzt = formData.price / rate;

      if (isEditMode && initialData?.id) {
        // Update Logic - using updateSellListing action
        const { updateSellListing } = await import('@/lib/actions/listings');
        const { data, error } = await updateSellListing(initialData.id, {
          ...formData,
          price: priceInKzt,
          images,
        });

        if (error) {
          toast.error(error);
          return;
        }
        toast.success(t('update') + ' success!');
        router.push(`/listing/${initialData.id}`); // Redirect back to listing
        router.refresh();

      } else {
        // Create Logic
        const { data, error } = await createSellListing({
          ...formData,
          price: priceInKzt,
          images,
        });

        if (error) {
          toast.error(error);
          return;
        }

        toast.success(t('submit') + ' success!');
        router.push(`/listing/${data?.id}`);
      }

    } catch (error) {
      console.error('Submit error:', error);
      toast.error(isEditMode ? 'Failed to update' : 'Failed to create');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? t('editTitle') : t('detailsTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label={t('fields.title')}
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder={t('fields.titlePlaceholder')}
            error={!!errors.title}
            helperText={errors.title}
          />

          <Textarea
            label={t('fields.description')}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder={t('fields.descriptionPlaceholder')}
            rows={5}
            error={!!errors.description}
            helperText={errors.description}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label={t('fields.category')}
              name="category"
              value={formData.category}
              onValueChange={(value) => handleChange({ target: { name: 'category', value } })}
              options={categoryOptions}
            />

            <Select
              label={t('fields.condition')}
              name="condition"
              value={formData.condition}
              onValueChange={(value) => handleChange({ target: { name: 'condition', value } })}
              options={conditionOptions}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <Input
                label={t('fields.price')}
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price || ''}
                onChange={handleChange}
                placeholder="0.00"
                error={!!errors.price}
                helperText={errors.price}
              />
            </div>
            <div className="col-span-1">
              <Select
                label={t('fields.currency')}
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
          <CardTitle>{t('images.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Image preview grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {images.map((url, index) => (
                  <div key={url} className="relative aspect-square group">
                    <img
                      src={url}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg border border-border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-primary-500 text-white text-xs rounded">
                        {t('images.main')}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Upload area */}
            {images.length < 5 && (
              <label className={`
                flex flex-col items-center justify-center w-full h-40 
                border-2 border-dashed border-border rounded-lg cursor-pointer
                hover:border-primary-500 hover:bg-primary-500/5 transition-colors
                ${uploadingImages ? 'pointer-events-none opacity-50' : ''}
              `}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {uploadingImages ? (
                    <Loader2 className="w-8 h-8 text-primary-500 animate-spin mb-2" />
                  ) : (
                    <Upload className="w-8 h-8 text-foreground-muted mb-2" />
                  )}
                  <p className="mb-1 text-sm text-foreground-muted">
                    <span className="font-semibold text-primary-400">{t('images.uploadText')}</span> {t('images.dragText')}
                  </p>
                  <p className="text-xs text-foreground-subtle">
                    PNG, JPG, WebP (max 5MB each, {5 - images.length} remaining)
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/png,image/jpeg,image/webp"
                  multiple
                  onChange={handleImageUpload}
                  disabled={uploadingImages}
                />
              </label>
            )}

            {errors.images && (
              <p className="text-sm text-red-400">{errors.images}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact & Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label={t('fields.location')}
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder={t('fields.locationPlaceholder')}
            error={!!errors.location}
            helperText={errors.location}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label={t('fields.contactType')}
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
          {t('cancel')}
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={loading || uploadingImages}
        >
          {isEditMode ? t('update') : t('submit')}
        </Button>
      </div>
    </form>
  );
}
