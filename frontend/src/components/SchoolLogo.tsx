import { useState } from 'react'
import { SCHOOL_LOGO, SCHOOL_LOGO_FALLBACK } from '../lib/logo'

interface SchoolLogoProps {
  src?: string | null
  alt: string
  className?: string
}

const SchoolLogo = ({ src, alt, className }: SchoolLogoProps) => {
  const [current, setCurrent] = useState<string>(src || SCHOOL_LOGO)

  return (
    <img
      src={current}
      alt={alt}
      className={className}
      onError={() => {
        if (current !== SCHOOL_LOGO_FALLBACK) setCurrent(SCHOOL_LOGO_FALLBACK)
      }}
    />
  )
}

export default SchoolLogo
