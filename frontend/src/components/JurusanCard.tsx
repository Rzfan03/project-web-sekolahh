import type { Jurusan } from '../lib/jurusan'

const JurusanCard = ({ jurusan }: { jurusan: Jurusan }) => {
  const Icon = jurusan.icon

  return (
    <article className="group flex flex-col rounded-md border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-center gap-4">
        <span className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-orange-100 text-orange-500 transition-colors duration-200 group-hover:bg-orange-400 group-hover:text-white">
          <Icon className="h-7 w-7" />
        </span>
        <div className="min-w-0">
          <h2 className="text-lg font-bold leading-snug text-slate-900">{jurusan.nama}</h2>
          <span className="mt-1 inline-block rounded-sm bg-orange-50 px-2 py-0.5 text-xs font-bold uppercase tracking-widest text-orange-500">
            {jurusan.singkatan}
          </span>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-slate-600">{jurusan.deskripsi}</p>

      <ul className="mt-5 space-y-2.5 border-t border-slate-100 pt-5">
        {jurusan.kompetensi.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
            <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-orange-400" />
            {item}
          </li>
        ))}
      </ul>
    </article>
  )
}

export default JurusanCard
