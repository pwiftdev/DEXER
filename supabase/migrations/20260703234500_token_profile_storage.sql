-- Public bucket for token profile coin images and banners
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'token-profiles',
  'token-profiles',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public read token profile images" ON storage.objects;
DROP POLICY IF EXISTS "Anon upload token profile images" ON storage.objects;
DROP POLICY IF EXISTS "Anon update token profile images" ON storage.objects;

CREATE POLICY "Public read token profile images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'token-profiles');

CREATE POLICY "Anon upload token profile images"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'token-profiles');

CREATE POLICY "Anon update token profile images"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'token-profiles')
WITH CHECK (bucket_id = 'token-profiles');
