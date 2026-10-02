const SKIP = /^(https?:|\/img\/|\/docs\/|\/api\/|\/uploads\/)/i

export async function translateText(text, from, to) {
  const value = String(text || '').trim()
  if (!value || from === to || SKIP.test(value)) return value
  const chunks = split(value, 450)
  const parts = []
  for (const chunk of chunks) {
    parts.push(await request(chunk, from, to))
  }
  return parts.join(' ').trim() || value
}

export async function translateMany(texts, from, to) {
  const result = {}
  for (const [key, value] of Object.entries(texts || {})) {
    result[key] = await translateText(String(value || ''), from, to)
  }
  return result
}

async function request(text, from, to) {
  try {
    const url = new URL('https://api.mymemory.translated.net/get')
    url.searchParams.set('q', text)
    url.searchParams.set('langpair', `${from}|${to}`)
    const res = await fetch(url, { headers: { Accept: 'application/json' } })
    const json = await res.json()
    const translated = json?.responseData?.translatedText
    if (typeof translated !== 'string' || !translated || /my memory/i.test(translated)) return text
    return translated
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&')
  } catch {
    return text
  }
}

function split(text, max) {
  if (text.length <= max) return [text]
  const parts = text.split(/(?<=\.|\n|!|\?)\s+/)
  const chunks = []
  let buf = ''
  for (const part of parts) {
    if ((buf + ' ' + part).trim().length > max) {
      if (buf) chunks.push(buf)
      buf = part
    } else {
      buf = buf ? `${buf} ${part}` : part
    }
  }
  if (buf) chunks.push(buf)
  return chunks.length ? chunks : [text]
}
