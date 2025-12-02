import { QRCodeSVG } from 'qrcode.react';
import React, { useState } from 'react'

function QrGeneration({ shortenedUrl }: { shortenedUrl: string }) {
    const [showQR,setShowQR] =useState(false);
    const [copied, setCopied] = useState(false);
    const copyToClipboard = (text: string) => {
      const writable = typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function';
      if (writable) {
        navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
  return (
    <div>
        <div className="flex justify-center items-center">
            {/* <img src="/qr-code.png" alt="QR Code" className="w-64 h-64" /> */}
        </div>
          {/* Actions Row */}
              <div className="flex flex-wrap gap-3 mb-4">
                <button
                  onClick={() => setShowQR(!showQR)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  <span>{showQR ? 'Hide' : 'Show'} QR Code</span>
                </button>

                <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>View Analytics</span>
                </button>
              </div>
               {/* QR Code */}
              {showQR && (
                <div className="bg-transparent p-6 rounded-lg flex flex-col items-center gap-4">
                  <QRCodeSVG className='border border-white rounded-lg' value={shortenedUrl} size={200} level="H" />
                  <button onClick={() => copyToClipboard(shortenedUrl)} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all">
                    {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
              )}

    </div>
  )
}

export default QrGeneration
