import supabase from '../config/supabase.js'

export const getDashboardStats = async (_, res, next) => {
  try {
    const counts = await Promise.all([
      supabase.from('articles').select('*', { count: 'exact', head: true }),
      supabase.from('gurus').select('*', { count: 'exact', head: true }),
      supabase.from('siswas').select('*', { count: 'exact', head: true }),
      supabase.from('kelas').select('*', { count: 'exact', head: true }),
      supabase.from('pengumumans').select('*', { count: 'exact', head: true }),
      supabase.from('galeris').select('*', { count: 'exact', head: true }),
      supabase.from('ppdbs').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    ])
    const [totalArtikel, totalGuru, totalSiswa, totalKelas, totalPengumuman, totalGaleri, ppdbPending] = counts.map(c => c.count || 0)
    const { data: recentArticles } = await supabase.from('articles').select('*').order('created_at', { ascending: false }).limit(5)
    res.json({ stats: { totalArtikel, totalGuru, totalSiswa, totalKelas, totalPengumuman, totalGaleri, ppdbPending }, recentArticles })
  } catch (e) { next(e) }
}
