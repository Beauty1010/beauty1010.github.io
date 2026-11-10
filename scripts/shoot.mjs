import puppeteer from 'puppeteer-core';
const url = process.argv[2] ?? 'http://localhost:5179/beauty1010/';
const out = process.argv[3] ?? 'shots';
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const devices = [
  ['iphone', 390, 844, 3, true],
  ['android', 412, 915, 2.625, true],
  ['desktop', 1440, 900, 1, false],
];
const errors = [];
for (const [name, w, h, dpr, mobile] of devices) {
  const p = await browser.newPage();
  p.on('console', (m) => (m.type() === 'error' || m.type() === 'warning') && errors.push(`${name}: ${m.text()}`));
  p.on('pageerror', (e) => errors.push(`${name}: ${e.message}`));
  p.on('requestfailed', (r) => errors.push(`${name}: FAILED ${r.url()}`));
  p.on('response', (r) => r.status() >= 400 && errors.push(`${name}: ${r.status()} ${r.url()}`));
  await p.setViewport({ width: w, height: h, deviceScaleFactor: Math.min(dpr, 2), isMobile: mobile, hasTouch: mobile });
  await p.goto(url, { waitUntil: 'networkidle0' });
  // alle Reveal-Elemente einblenden
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 300) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
    scrollTo(0, 0);
    document.querySelectorAll('[data-reveal]').forEach((e) => e.classList.add('is-in'));
    await document.fonts.ready;
    await new Promise((r) => setTimeout(r, 1200));
  });
  await p.screenshot({ path: `${out}/${name}-top.png` });
  await p.screenshot({ path: `${out}/${name}-full.png`, fullPage: true });
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  if (overflow > 0) errors.push(`${name}: horizontal overflow ${overflow}px`);
  await p.close();
}
await browser.close();
console.log(errors.length ? errors.join('\n') : 'no console errors / failed requests / overflow');
