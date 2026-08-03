import { useCallback, useEffect, useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { PLACEHOLDER_IMAGE } from '../lib/placeholder'
import { cn } from '../lib/utils'

interface HeroProps {
  slides: string[]
  siswaCount: number
  guruCount: number
}

const SLIDE_MS = 5000

const Hero = ({ slides, siswaCount, guruCount }: HeroProps) => {
  const images = slides.length > 0 ? slides.slice(0, 4) : [PLACEHOLDER_IMAGE]
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const goTo = useCallback(
    (index: number) => setCurrent((index + images.length) % images.length),
    [images.length]
  )

  useEffect(() => {
    if (paused || images.length < 2) return
    const timer = setInterval(() => setCurrent((c) => (c + 1) % images.length), SLIDE_MS)
    return () => clearInterval(timer)
  }, [paused, images.length])

  return (
    <>
      <section
        className="relative h-[420px] w-full overflow-hidden bg-stone-900 sm:h-[560px] lg:h-[700px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {images.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className={cn(
              'absolute inset-0 transition-opacity duration-1000 ease-out',
              i === current ? 'opacity-100' : 'opacity-0'
            )}
            aria-hidden={i !== current}
          >
            <img
              src={src}
              alt={i === 0 ? 'Kegiatan SMKN 1 Sumbawa Besar' : ''}
              loading={i === 0 ? 'eager' : 'lazy'}
              onError={(e) => {
                const img = e.currentTarget
                if (img.dataset.fbk !== '1') {
                  img.dataset.fbk = '1'
                  img.src = PLACEHOLDER_IMAGE
                }
              }}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-stone-950/40" />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(current - 1)}
              aria-label="Slide sebelumnya"
              className="absolute left-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-orange-400 sm:flex"
            >
              <FaChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => goTo(current + 1)}
              aria-label="Slide berikutnya"
              className="absolute right-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-orange-400 sm:flex"
            >
              <FaChevronRight className="size-4" />
            </button>
            <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={cn(
                    'h-2.5 rounded-full transition-all duration-300',
                    i === current ? 'w-8 bg-orange-400' : 'w-2.5 bg-white/60 hover:bg-white'
                  )}
                />
              ))}
            </div>
          </>
        )}
      </section>

      <div className="relative z-10 mx-auto -mt-14 max-w-7xl px-4 sm:px-6">
        <dl className="grid grid-cols-2 divide-stone-200 rounded-2xl border border-stone-200 bg-white shadow-xl shadow-stone-900/5 sm:grid-cols-4 sm:divide-x">
          <div className="px-6 py-6 text-center">
            <dd className="font-display text-3xl font-extrabold text-stone-900">
              {siswaCount.toLocaleString('id-ID')}
              <span className="text-orange-400">+</span>
            </dd>
            <dt className="mt-1 text-sm font-medium text-stone-500">Siswa Aktif</dt>
          </div>
          <div className="px-6 py-6 text-center">
            <dd className="font-display text-3xl font-extrabold text-stone-900">
              {guruCount.toLocaleString('id-ID')}
              <span className="text-orange-400">+</span>
            </dd>
            <dt className="mt-1 text-sm font-medium text-stone-500">Guru & Staf</dt>
          </div>
          <div className="px-6 py-6 text-center">
            <dd className="font-display text-3xl font-extrabold text-stone-900">
              7<span className="text-orange-400">+</span>
            </dd>
            <dt className="mt-1 text-sm font-medium text-stone-500">Kompetensi Keahlian</dt>
          </div>
          <div className="px-6 py-6 text-center">
            <dd className="font-display text-3xl font-extrabold text-stone-900">
              15<span className="text-orange-400">+</span>
            </dd>
            <dt className="mt-1 text-sm font-medium text-stone-500">Ekstrakurikuler</dt>
          </div>
        </dl>
      </div>
    </>
  )
}

export default Hero
