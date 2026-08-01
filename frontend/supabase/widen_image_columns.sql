-- Perbesar kolom gambar agar bisa menyimpan foto hasil upload (base64)
-- Jalankan sekali di Supabase Dashboard -> SQL Editor -> Run
ALTER TABLE public.articles ALTER COLUMN image TYPE text;
ALTER TABLE public.galeris ALTER COLUMN image TYPE text;
ALTER TABLE public.gurus ALTER COLUMN foto TYPE text;
ALTER TABLE public.profil_sekolah ALTER COLUMN logo TYPE text;
