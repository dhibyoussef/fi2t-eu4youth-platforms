/**
 * Sync project catalogue tagline / presentation / generalObjective
 * from extracted trilingual project docs (FR block first, then AR, then EN when present).
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const extractDir = join(root, 'tools', '_trilingual_extract')
const storePath = join(root, 'backend', 'data', 'store.json')

const PROJECTS = [
  {
    slug: 'jeuness',
    file: 'Jeun_ESS_trilingue.txt',
    markers: {
      frStart: /^Jeun/,
      arStart: /Jeun.?ESS|مشروع/,
      enStart: /Jeun.?ESS\s*$|Project to promote|Social and solidarity/i,
    },
  },
  {
    slug: 'go4youth',
    file: 'GO4Youth_trilingue.txt',
    markers: { frStart: /^GO4Youth|^Go4Youth/, arStart: /GO4Youth|بوابات/, enStart: /GO4Youth|Gateway/i },
  },
  {
    slug: 'swafy',
    file: 'SWAFY_Trilingue.txt',
    markers: { frStart: /^SWAFY/, arStart: /SWAFY|العلوم/, enStart: /SWAFY|Science With/i },
  },
  {
    slug: 'irada4youth',
    file: 'Irada4youth_trilingue.txt',
    markers: { frStart: /^Irada/i, arStart: /Irada|إرادة/, enStart: /Irada|Regional/i },
  },
  {
    slug: 'maghroumin',
    file: 'Maghroum_In_trilingue.txt',
    markers: { frStart: /^Maghroum/i, arStart: /Maghroum|مغروم/, enStart: /Maghroum|Culture/i },
  },
  {
    slug: 'fe3ila',
    file: 'Fe3ila_Trilingue.txt',
    markers: { frStart: /^Fe3il/i, arStart: /Fe3il|فاعل/, enStart: /Fe3il|Youth policy/i },
  },
]

function splitLocales(text) {
  const lines = text.split(/\n/).map((l) => l.trim()).filter(Boolean)
  // Heuristic: first Latin-heavy block = FR, first Arabic-script block = AR, later Latin = EN
  const isAr = (s) => /[\u0600-\u06FF]/.test(s)
  const fr = []
  const ar = []
  const en = []
  let mode = 'fr'
  let seenAr = false
  let enCandidates = 0
  for (const line of lines) {
    if (isAr(line)) {
      mode = 'ar'
      seenAr = true
      ar.push(line)
      continue
    }
    if (seenAr && mode === 'ar' && !isAr(line) && /[A-Za-z]{4}/.test(line)) {
      // switch to EN after Arabic block when Latin resumes substantially
      mode = 'en'
    }
    if (mode === 'fr') fr.push(line)
    else if (mode === 'ar') ar.push(line)
    else {
      en.push(line)
      enCandidates++
    }
  }
  return { fr, ar, en }
}

function pickTagline(lines) {
  // usually 2nd line after title
  return lines[1] || lines[0] || ''
}

function pickPresentation(lines) {
  // paragraphs after tagline until "chiffres" / "Objectif" / "Objective"
  const out = []
  for (let i = 2; i < lines.length; i++) {
    const l = lines[i]
    if (/chiffres|Objectif général|Objectifs spécifiques|General objective|Specific objective|بالأرقام|الهدف العام|composantes|Components/i.test(l)) break
    if (/^Traitement graphique/i.test(l)) continue
    out.push(l)
    if (out.length >= 4) break
  }
  return out
}

function pickGeneralObjective(lines) {
  for (let i = 0; i < lines.length; i++) {
    if (/Objectif général|General objective|الهدف العام/i.test(lines[i])) {
      // next non-empty substantive line
      for (let j = i; j < Math.min(i + 3, lines.length); j++) {
        const l = lines[j].replace(/^Objectif général\s*/i, '').replace(/^General objective\s*/i, '').replace(/^الهدف العام\s*/i, '').trim()
        if (l.length > 40) return l
      }
    }
  }
  return ''
}

const store = JSON.parse(readFileSync(storePath, 'utf8'))
let updated = 0

for (const spec of PROJECTS) {
  const path = join(extractDir, spec.file)
  let text
  try {
    text = readFileSync(path, 'utf8')
  } catch {
    console.log('missing', spec.file)
    continue
  }
  const { fr, ar, en } = splitLocales(text)
  const project = (store.projects || []).find((p) => p.slug === spec.slug)
  if (!project) {
    console.log('no project', spec.slug)
    continue
  }

  const tagline = {
    fr: pickTagline(fr),
    en: pickTagline(en.length ? en : fr) || project.tagline?.en || project.tagline?.fr,
    ar: pickTagline(ar) || project.tagline?.ar || project.tagline?.fr,
  }
  const presentation = {
    fr: pickPresentation(fr),
    en: pickPresentation(en.length ? en : fr),
    ar: pickPresentation(ar),
  }
  const generalObjective = {
    fr: pickGeneralObjective(fr) || project.generalObjective?.fr || '',
    en: pickGeneralObjective(en) || project.generalObjective?.en || project.generalObjective?.fr || '',
    ar: pickGeneralObjective(ar) || project.generalObjective?.ar || project.generalObjective?.fr || '',
  }

  if (tagline.fr) project.tagline = { ...(typeof project.tagline === 'object' ? project.tagline : {}), ...tagline }
  if (tagline.fr) project.taglineLocalized = { ...(project.taglineLocalized || {}), ...tagline }
  if (presentation.fr.length) project.presentation = presentation
  if (generalObjective.fr) project.generalObjective = generalObjective

  // fullName often = first descriptive line
  if (fr[0] && fr[1]) {
    project.fullName = {
      fr: fr[1].length > 20 ? fr[1] : fr[0],
      en: (en[1] || en[0] || fr[1] || '').toString(),
      ar: (ar[1] || ar[0] || fr[1] || '').toString(),
    }
  }

  updated++
  console.log(spec.slug, {
    taglineFr: tagline.fr.slice(0, 60),
    presFr: presentation.fr.length,
    goFr: generalObjective.fr.slice(0, 50),
  })
}

writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf8')
console.log('projects updated', updated)
