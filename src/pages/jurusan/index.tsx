import { JURUSAN_LIST } from '../../lib/jurusan'
import JurusanCard from '../../components/JurusanCard'
import Reveal from '../../components/Reveal'

const JurusanPage = () => {
  return (
    <main className="min-h-screen bg-white text-slate-800">
      <div className="mx-auto max-w-6xl px-6 pt-14">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Bidang Keahlian</h1>
        <p className="mt-3 text-sm text-slate-500">
          SMKN 1 Sumbawa Besar memiliki {JURUSAN_LIST.length} kompetensi keahlian yang membekali siswa dengan keterampilan sesuai kebutuhan dunia industri.
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {JURUSAN_LIST.map((jurusan, index) => (
            <Reveal key={jurusan.slug} delay={index * 80}>
              <JurusanCard jurusan={jurusan} />
            </Reveal>
          ))}
        </div>
      </div>
    </main>
  )
}

export default JurusanPage
