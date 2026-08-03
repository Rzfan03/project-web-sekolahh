import { useEffect } from 'react'

interface SEOProps {
  title: string
  description?: string
  image?: string
}

const setMeta = (property: string, content: string) => {
  const el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`)
  if (el) el.setAttribute('content', content)
  else {
    const meta = document.createElement('meta')
    meta.setAttribute('property', property)
    meta.setAttribute('content', content)
    document.head.appendChild(meta)
  }
}

const getMeta = (property: string) => document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`)?.getAttribute('content') ?? null

const removeMeta = (property: string) => {
  const el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`)
  if (el) el.remove()
}

export function useSEO({ title, description, image }: SEOProps) {
  useEffect(() => {
    const prevTitle = document.title
    const prev: Record<string, string | null> = {}
    for (const p of ['og:title', 'og:type', 'og:description', 'og:image', 'twitter:image', 'twitter:card']) prev[p] = getMeta(p)

    document.title = title
    setMeta('og:title', title)
    setMeta('og:type', 'article')
    if (description) setMeta('og:description', description)
    if (image) {
      setMeta('og:image', image)
      setMeta('twitter:image', image)
      setMeta('twitter:card', 'summary_large_image')
    }

    return () => {
      document.title = prevTitle
      for (const [p, v] of Object.entries(prev)) {
        if (v === null) removeMeta(p)
        else setMeta(p, v)
      }
    }
  }, [title, description, image])
}
