/**
 * Repair CSS corrupted by PowerShell ($1/$2 expansion):
 *   "border-left:" became "-inline-start:"
 *   "padding-left: Nrem;" became "-inline-start: ;"
 */
import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'

const pagesDir = new URL('../src/pages/', import.meta.url)
const root = new URL('..', import.meta.url)

function gitShow(relPath) {
  try {
    return execSync(`git show HEAD:${relPath}`, {
      cwd: root,
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
    })
  } catch {
    return null
  }
}

function convertRemaining(css) {
  return css
    .replace(/^([ \t]*)border-left:/gm, '$1border-inline-start:')
    .replace(/^([ \t]*)border-left-width:/gm, '$1border-inline-start-width:')
    .replace(/^([ \t]*)border-left-color:/gm, '$1border-inline-start-color:')
    .replace(/^([ \t]*)border-left-style:/gm, '$1border-inline-start-style:')
    .replace(/^([ \t]*)padding-left:\s*([\d.]+rem);/gm, '$1padding-inline-start: $2;')
    .replace(/^([ \t]*)padding-right:\s*([\d.]+rem);/gm, '$1padding-inline-end: $2;')
}

/** Recover padding values from HEAD in document order. */
function headPaddingQueue(head) {
  const left = []
  const right = []
  for (const line of head.split(/\r?\n/)) {
    let m = line.match(/^([ \t]*)padding-left:\s*([\d.]+rem);/)
    if (m) left.push({ indent: m[1], value: m[2] })
    m = line.match(/^([ \t]*)padding-right:\s*([\d.]+rem);/)
    if (m) right.push({ indent: m[1], value: m[2] })
  }
  return { left, right }
}

function repairFile(file) {
  const rel = `src/pages/${file}`
  let css = readFileSync(new URL(file, pagesDir), 'utf8')
  const head = gitShow(rel) || ''
  const pads = headPaddingQueue(head)
  let li = 0
  let ri = 0
  let n = 0

  const lines = css.split(/\r?\n/)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    // border-left-width / color / style corrupted
    let m = line.match(/^([ \t]*)-inline-start-width:\s*(.+);?\s*$/)
    if (m) {
      lines[i] = `${m[1]}border-inline-start-width: ${m[2].replace(/;$/, '')};`
      n++
      continue
    }
    m = line.match(/^([ \t]*)-inline-start-color:\s*(.+);?\s*$/)
    if (m) {
      lines[i] = `${m[1]}border-inline-start-color: ${m[2].replace(/;$/, '')};`
      n++
      continue
    }
    m = line.match(/^([ \t]*)-inline-start-style:\s*(.+);?\s*$/)
    if (m) {
      lines[i] = `${m[1]}border-inline-start-style: ${m[2].replace(/;$/, '')};`
      n++
      continue
    }

    // -inline-start: <value>
    m = line.match(/^([ \t]*)-inline-start:\s*(.*?);?\s*$/)
    if (m) {
      const indent = m[1]
      const val = (m[2] || '').trim()
      if (!val) {
        // empty → was padding-left
        const pad = pads.left[li++]
        if (pad) {
          lines[i] = `${pad.indent}padding-inline-start: ${pad.value};`
          n++
        } else {
          console.warn(file, 'missing padding-left recovery at line', i + 1)
        }
      } else if (/solid|dashed|dotted|none|var\(--/.test(val) || /^\d/.test(val) && /rem|px|em/.test(val) && /solid|var/.test(val)) {
        lines[i] = `${indent}border-inline-start: ${val};`
        n++
      } else if (/^[\d.]+rem$/.test(val) || /^[\d.]+px$/.test(val)) {
        // numeric only could be padding that kept value somehow
        lines[i] = `${indent}padding-inline-start: ${val};`
        n++
      } else {
        // treat as border (e.g. "0", "none")
        lines[i] = `${indent}border-inline-start: ${val};`
        n++
      }
      continue
    }

    m = line.match(/^([ \t]*)-inline-end:\s*(.*?);?\s*$/)
    if (m) {
      const indent = m[1]
      const val = (m[2] || '').trim()
      if (!val) {
        const pad = pads.right[ri++]
        if (pad) {
          lines[i] = `${pad.indent}padding-inline-end: ${pad.value};`
          n++
        } else {
          console.warn(file, 'missing padding-right recovery at line', i + 1)
        }
      } else {
        lines[i] = `${indent}padding-inline-end: ${val};`
        n++
      }
    }
  }

  let next = lines.join('\n')
  next = convertRemaining(next)
  if (next.charCodeAt(0) === 0xfeff) next = next.slice(1)
  if (next !== css) {
    writeFileSync(new URL(file, pagesDir), next)
    return n
  }
  return 0
}

let total = 0
for (const file of readdirSync(pagesDir).filter((f) => f.endsWith('.css'))) {
  const n = repairFile(file)
  if (n) {
    console.log(file, 'fixed', n)
    total += n
  }
}
console.log('total fixed lines', total)

// verify no corruption left
for (const file of readdirSync(pagesDir).filter((f) => f.endsWith('.css'))) {
  const css = readFileSync(new URL(file, pagesDir), 'utf8')
  if (/(?:^|\n)[ \t]*-inline-(?:start|end)/.test(css)) {
    console.error('STILL CORRUPT', file)
  }
}
