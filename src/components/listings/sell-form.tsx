'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
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

const CATEGORY_OPTIONS = CATEGORIES.map(c => ({
  value: c.value,
  label: `${c.icon} ${c.label}`
}));

const CONDITION_OPTIONS = CONDITIONS.map(c => ({
  value: c.value,
  label: c.label
}));

const CONTACT_OPTIONS = Object.entries(CONTACT_CONFIG).map(([value, config]) => ({
  value,
  label: `${config.icon} ${config.label}`,
}));

interface SellFormProps {
  initialData?: CreateSellListingInput & { id: string };
  isEditMode?: boolean;
}

export function SellForm({ initialData, isEditMode = false }: SellFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.contact_value.trim()) {
      newErrors.contact_value = 'Contact information is required';
    }

    if (images.length === 0) {
      newErrors.images = 'At least one image is required';
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
      if (isEditMode && initialData?.id) {
        // Update Logic - using updateSellListing action
        const { updateSellListing } = await import('@/lib/actions/listings');
        const { data, error } = await updateSellListing(initialData.id, {
          ...formData,
          images,
        });

        if (error) {
          toast.error(error);
          return;
        }
        toast.success('Listing updated successfully!');
        router.push(`/listing/${initialData.id}`); // Redirect back to listing
        router.refresh();

      } else {
        // Create Logic
        const { data, error } = await createSellListing({
          ...formData,
          images,
        });

        if (error) {
          toast.error(error);
          return;
        }

        toast.success('Listing created successfully!');
        router.push(`/listing/${data?.id}`);
      }

    } catch (error) {
      console.error('Submit error:', error);
      toast.error(isEditMode ? 'Failed to update listing' : 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? 'Edit Item Details' : 'Item Details'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., NEO Brushless Motor (Slightly Used)"
            error={!!errors.title}
            helperText={errors.title}
          />

          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the item, its condition, any defects, included accessories, etc."
            rows={5}
            error={!!errors.description}
            helperText={errors.description}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              options={CATEGORY_OPTIONS}
            />

            <Select
              label="Condition"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              options={CONDITION_OPTIONS}
            />
          </div>

          <Input
            label="Price (USD)"
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
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
                        Main
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
                    <span className="font-semibold text-primary-400">Click to upload</span> or drag and drop
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
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., San Francisco, CA"
            error={!!errors.location}
            helperText={errors.location}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Contact Method"
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
          disabled={loading || uploadingImages}
        >
          {isEditMode ? 'Update Listing' : 'Create Listing'}
        </Button>
      </div>
    </form>
  );
}
