'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Profile } from '@/types/database';

// Get current user's profile
export async function getCurrentProfile(): Promise<{ data: Profile | null; error: string | null }> {
  const { userId } = await auth();

  if (!userId) {
    return { data: null, error: 'Unauthorized' };
  }

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = not found
    console.error('Error fetching profile:', error);
    return { data: null, error: error.message };
  }

  return { data: data as Profile | null, error: null };
}

// Get profile by ID
export async function getProfileById(id: string): Promise<{ data: Profile | null; error: string | null }> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as Profile, error: null };
}

// Update profile
export async function updateProfile(input: {
  display_name?: string;
  team_number?: number | null;
}): Promise<{ data: Profile | null; error: string | null }> {
  const { userId } = await auth();

  if (!userId) {
    return { data: null, error: 'Unauthorized' };
  }

  const supabase = createAdminClient() as any;

  const { data, error } = await supabase
    .from('profiles')
    .update(input)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    return { data: null, error: error.message };
  }

  revalidatePath('/profile');

  return { data: data as Profile, error: null };
}

// Sync profile from Clerk (called from webhook)
export async function syncProfile(clerkUser: {
  id: string;
  email_addresses: { email_address: string }[];
  first_name?: string | null;
  last_name?: string | null;
  image_url?: string | null;
}): Promise<{ data: Profile | null; error: string | null }> {
  const supabase = createAdminClient() as any;

  const email = clerkUser.email_addresses[0]?.email_address;
  if (!email) {
    return { data: null, error: 'No email found' };
  }

  const displayName = [clerkUser.first_name, clerkUser.last_name]
    .filter(Boolean)
    .join(' ') || null;

  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: clerkUser.id,
      email,
      display_name: displayName,
      avatar_url: clerkUser.image_url,
    }, {
      onConflict: 'id',
    })
    .select()
    .single();

  if (error) {
    console.error('Error syncing profile:', error);
    return { data: null, error: error.message };
  }

  return { data: data as Profile, error: null };
}

// Delete profile (called from webhook when user is deleted)
export async function deleteProfile(userId: string): Promise<{ success: boolean; error: string | null }> {
  const supabase = createAdminClient() as any;

  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId);

  if (error) {
    console.error('Error deleting profile:', error);
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}
