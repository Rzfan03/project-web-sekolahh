import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaChevronLeft, FaChevronRight, FaArrowRight } from 'react-icons/fa'
import { PLACEHOLDER_IMAGE } from '../lib/placeholder'
import { cn } from '../lib/utils'

const SLIDE_MS = 5000

const HERO_IMAGES = [
  '/images/hero-1.png',
  '/images/hero-2.png',
  '/images/hero-3.jpg',
  '/images/hero-4.jpg',
]

interface HeroProps {
  title?: string
  subtitle?: string
}

const Hero = ({
  title = 'SMKN 1 Sumbawa Besar',
  subtitle = 'Sekolah Menengah Kejuruan unggul yang mencetak lulusan berprestasi, berkarakter, dan siap menghadapi dunia kerja.',
}: HeroProps) => {
  const images = HERO_IMAGES
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
      <div className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
      <section
        className="relative h-[380px] w-full overflow-hidden rounded-2xl bg-stone-900 sm:h-[440px] lg:h-[500px]"
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
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/85 via-stone-950/55 to-stone-900/20" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl pb-14 text-center">
            <h1 className="font-display text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-stone-200 sm:text-lg">
              {subtitle}
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link
                to="/ppdb"
                className="inline-flex items-center gap-2 rounded-xl bg-orange-400 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-colors hover:bg-orange-500"
              >
                Info Pendaftaran <FaArrowRight className="size-3.5" />
              </Link>
              <a
                href="#sambutan"
                className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/25"
              >
                Jelajahi Sekolah
              </a>
            </div>
          </div>
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(current - 1)}
              aria-label="Slide sebelumnya"
              className="absolute left-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-orange-400 sm:flex"
            >
              <FaChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => goTo(current + 1)}
              aria-label="Slide berikutnya"
              className="absolute right-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-orange-400 sm:flex"
            >
              <FaChevronRight className="size-4" />
            </button>
            <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
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
      </div>
    </>
  )
}

export default Hero
