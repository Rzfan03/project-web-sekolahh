# DESIGN.md — Website SMKN 1 Sumbawa Besar

Dokumen sistem desain frontend. Dipakai sebagai acuan ketika membuat/mengubah halaman agar konsisten.

## 1. Brand & Tema

- Warna mengikuti **website resmi SMKN 1 Sumbawa Besar** (putih + oranye), **bukan** tema navy/gold.
- Font global: **Poppins** (dimuat di `src/index.css`).

### Palet warna

| Peran | Tailwind | Catatan |
|---|---|---|
| Latar utama | `bg-white` | body / konten |
| Warna aksen (brand) | `orange-400` (`#fb923c`) | judul, garis, badge, ikon |
| Aksen kuat / hover | `orange-500` | link, hover |
| Teks utama | `text-slate-900` | heading h1/h2/h3 |
| Teks body | `text-slate-700` | paragraf |
| Teks redup / label | `text-slate-400` / `text-slate-500` | label uppercase, footer |
| Soft fill aksen | `bg-orange-50` / `bg-orange-100` | kartu visi, lingkaran ikon |

Jangan memakai `#002147` (navy) atau `#fdc800` (gold) dari situs referensi sma1batanganai — itu hanya rujukan **layout**, bukan warna.

## 2. Layout halaman (pola dari sma1batanganai.sch.id/profil/)

Semua halaman publik (non-admin) memakai pola berikut:

```
├── Navbar                     (dari PublicLayout, otomatis di App.tsx)
├── Page header                (judul H1 + garis aksen, tanpa banner)
├── Konten grid                (row baris 8/4: konten utama + sidebar)
└── Footer                     (putih, border-t, teks slate-500)
```

### Page header (bukan banner)

Tidak ada banner gradient / breadcrumb / deskripsi besar di halaman publik. Header hanya judul H1 + garis aksen oranye (opsional subtitle/search di samping kanan):

```tsx
<div className="mx-auto max-w-6xl px-6 pt-14">
  <h1 className="text-3xl font-bold tracking-tight text-slate-900">Profil Sekolah</h1>
  <div className="mt-2 h-1 w-16 rounded-full bg-orange-400" />
</div>
```

- Pakai `pt-14` (bukan `py-14`) karena tidak ada banner di atasnya.
- Search inline (halaman berita): letakkan `<div className="relative sm:w-80">` sejajar kanan pada baris yang sama.
- Bila butuh subtotal info, taruh di bawah garis aksen: `p.mt-3.text-sm.text-slate-500`.

### Section heading

```tsx
<h2 className="text-2xl font-bold text-slate-900">Judul Section</h2>
<div className="mt-2 h-1 w-16 rounded-full bg-orange-400" />
```

### Grid dua kolom (8/4)

```tsx
<div className="grid gap-12 lg:grid-cols-3">
  <div className="lg:col-span-2">{/* konten utama */}</div>
  <div>{/* sidebar */}</div>
</div>
```

- Grid dipakai **per baris** (2 baris bertumpuk), mengikuti referensi: baris 1 = konten + foto bulat, baris 2 = kontak + lokasi.
- Radius kartu: `rounded-md` (jangan `rounded-2xl`).
- Lingkaran sengaja: `rounded-full` (badge nomor, ikon, foto/logo bulat).

## 3. Komponen umum

| Komponen | Cara render |
|---|---|
| Kartu kontak | `li.flex.items-start.gap-4.rounded-md.border.border-slate-200.bg-white.p-5.shadow-sm` + ikon dalam `span.h-10.w-10.rounded-full.bg-orange-100.text-orange-500` |
| Kartu visi (quote) | `p.rounded-md.border-l-4.border-orange-400.bg-orange-50.p-6.text-lg` |
| Nomor misi | `span.flex.h-7.w-7.rounded-full.bg-orange-400.text-white` |
| Logo/foto bulat | `div.h-40.w-40.rounded-full.border-4.border-orange-400.bg-white.p-3.shadow-lg` + `img.object-contain` |
| Peta lokasi | `iframe.google.com/maps?q=<alamat>&output=embed`, `h-72 w-full`, dibungkus `rounded-md border shadow-sm` |

## 4. Data & konten

- Semua data dari Supabase lewat `src/lib/supabase.ts` (mis. `getProfil()`).
- Logo default: `SCHOOL_LOGO` di `src/lib/logo.ts`.
- Fallback string Indonesia selalu disediakan saat data kosong.

## 5. Aturan lain

- Jangan menambah komentar di kode.
- Jangan memakai library baru bila cukup Tailwind + `react-icons/fi`.
- Navbar otomatis di halaman publik (rute dibungkus `PublicLayout` di `App.tsx`); halaman login & admin **tidak** memakai Navbar.
