'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { currentUser } from '@clerk/nextjs/server';
import type {
  CreateSellListingInput,
  CreateBuyRequestInput,
  BazaarFilters,
  SellListing,
  BuyRequest,
} from '@/types/database';

const PAGE_SIZE = 20;

// Get paginated sell listings with filters
export async function getSellListings(
  filters: BazaarFilters = {},
  page: number = 1
) {
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from('sell_listings')
    .select('*, owner:profiles(*)', { count: 'exact' });

  // Apply filters
  // Apply filters
  if (filters.category && filters.category !== 'all') {
    query = query.eq('category', filters.category);
  }
  if (filters.condition && filters.condition !== 'all') {
    query = query.eq('condition', filters.condition);
  }
  if (filters.minPrice !== undefined && !isNaN(filters.minPrice)) {
    query = query.gte('price', filters.minPrice);
  }
  if (filters.maxPrice !== undefined && !isNaN(filters.maxPrice)) {
    query = query.lte('price', filters.maxPrice);
  }
  if (filters.search && filters.search.trim() !== '') {
    query = query.ilike('title', `%${filters.search.trim()}%`);
  }

  // Apply sorting
  switch (filters.sort) {
    case 'price_asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('price', { ascending: false });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  // Apply pagination
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching sell listings:', error);
    return { data: [], count: 0, error: error.message };
  }

  return {
    data: data as SellListing[],
    count: count || 0,
    totalPages: Math.ceil((count || 0) / PAGE_SIZE),
    page,
  };
}

// Get paginated buy requests
export async function getBuyRequests(page: number = 1) {
  const supabase = await createServerSupabaseClient();

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error, count } = await supabase
    .from('buy_requests')
    .select('*, owner:profiles(*)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching buy requests:', error);
    return { data: [], count: 0, error: error.message };
  }

  return {
    data: data as BuyRequest[],
    count: count || 0,
    totalPages: Math.ceil((count || 0) / PAGE_SIZE),
    page,
  };
}

// Get single listing by ID
export async function getListingById(id: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('sell_listings')
    .select('*, owner:profiles(*)')
    .eq('id', id)
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as SellListing, error: null };
}

// Get single buy request by ID
export async function getBuyRequestById(id: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('buy_requests')
    .select('*, owner:profiles(*)')
    .eq('id', id)
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as BuyRequest, error: null };
}

// Create sell listing
export async function createSellListing(input: CreateSellListingInput) {
  const { userId } = await auth();

  if (!userId) {
    return { data: null, error: 'Unauthorized' };
  }

  const supabase = createAdminClient();

  // Убедимся что профиль существует
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .single();

  if (!profile) {
    // Создаём профиль если его нет
    const user = await currentUser();
    await supabase.from('profiles').insert({
      id: userId,
      email: user?.emailAddresses[0]?.emailAddress || '',
      display_name: user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : null,
      avatar_url: user?.imageUrl || null,
    });
  }

  const { data, error } = await supabase
    .from('sell_listings')
    .insert({
      owner_id: userId,
      ...input,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating sell listing:', error);
    return { data: null, error: error.message };
  }

  revalidatePath('/bazaar');
  revalidatePath('/profile');

  return { data: data as SellListing, error: null };
}

// Create buy request
export async function createBuyRequest(input: CreateBuyRequestInput) {
  const { userId } = await auth();

  if (!userId) {
    return { data: null, error: 'Unauthorized' };
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('buy_requests')
    .insert({
      owner_id: userId,
      ...input,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating buy request:', error);
    return { data: null, error: error.message };
  }

  revalidatePath('/bazaar');
  revalidatePath('/profile');

  return { data: data as BuyRequest, error: null };
}

// Update sell listing
export async function updateSellListing(
  id: string,
  input: Partial<CreateSellListingInput>
) {
  const { userId } = await auth();

  if (!userId) {
    return { data: null, error: 'Unauthorized' };
  }

  const supabase = createAdminClient();

  // Verify ownership
  const { data: existing } = await supabase
    .from('sell_listings')
    .select('owner_id')
    .eq('id', id)
    .single();

  if (!existing || existing.owner_id !== userId) {
    return { data: null, error: 'Unauthorized' };
  }

  const { data, error } = await supabase
    .from('sell_listings')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating sell listing:', error);
    return { data: null, error: error.message };
  }

  revalidatePath('/bazaar');
  revalidatePath('/profile');
  revalidatePath(`/listing/${id}`);

  return { data: data as SellListing, error: null };
}

// Delete sell listing
export async function deleteSellListing(id: string) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }

  const supabase = createAdminClient();

  // Verify ownership
  const { data: existing } = await supabase
    .from('sell_listings')
    .select('owner_id')
    .eq('id', id)
    .single();

  if (!existing || existing.owner_id !== userId) {
    return { success: false, error: 'Unauthorized' };
  }

  const { error } = await supabase
    .from('sell_listings')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting sell listing:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/bazaar');
  revalidatePath('/profile');

  return { success: true, error: null };
}

// Delete buy request
export async function deleteBuyRequest(id: string) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }

  const supabase = createAdminClient();

  // Verify ownership
  const { data: existing } = await supabase
    .from('buy_requests')
    .select('owner_id')
    .eq('id', id)
    .single();

  if (!existing || existing.owner_id !== userId) {
    return { success: false, error: 'Unauthorized' };
  }

  const { error } = await supabase
    .from('buy_requests')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting buy request:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/bazaar');
  revalidatePath('/profile');

  return { success: true, error: null };
}

// Get user's listings
export async function getUserListings() {
  const { userId } = await auth();

  if (!userId) {
    return { sellListings: [], buyRequests: [], error: 'Unauthorized' };
  }

  const supabase = await createServerSupabaseClient();

  const [sellResult, buyResult] = await Promise.all([
    supabase
      .from('sell_listings')
      .select('*')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false }),
    supabase
      .from('buy_requests')
      .select('*')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false }),
  ]);

  return {
    sellListings: (sellResult.data || []) as SellListing[],
    buyRequests: (buyResult.data || []) as BuyRequest[],
    error: sellResult.error?.message || buyResult.error?.message || null,
  };
}
