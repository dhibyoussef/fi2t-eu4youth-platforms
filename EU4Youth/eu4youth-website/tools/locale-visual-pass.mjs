import { chromium } from 'playwright';

const BASE = process.env.SITE_URL || 'http://127.0.0.1:3030';
const routes = [
  '/',
  '/programme/a-propos',
  '/programme/objectifs',
  '/programme/financement',
  '/programme/gouvernance',
  '/projets',
  '/projets/fe3ila',
  '/projets/swafy',
  '/projets/maghroumin',
  '/projets/go4youth',
  '/projets/jeuness',
  '/projets/irada4youth',
  '/opportunites',
  '/actualites',
  '/publications',
  '/coin-media',
  '/contact',
  '/carte',
  '/partenaires',
  '/mecanismes-appui',
  '/glossaire',
  '/agenda',
  '/stories',
];
const locales = ['ar', 'fr', 'en'];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const rows = [];

for (const loc of locales) {
  for (const route of routes) {
    const url = `${BASE}${route}?locale=${loc}`;
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForTimeout(700);
      const info = await page.evaluate(() => {
        const html = document.documentElement;
        const dir = html.getAttribute('dir') || html.dir || '';
        const lang = html.getAttribute('lang') || '';
        const font = getComputedStyle(document.body).fontFamily;
        const h1 = document.querySelector('h1');
        const h1Text = h1 ? h1.innerText.trim().replace(/\s+/g, ' ').slice(0, 90) : '';
        const h1Align = h1 ? getComputedStyle(h1).textAlign : '';
        const h1Rect = h1 ? h1.getBoundingClientRect() : null;
        const brand = document.querySelector('.site-header__brand, .header__brand, .header__logo');
        const langs = document.querySelector('.site-header__langs, .lang-switcher, .header__langs');
        const brandR = brand ? brand.getBoundingClientRect() : null;
        const langsR = langs ? langs.getBoundingClientRect() : null;
        const sample = document.body.innerText.slice(0, 2500);
        const hasArabic = /[\u0600-\u06FF]/.test(sample);
        const latinHeavyHero = /^[A-Za-zÀ-ÿ0-9\s'’:\-–—,./&()]+$/.test(h1Text) && h1Text.length > 8;
        const borderLeftAccents = [...document.querySelectorAll('*')]
          .filter((el) => {
            const s = getComputedStyle(el);
            const blw = parseFloat(s.borderLeftWidth) || 0;
            const bis = parseFloat(s.borderInlineStartWidth) || 0;
            return blw >= 4 && bis < 2 && el.getBoundingClientRect().height > 20;
          })
          .slice(0, 8)
          .map((el) => (el.className || el.tagName).toString().slice(0, 50));
        return {
          dir,
          lang,
          font: font.slice(0, 70),
          h1Text,
          h1Align,
          h1Left: h1Rect ? Math.round(h1Rect.left) : null,
          h1Right: h1Rect ? Math.round(h1Rect.right) : null,
          brandLeft: brandR ? Math.round(brandR.left) : null,
          langsLeft: langsR ? Math.round(langsR.left) : null,
          hasArabic,
          latinHeavyHero,
          borderLeftAccents,
        };
      });
      const issues = [];
      if (loc === 'ar' && info.dir !== 'rtl') issues.push('DIR_NOT_RTL');
      if (loc !== 'ar' && info.dir === 'rtl') issues.push('DIR_UNEXPECTED_RTL');
      if (loc === 'ar' && !info.hasArabic) issues.push('NO_ARABIC_BODY');
      if (loc === 'ar' && info.latinHeavyHero) issues.push('LATIN_HERO');
      if (loc === 'ar' && info.h1Align === 'left') issues.push('H1_ALIGN_LEFT');
      if (loc === 'ar' && info.h1Left != null && info.h1Left < 50 && info.h1Align !== 'center' && info.h1Text) {
        issues.push(`H1_NEAR_LEFT=${info.h1Left}`);
      }
      if (
        loc === 'ar' &&
        info.brandLeft != null &&
        info.langsLeft != null &&
        info.brandLeft > info.langsLeft + 40
      ) {
        issues.push('LOGO_RIGHT_OF_FLAGS');
      }
      if (loc === 'ar' && info.borderLeftAccents.length) {
        issues.push(`BORDER_LEFT_ACCENTS=${info.borderLeftAccents.join('|')}`);
      }
      if (loc === 'ar' && !/Changa/i.test(info.font)) issues.push(`FONT=${info.font}`);
      rows.push({ loc, route, ...info, issues });
    } catch (err) {
      rows.push({ loc, route, issues: [`NAV_ERR=${err.message}`] });
    }
  }
}

await browser.close();

const problem = rows.filter((r) => r.issues?.length);
console.log(`Checked ${rows.length} | Issues: ${problem.length}`);
for (const r of problem) {
  console.log(
    JSON.stringify({
      loc: r.loc,
      route: r.route,
      dir: r.dir,
      h1: r.h1Text,
      h1Align: r.h1Align,
      h1Left: r.h1Left,
      issues: r.issues,
    }),
  );
}
console.log('--- AR OK sample ---');
for (const r of rows.filter((x) => x.loc === 'ar' && !x.issues?.length).slice(0, 12)) {
  console.log(JSON.stringify({ route: r.route, h1: r.h1Text, h1Align: r.h1Align, h1Left: r.h1Left }));
}
console.log('--- FR/EN dir check ---');
for (const r of rows.filter((x) => x.loc !== 'ar' && ['/', '/projets/fe3ila', '/contact'].includes(x.route))) {
  console.log(JSON.stringify({ loc: r.loc, route: r.route, dir: r.dir, h1: r.h1Text, issues: r.issues }));
}
