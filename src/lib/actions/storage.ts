'use server';

import { auth } from '@clerk/nextjs/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { generateImageFilename, isValidImageSize, isValidImageType } from '@/lib/utils';

export async function uploadListingImage(formData: FormData) {
    const { userId } = await auth();

    if (!userId) {
        return { error: 'Unauthorized' };
    }

    const file = formData.get('file') as File;

    if (!file) {
        return { error: 'No file provided' };
    }

    // Server-side validation
    if (!isValidImageType(file)) {
        return { error: 'Invalid file type. Use PNG, JPG, or WebP.' };
    }

    if (!isValidImageSize(file)) {
        return { error: 'File too large. Max 5MB.' };
    }

    try {
        const supabase = createAdminClient();
        const filename = generateImageFilename(file);

        // Upload using service role key (bypasses RLS)
        const { data, error } = await supabase.storage
            .from('listing-images')
            .upload(filename, file, {
                contentType: file.type,
                cacheControl: '3600',
                upsert: false,
            });

        if (error) {
            console.error('Storage upload error:', error);
            return { error: error.message };
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('listing-images')
            .getPublicUrl(data.path);

        return { url: publicUrl };

    } catch (error) {
        console.error('Server upload error:', error);
        return { error: 'Failed to upload image' };
    }
}
