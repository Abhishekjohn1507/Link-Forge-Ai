import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function EnhancedForgeSection() {
  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const createUrl = useMutation(api.urls.createUrl);

  const handleShorten = async () => {
    setLoading(true);
    try {
      let validUrl = '';
      try {
        validUrl = new URL(url).toString();
      } catch {
        validUrl = new URL(`https://${url}`).toString();
      }
      const result = await createUrl({
        originalUrl: validUrl,
        alias: useCustom && customAlias ? customAlias : undefined,
      });
      if (result) {
        const base = typeof window !== 'undefined' ? window.location.origin : '';
        setShortenedUrl(`${base}/${result.shortCode}`);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

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

  const shareToSocial = (platform: string) => {
    const text = encodeURIComponent(`Check out this link: ${shortenedUrl}`);
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shortenedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${shortenedUrl}`,
      whatsapp: `https://wa.me/?text=${text}`,
    };
    window.open(urls[platform as keyof typeof urls], '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 px-4 py-2 rounded-full mb-6">
            <span className="text-purple-300 text-sm">⚡ AI-Powered • Lightning Fast • Secure</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Transform Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Links with AI</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Create intelligent, trackable short URLs that adapt to your audience. Powered by advanced AI analytics and enterprise-grade security.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Links Created', value: '10M+' },
            { label: 'Uptime', value: '99.9%' },
            { label: 'Active Users', value: '50K+' },
            { label: 'Support', value: '24/7' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Forge Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 p-6 border-b border-white/20">
            <h2 className="text-2xl font-bold text-white mb-2">Forge Your Link</h2>
            <p className="text-gray-300 text-sm">Create a powerful short link in seconds</p>
          </div>

          <div className="p-6 space-y-6">
            {/* URL Input */}
            <div>
              <label className="block text-white font-medium mb-2">Enter your long URL</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/very-long-url-that-needs-shortening"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Custom Alias Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setUseCustom(!useCustom)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  useCustom ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-300'
                }`}
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  useCustom ? 'border-white bg-white' : 'border-gray-400'
                }`}>
                  {useCustom && <span className="text-purple-600 text-sm">✓</span>}
                </div>
                <span className="font-medium">Use custom alias</span>
              </button>
            </div>

            {/* Custom Alias Input */}
            {useCustom && (
              <div>
                <label className="block text-white font-medium mb-2">Custom alias</label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 px-4 py-3 bg-white/5 border border-white/20 rounded-lg">
                    {(typeof window !== 'undefined' ? window.location.host : '')}/
                  </span>
                  <input
                    type="text"
                    value={customAlias}
                    onChange={(e) => setCustomAlias(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                    placeholder="my-custom-link"
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">Only letters, numbers, hyphens, and underscores allowed</p>
              </div>
            )}

            {/* Forge Button */}
            <button
              onClick={handleShorten}
              disabled={!url || loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg shadow-purple-500/50"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Forging...</span>
                </div>
              ) : (
                'Forge URL'
              )}
            </button>
          </div>

          {/* Result Section */}
          {shortenedUrl && (
            <div className="border-t border-white/20 p-6 bg-gradient-to-br from-green-500/10 to-blue-500/10">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-bold text-white">Your Link is Ready!</h3>
              </div>

              {/* Shortened URL */}
              <div className="bg-white/10 border border-white/20 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 mb-1">Shortened URL</p>
                    <p className="text-blue-300 font-mono text-lg truncate">{shortenedUrl}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(shortenedUrl)}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
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

              {showQR && (
                <div className="bg-white p-6 rounded-lg flex flex-col items-center gap-4">
                  <QRCodeSVG value={shortenedUrl} size={200} level="H" />
                  <button onClick={() => copyToClipboard(shortenedUrl)} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all">
                    {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
              )}

              {/* Social Share */}
              <div className="border-t border-white/20 pt-4">
                <p className="text-sm text-gray-400 mb-3">Share on social media</p>
                <div className="flex gap-3">
                  {[
                    { name: 'Twitter', icon: '𝕏', color: 'hover:bg-black', platform: 'twitter' },
                    { name: 'LinkedIn', icon: 'in', color: 'hover:bg-blue-600', platform: 'linkedin' },
                    { name: 'Facebook', icon: 'f', color: 'hover:bg-blue-700', platform: 'facebook' },
                    { name: 'WhatsApp', icon: '💬', color: 'hover:bg-green-600', platform: 'whatsapp' },
                  ].map((social) => (
                    <button
                      key={social.name}
                      onClick={() => shareToSocial(social.platform)}
                      className={`w-12 h-12 bg-white/10 ${social.color} border border-white/20 rounded-lg flex items-center justify-center text-white font-bold transition-all`}
                      title={social.name}
                    >
                      {social.icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {[
            {
              icon: '⚡',
              title: 'Lightning Fast',
              description: 'Create short URLs instantly with our optimized platform and AI-powered algorithms.',
              color: 'from-purple-500 to-pink-500'
            },
            {
              icon: '📊',
              title: 'Advanced Analytics',
              description: 'Track clicks, engagement, and performance with detailed analytics and insights.',
              color: 'from-blue-500 to-cyan-500'
            },
            {
              icon: '🔒',
              title: 'Secure Links',
              description: 'Your links are protected with enterprise-grade security and encryption.',
              color: 'from-green-500 to-emerald-500'
            }
          ].map((feature, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all">
              <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center text-2xl mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-300 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
