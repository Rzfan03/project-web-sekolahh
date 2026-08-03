import { useState } from 'react'
import { PLACEHOLDER_IMAGE } from '../lib/placeholder'

interface PhotoProps {
  src?: string | null
  alt: string
  fallback?: string
  className?: string
}

const Photo = ({ src, alt, fallback = PLACEHOLDER_IMAGE, className }: PhotoProps) => {
  const [current, setCurrent] = useState<string>(src || fallback)

  return (
    <img
      src={current}
      alt={alt}
      loading="lazy"
      className={className}
      onError={() => {
        if (current !== fallback) setCurrent(fallback)
      }}
    />
  )
}

export default Photo
