import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const path = join(dirname(fileURLToPath(import.meta.url)), '../eu4youth-website/src/components/layout/header.css')
let css = readFileSync(path, 'utf8')

const start = '/* ---- Language utility strip'
const end = '/* Hidden on desktop so it cannot leave an invisible hit target'
const i = css.indexOf(start)
const j = css.indexOf(end)
if (i < 0 || j < 0) throw new Error(`markers not found ${i} ${j}`)

const replacement = `/* ---- Sticky chrome: language dropdown + blue nav pin together ---- */
.header__sticky {
  position: sticky;
  top: 0;
  z-index: 100;
  isolation: isolate;
}

/* Interreg-style framed language toggle (top-right, separate from menu links). */
.header__lang {
  position: absolute;
  top: 0;
  right: 2.4rem;
  z-index: 130;
  direction: ltr;
  font-family: var(--font-ui);
}

.header__lang-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  min-width: 14rem;
  padding: 0.65rem 1.1rem;
  border: 0.14rem solid rgba(255, 255, 255, 0.85);
  border-radius: 0.2rem;
  background: rgba(7, 78, 162, 0.92);
  color: var(--white);
  font: 700 2.05rem/1.2 var(--font-ui);
  letter-spacing: 0.02em;
  cursor: pointer;
  box-shadow: 0 0.15rem 0.6rem rgba(0, 0, 0, 0.18);
}

.header__lang-toggle:hover,
.header__lang-toggle:focus-visible {
  background: var(--eu-blue);
  outline: none;
}

.header__lang-chev {
  width: 1.15rem;
  height: 0.75rem;
  flex: none;
  color: var(--white);
  transition: transform 160ms ease;
}

.header__lang.is-open .header__lang-chev {
  transform: rotate(180deg);
}

.header__lang-menu {
  position: absolute;
  top: calc(100% - 0.14rem);
  right: 0;
  left: auto;
  z-index: 131;
  min-width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
  background: var(--eu-blue);
  border: 0.14rem solid rgba(255, 255, 255, 0.85);
  border-top: 0;
  box-shadow: 0 0.4rem 1.2rem rgba(0, 0, 0, 0.22);
}

.header__lang-menu li {
  margin: 0;
  padding: 0;
}

.header__lang-menu button {
  display: block;
  width: 100%;
  padding: 0.85rem 1.15rem;
  border: 0;
  background: transparent;
  color: var(--white);
  font: 600 2.05rem/1.25 var(--font-ui);
  text-align: start;
  cursor: pointer;
}

.header__lang-menu button:hover,
.header__lang-menu button:focus-visible {
  background: rgba(255, 255, 255, 0.14);
  outline: none;
}

.header__lang-menu button.is-on {
  background: rgba(255, 255, 255, 0.28);
  font-weight: 700;
}

/* Legacy inline locale lists — keep inert if reintroduced. */
.header__locales,
.nav__locales {
  display: none !important;
}

/* ---- Institutional bar — scrolls away; not sticky ---- */
.header__inst {
  position: relative;
  box-sizing: border-box;
  height: auto;
  min-height: 12rem;
  padding: 0.6rem 2rem 1rem;
  background: var(--white);
}

.header__logo {
  position: absolute;
  inset-inline-start: 3rem;
  top: 1.6rem;
  width: 20rem;
  z-index: 3;
}

.header__flags {
  display: none;
}

`

css = css.slice(0, i) + replacement + css.slice(j)
writeFileSync(path, css)
console.log('ok')
