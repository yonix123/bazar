-- Fix Storage RLS Policies
-- This migration ensures that authenticated users can upload to the 'listing-images' bucket

-- Drop existing policies to avoid conflicts (optional, adjust based on your needs)
-- DROP POLICY IF EXISTS "Give users access to own folder 1ok12c_0" ON storage.objects;
-- DROP POLICY IF EXISTS "Give users access to own folder 1ok12c_1" ON storage.objects;
-- DROP POLICY IF EXISTS "Give users access to own folder 1ok12c_2" ON storage.objects;
-- DROP POLICY IF EXISTS "Give users access to own folder 1ok12c_3" ON storage.objects;

-- Allow authenticated users to INSERT (upload) files
DROP POLICY IF EXISTS "Allow authenticated uploads to listing-images" ON storage.objects;
CREATE POLICY "Allow authenticated uploads to listing-images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'listing-images' );

-- Allow public to SELECT (view) files
DROP POLICY IF EXISTS "Allow public view of listing-images" ON storage.objects;
CREATE POLICY "Allow public view of listing-images"
ON storage.objects
FOR SELECT
TO public
USING ( bucket_id = 'listing-images' );

-- Allow users to UPDATE their own files
DROP POLICY IF EXISTS "Allow individual update of listing-images" ON storage.objects;
CREATE POLICY "Allow individual update of listing-images"
ON storage.objects
FOR UPDATE
TO authenticated
USING ( bucket_id = 'listing-images' AND auth.uid() = owner );

-- Allow users to DELETE their own files
DROP POLICY IF EXISTS "Allow individual delete of listing-images" ON storage.objects;
CREATE POLICY "Allow individual delete of listing-images"
ON storage.objects
FOR DELETE
TO authenticated
USING ( bucket_id = 'listing-images' AND auth.uid() = owner );
