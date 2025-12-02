import { NextRequest, NextResponse } from 'next/server'

function getMeta(html: string, name: string) {
  const m1 = new RegExp(`<meta[^>]*property=["']${name}["'][^>]*content=["']([^"']+)["']`, 'i').exec(html)
  if (m1 && m1[1]) return m1[1]
  const m2 = new RegExp(`<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']+)["']`, 'i').exec(html)
  return m2 && m2[1] ? m2[1] : undefined
}

function getTitle(html: string) {
  const m = /<title[^>]*>([^<]+)<\/title>/i.exec(html)
  return m && m[1] ? m[1] : undefined
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const target = searchParams.get('url')
    if (!target) return NextResponse.json({ error: 'Missing url' }, { status: 400 })

    const res = await fetch(target, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      redirect: 'follow',
    })
    const html = await res.text()

    const title = getMeta(html, 'og:title') || getTitle(html)
    const description = getMeta(html, 'og:description') || getMeta(html, 'description')
    let image = getMeta(html, 'og:image')
    const siteName = getMeta(html, 'og:site_name')

    if (image && image.startsWith('//')) image = `https:${image}`
    const out = { title, description, image, siteName, url: target }
    return NextResponse.json(out)
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch preview' }, { status: 500 })
  }
}

