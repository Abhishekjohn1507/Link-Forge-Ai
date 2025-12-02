import React from 'react'
import { QRCodeSVG } from 'qrcode.react'
import type { UrlData } from '@/lib/types'

function LinkPreview({ urlPreview, urls }: { urlPreview: string | null; urls?: UrlData[] }) {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const defaultShortUrl = urls && urls.length > 0 ? `${origin}/${urls[0].shortCode}` : ''
  const shortUrl = urlPreview || defaultShortUrl
  return (
    <div className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mt-8'>
      <h3 className="text-xl font-semibold text-white mb-4">Link Preview</h3>
      {shortUrl ? (
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-6'>
          <div className='flex-1 min-w-0'>
            <div className='text-gray-300 text-sm truncate mb-2'>{shortUrl}</div>
            <div className='flex items-center gap-2'>
              <a href={shortUrl} target='_blank' rel='noopener noreferrer' className='bg-blue-500/20 text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-500/30 border border-blue-500/30'>Open</a>
            </div>
          </div>
          <div className='bg-white p-4 rounded-lg'>
            <QRCodeSVG value={shortUrl} size={128} level='H' />
          </div>
        </div>
      ) : (
        <div className='flex items-center gap-4'>
          <img src='/link-preview.png' alt='Link Preview' className='w-24 h-24 rounded-lg' />
          <div className='text-gray-300'>Select a link to preview.</div>
        </div>
      )}
    </div>
  )
}

export default LinkPreview
