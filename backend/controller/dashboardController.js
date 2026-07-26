import supabase from '../config/supabase.js'

export const getDashboardStats = async (req, res, next) => {
  try {
    const counts = await Promise.all([
      supabase.from('articles').select('*', { count: 'exact', head: true }),
      supabase.from('gurus').select('*', { count: 'exact', head: true }),
      supabase.from('siswas').select('*', { count: 'exact', head: true }),
      supabase.from('kelas').select('*', { count: 'exact', head: true }),
      supabase.from('pengumumans').select('*', { count: 'exact', head: true }),
      supabase.from('galeris').select('*', { count: 'exact', head: true }),
      supabase.from('ppdbs').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('siswas').select('*', { count: 'exact', head: true }).eq('status', 'aktif'),
      supabase.from('gurus').select('*', { count: 'exact', head: true }).eq('status', 'aktif')
    ])

    const [articles, gurus, siswa, kelas, pengumuman, galeri, ppdbPending, siswaAktif, guruAktif] = counts.map(c => c.count || 0)

    const { data: recentArticles } = await supabase
      .from('articles')
      .select('*, admins(username)')
      .order('created_at', { ascending: false })
      .limit(5)

    const { data: recentPpdb } = await supabase
      .from('ppdbs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    return res.status(200).json({
      stats: {
        totalArtikel: articles,
        totalGuru: gurus,
        totalSiswa: siswa,
        totalKelas: kelas,
        totalPengumuman: pengumuman,
        totalGaleri: galeri,
        ppdbPending,
        siswaAktif,
        guruAktif
      },
      recentArticles,
      recentPpdb
    })
  } catch (err) {
    next(err)
  }
}
