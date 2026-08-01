import { useState, useRef, useCallback } from 'react'
import { FiUploadCloud, FiX } from 'react-icons/fi'
import { cn } from '../utils'
import Swal from 'sweetalert2'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  accept?: string
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
const MAX_INPUT_SIZE = 10 * 1024 * 1024
const MAX_DIMENSION = 1280
const MAX_OUTPUT_SIZE = 1024 * 1024

const loadImage = (file: File): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => { URL.revokeObjectURL(url); resolve(img) }
    img.onerror = (e) => { URL.revokeObjectURL(url); reject(e) }
    img.src = url
  })

const toBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })

async function compressImage(file: File): Promise<Blob> {
  const img = await loadImage(file)
  const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height))

  if (scale === 1 && file.size <= MAX_OUTPUT_SIZE) return file

  const canvas = document.createElement('canvas')
  canvas.width = Math.round(img.width * scale)
  canvas.height = Math.round(img.height * scale)
  const ctx = canvas.getContext('2d')
  if (!ctx) return file

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  let best: Blob | null = null
  for (const q of [0.85, 0.75, 0.6, 0.45]) {
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', q))
    if (!blob) continue
    if (!best || blob.size < best.size) best = blob
    if (blob.size <= MAX_OUTPUT_SIZE) return blob
  }
  return best ?? file
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [loading, setLoading] = useState(false)

  const processFile = useCallback(async (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      Swal.fire({ icon: 'error', title: 'Format tidak didukung', text: 'Gunakan JPG, PNG, WebP, GIF, atau AVIF' })
      return
    }
    if (file.size > MAX_INPUT_SIZE) {
      Swal.fire({ icon: 'error', title: 'Ukuran terlalu besar', text: 'Maksimal 10MB' })
      return
    }

    setLoading(true)
    try {
      const blob = await compressImage(file)
      const base64 = await toBase64(blob)
      onChange(base64)
    } catch {
      Swal.fire({ icon: 'error', title: 'Gagal memproses gambar', text: 'Coba gunakan gambar lain' })
    } finally {
      setLoading(false)
    }
  }, [onChange])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }, [processFile])

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    if (inputRef.current) inputRef.current.value = ''
  }, [processFile])

  const handlePaste = useCallback(async (e: React.ClipboardEvent) => {
    const file = e.clipboardData.files[0]
    if (file && file.type.startsWith('image/')) {
      e.preventDefault()
      processFile(file)
    }
  }, [processFile])

  return (
    <div className="space-y-2" onPaste={handlePaste}>
      <label className="block text-sm font-medium text-gray-700">Gambar</label>

      {value ? (
        <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
          <img src={value} alt="Preview" className="h-48 w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-white"
            >
              Ganti
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="rounded-lg bg-red-500/90 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-red-500"
            >
              <FiX className="inline size-3.5" /> Hapus
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-all',
            dragOver
              ? 'border-orange-400 bg-orange-50'
              : 'border-gray-300 bg-gray-50 hover:border-orange-300 hover:bg-orange-50/50'
          )}
        >
          {loading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="size-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
              <p className="text-xs text-gray-500">Memproses & mengompres gambar...</p>
            </div>
          ) : (
            <>
              <FiUploadCloud className="mb-2 size-8 text-gray-400" />
              <p className="text-sm font-medium text-gray-600">Seret & lepas gambar di sini</p>
              <p className="mt-1 text-xs text-gray-400">atau klik untuk pilih file (maks 10MB)</p>
              <p className="mt-2 text-[10px] text-gray-300">JPG, PNG, WebP, GIF, AVIF — bisa juga paste (Ctrl+V)</p>
              <p className="text-[10px] text-gray-300">Foto otomatis dikompres agar ringan</p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}
