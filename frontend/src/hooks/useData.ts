import { useState, useEffect, useCallback } from 'react'

export function useData<T>(fetcher: () => Promise<T[]>) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetcher()
    setData(res)
    setLoading(false)
  }, [fetcher])

  useEffect(() => { load() }, [load])

  return { data, loading, refresh: load, setData }
}
