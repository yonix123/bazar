import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ItemCondition, ContactType } from '@/types/database';

// Combine Tailwind classes safely
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

// Format date relative
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

// Condition display names
export const CONDITION_CONFIG: Record<ItemCondition, { label: string; color: string }> = {
  new: { label: 'New', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
  used: { label: 'Used', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
  repaired: { label: 'Repaired', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
};

export const CONDITIONS = Object.entries(CONDITION_CONFIG).map(([value, config]) => ({
  value: value as ItemCondition,
  ...config,
}));

// Contact type display
export const CONTACT_CONFIG: Record<ContactType, { label: string; icon: string; prefix: string }> = {
  telegram: { label: 'Telegram', icon: '', prefix: '@' },
  phone: { label: 'Phone', icon: '', prefix: '' },
};

// Generate Supabase storage URL
export function getStorageUrl(bucket: string, path: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}

// Validate file type for image upload
export function isValidImageType(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  return validTypes.includes(file.type);
}

// Validate file size (max 5MB)
export function isValidImageSize(file: File): boolean {
  const maxSize = 5 * 1024 * 1024; // 5MB
  return file.size <= maxSize;
}

// Generate unique filename for upload
export function generateImageFilename(file: File): string {
  const ext = file.name.split('.').pop();
  // Manual UUID v4 generator
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
  return `${uuid}.${ext}`;
}

// Truncate text with ellipsis
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

// Build search params
export function buildSearchParams(params: Record<string, string | number | undefined>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== 'all') {
      searchParams.set(key, String(value));
    }
  });
  return searchParams.toString();
}

// Parse search params
export function parseSearchParams<T extends Record<string, string | number | undefined>>(
  searchParams: URLSearchParams,
  defaults: T
): T {
  const result = { ...defaults };
  Object.keys(defaults).forEach((key) => {
    const value = searchParams.get(key);
    if (value !== null) {
      // Try to parse as number if default is number
      if (typeof defaults[key] === 'number') {
        const parsed = parseFloat(value);
        if (!isNaN(parsed)) {
          (result as Record<string, unknown>)[key] = parsed;
        }
      } else {
        (result as Record<string, unknown>)[key] = value;
      }
    }
  });
  return result;
}

// Debounce function
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
