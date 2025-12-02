import React, { useEffect, useState } from 'react'
import type { UrlData } from '@/lib/types'

export default function LinkPreviewGrid({ urls }: { urls: UrlData[] }) {
  const [previews, setPreviews] = useState<Record<string, { title?: string; description?: string; image?: string }>>({})
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    let cancelled = false
    async function loadAll() {
      if (!urls || urls.length === 0) return
      const nextLoading = new Set<string>(urls.map(u => String(u._id)))
      setLoadingIds(nextLoading)
      const entries = await Promise.all(
        urls.map(async (u) => {
          try {
            const r = await fetch(`/api/preview?url=${encodeURIComponent(u.originalUrl)}`)
            const data = await r.json()
            if (data && !data.error) {
              return [String(u._id), { title: data.title, description: data.description, image: data.image }] as const
            }
          } catch {}
          return [String(u._id), { title: undefined, description: undefined, image: undefined }] as const
        })
      )
      if (cancelled) return
      const map: Record<string, { title?: string; description?: string; image?: string }> = {}
      for (const [id, val] of entries) map[id] = val
      setPreviews(map)
      setLoadingIds(new Set())
    }
    loadAll()
    return () => { cancelled = true }
  }, [urls])

  return (
    <div className='mt-8'>
      <h4 className='text-white font-semibold mb-4'>All Links Preview</h4>
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {urls.map((u) => {
          let host = ''
          try { host = new URL(u.originalUrl).hostname } catch {}
          const p = previews[String(u._id)] || {}
          const isLoading = loadingIds.has(String(u._id))
          return (
            <div key={String(u._id)} className='bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-5 shadow-sm hover:shadow-md transition-colors'>
              <div className='flex items-center gap-2 mb-3'>
                {host && (<img src={`https://www.google.com/s2/favicons?domain=${host}`} alt='' className='w-4 h-4 rounded' />)}
                <span className='px-2 py-1 rounded-full text-[11px] bg-white/10 text-gray-300 border border-white/20'>{host || 'website'}</span>
              </div>
              <a href={u.originalUrl} target='_blank' rel='noopener noreferrer' className='block text-blue-300 text-sm mb-3 break-all truncate'>
                {u.originalUrl.length > 50 ? `${u.originalUrl.slice(0, 50)}…` : u.originalUrl}
              </a>
              <div className='flex gap-3 items-start'>
                {isLoading ? (
                  <div className='w-28 h-20 bg-black/40 rounded-lg border border-white/10 animate-pulse' />
                ) : p.image ? (
                  <img src={p.image} alt='' className='w-28 h-20 object-contain rounded-lg border border-white/10' />
                ) : (
                  <div className='w-28 h-20 bg-black/40 rounded-lg border border-white/10' />
                )}
                <div className='flex-1 min-w-0'>
                  <div className='text-white text-sm font-semibold truncate'>{p.title || host || 'Website'}</div>
                  <div className='text-gray-300 text-xs line-clamp-3'>{p.description || ''}</div>
                </div>
              </div>
              <div className='mt-3 flex gap-2'>
                <a href={u.originalUrl} target='_blank' rel='noopener noreferrer' className='bg-blue-500/20 text-blue-300 px-3 py-2 rounded-lg hover:bg-blue-500/30 border border-blue-500/30 text-xs'>Open</a>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
