const en = await fetch('http://localhost:8040/api/content/a-propos?locale=en').then((r) => r.json())
const ar = await fetch('http://localhost:8040/api/content/a-propos?locale=ar').then((r) => r.json())
const fr = await fetch('http://localhost:8040/api/content/a-propos?locale=fr').then((r) => r.json())
const s = (o) => JSON.stringify(o)
console.log('keys', Object.keys(en))
const e = s(en)
const marker = 'Tunisia is a young country'
const old = 'Tunisia is a young country. People under 35 represent more than half of the population. That demographic reality'
console.log('has full EN marker', e.includes(marker))
console.log('has old short EN', e.includes(old))
console.log('EN pourquoi index len around', (() => {
  const i = e.indexOf(marker)
  if (i < 0) return 0
  return e.slice(i, i + 2000).length
})())
console.log('AR has arabic pourquoi', s(ar).includes('تونس بلد شاب'))
console.log('FR len sample', (s(fr).match(/La Tunisie est un pays jeune[\s\S]{0,50}/) || [''])[0])

const news = await fetch('http://localhost:8040/api/content/actualites?locale=en').then((r) => r.json())
console.log('news has Major advances', s(news).includes('Major advances'))
console.log('news still French Avancées', s(news).includes('Avancées majeures'))
