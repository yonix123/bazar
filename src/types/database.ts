export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ListingCategory =
  | 'motors'
  | 'sensors'
  | 'controllers'
  | 'wheels'
  | 'structure'
  | 'electronics'
  | 'other';

export type ItemCondition = 'new' | 'used' | 'repaired';

export type ContactType = 'telegram' | 'phone';

export interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  team_number: number | null;
  created_at: string;
  updated_at: string;
}

export interface SellListing {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  category: ListingCategory;
  condition: ItemCondition;
  price: number;
  location: string;
  contact_type: ContactType;
  contact_value: string;
  images: string[];
  created_at: string;
  updated_at: string;
  // Joined data
  owner?: Profile;
}

export interface BuyRequest {
  id: string;
  owner_id: string;
  item_needed: string;
  max_budget: number;
  location: string;
  contact_type: ContactType;
  contact_value: string;
  created_at: string;
  updated_at: string;
  // Joined data
  owner?: Profile;
}

// Combined type for bazaar feed
export type BazaarItem =
  | (SellListing & { type: 'sell' })
  | (BuyRequest & { type: 'buy' });

// Form types
export interface CreateSellListingInput {
  title: string;
  description: string;
  category: ListingCategory;
  condition: ItemCondition;
  price: number;
  location: string;
  contact_type: ContactType;
  contact_value: string;
  images: string[];
}

export interface CreateBuyRequestInput {
  item_needed: string;
  max_budget: number;
  location: string;
  contact_type: ContactType;
  contact_value: string;
}

// Filter types
export interface BazaarFilters {
  type?: 'all' | 'sell' | 'buy';
  category?: ListingCategory | 'all';
  condition?: ItemCondition | 'all';
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: 'newest' | 'price_asc' | 'price_desc';
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Database type exports for Supabase
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      sell_listings: {
        Row: SellListing;
        Insert: Omit<SellListing, 'id' | 'created_at' | 'updated_at' | 'owner'>;
        Update: Partial<Omit<SellListing, 'id' | 'owner_id' | 'created_at' | 'owner'>>;
      };
      buy_requests: {
        Row: BuyRequest;
        Insert: Omit<BuyRequest, 'id' | 'created_at' | 'updated_at' | 'owner'>;
        Update: Partial<Omit<BuyRequest, 'id' | 'owner_id' | 'created_at' | 'owner'>>;
      };
    };
    Enums: {
      listing_category: ListingCategory;
      item_condition: ItemCondition;
      contact_type: ContactType;
    };
  };
}
