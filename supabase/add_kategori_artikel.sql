-- Tambah kolom kategori pada artikel
-- Jalankan sekali di Supabase Dashboard -> SQL Editor -> Run
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS kategori text;
