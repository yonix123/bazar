-- Add images column to buy_requests table
ALTER TABLE public.buy_requests
ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}'::text[];

-- Update RLS policies if necessary (usually not needed for adding columns if access is consistent)
-- But it's good practice to ensure the column is accessible
-- (Assuming existing policies cover SELECT/INSERT/UPDATE on the table)
