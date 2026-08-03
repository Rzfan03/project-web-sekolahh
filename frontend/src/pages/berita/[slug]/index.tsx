import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FiArrowLeft, FiFileText, FiCalendar, FiClock, FiArrowRight } from 'react-icons/fi'
import { getArticle } from '../../../lib/supabase'
import { STUDENT_BG } from '../../../lib/logo'
import { kategoriBadge } from '../../../lib/kategori'
import { useSEO } from '../../../hooks/useSEO'
import type { Article } from '../../../types/articles'

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

const readTime = (text: string) => Math.max(1, Math.round((text || '').split(/\s+/).filter(Boolean).length / 200))

const DetailBerita = () => {
  const { slug } = useParams()
  const [article, setArticle] = useState<Article | null>(null)
  const [others, setOthers] = useState<Article[]>([])
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    getArticle().then((res) => {
      const all = res as Article[]
      const found = all.find((a) => a.slug === slug && a.status === 'published')
      if (found) setArticle(found)
      else setNotFound(true)
      setOthers(
        all
          .filter((a) => a.status === 'published' && a.slug !== slug)
          .sort((a, b) => {
            const sameA = found?.kategori && a.kategori === found.kategori ? 0 : 1
            const sameB = found?.kategori && b.kategori === found.kategori ? 0 : 1
            if (sameA !== sameB) return sameA - sameB
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          })
          .slice(0, 5)
      )
    })
  }, [slug])

  useSEO({
    title: article ? `${article.judul} - SMKN 1 Sumbawa Besar` : 'Berita - SMKN 1 Sumbawa Besar',
    description: article?.ringkasan,
    image: article?.image || undefined,
  })

  const paragraphs = article?.deskripsi
    ? article.deskripsi.split('\n').map((s) => s.trim()).filter(Boolean)
    : []

  return (
    <main className="min-h-screen bg-white text-slate-800">
      <div className="mx-auto max-w-6xl px-6 py-14">
        {notFound ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FiFileText className="size-12 text-slate-300" />
            <p className="mt-4 text-sm text-slate-500">Berita tidak ditemukan.</p>
            <Link to="/berita" className="mt-4 inline-flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600">
              <FiArrowLeft size={16} /> Kembali ke Berita
            </Link>
          </div>
        ) : !article ? (
          <div className="mx-auto max-w-4xl">
            <div className="space-y-4">
              <div className="h-9 w-2/3 animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-40 animate-pulse rounded bg-slate-100" />
              <div className="aspect-[16/9] animate-pulse rounded-md bg-slate-100" />
              <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-3">
            <article className="lg:col-span-2">
              <Link to="/berita" className="inline-flex items-center gap-2 text-sm font-medium text-orange-500 transition-colors hover:text-orange-600">
                <FiArrowLeft size={16} /> Kembali ke Berita
              </Link>
              {article.kategori && (
                <span className={`mt-5 inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ${kategoriBadge(article.kategori)}`}>{article.kategori}</span>
              )}
              <h2 className="mt-3 text-3xl font-bold leading-tight text-slate-900">{article.judul}</h2>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium text-slate-500">
                <span className="inline-flex items-center gap-1.5"><FiCalendar size={15} className="text-orange-500" /> {formatDate(article.created_at)}</span>
                <span className="inline-flex items-center gap-1.5"><FiClock size={15} className="text-orange-500" /> {readTime(article.deskripsi)} menit baca</span>
              </div>
              <div className="mt-6 aspect-[16/9] overflow-hidden rounded-md border border-slate-200 bg-slate-100 shadow-sm">
                {article.image ? (
                  <img src={article.image} alt={article.judul} className="h-full w-full object-cover" />
                ) : (
                  <img src={STUDENT_BG} alt={article.judul} className="h-full w-full object-cover" />
                )}
              </div>
              {article.ringkasan && (
                <p className="mt-7 text-lg font-medium leading-relaxed text-slate-700">{article.ringkasan}</p>
              )}
              <div className="mt-5 max-w-3xl space-y-5 text-[17px] leading-8 text-slate-700">
                {paragraphs.length > 0 ? paragraphs.map((p, i) => <p key={i}>{p}</p>) : <p>{article.deskripsi}</p>}
              </div>
            </article>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900">Berita Lainnya</h3>
                <div className="mt-2 h-1 w-12 rounded-full bg-orange-400" />
                {others.length === 0 ? (
                  <p className="mt-4 text-sm text-slate-500">Tidak ada berita lain.</p>
                ) : (
                  <ul className="mt-6 space-y-5">
                    {others.map((o) => (
                      <li key={o.id}>
                        <Link to={`/berita/${o.slug}`} className="group flex items-start gap-4">
                          <div className="h-20 w-28 flex-none overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                            {o.image ? (
                              <img src={o.image} alt={o.judul} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                            ) : (
                              <img src={STUDENT_BG} alt={o.judul} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-orange-500">{formatDate(o.created_at)}</p>
                            <h4 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-slate-800 transition-colors group-hover:text-orange-500">{o.judul}</h4>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                <Link
                  to="/berita"
                  className="mt-6 inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-semibold text-orange-600 transition-colors hover:bg-orange-100"
                >
                  Lihat Semua Berita <FiArrowRight size={15} />
                </Link>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}

export default DetailBerita
