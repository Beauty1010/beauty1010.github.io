// Erzeugt Druckdateien (A5, A6 als PDF mit 3 mm Beschnitt + PNG-Vorschau),
// Social-Media-Quadrat, Favicon, Apple-Touch-Icon und Open-Graph-Bild.
// Rendering über lokales Google Chrome (puppeteer-core), Schriften lokal eingebettet.
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const out = path.join(root, 'print');
fs.mkdirSync(out, { recursive: true });
const f = (p) => pathToFileURL(path.join(root, p)).href;
const font = (fam, w, style, file) =>
  `@font-face{font-family:'${fam}';font-weight:${w};font-style:${style};src:url('${f('node_modules/@fontsource/' + file)}') format('woff2');}`;

const cfg = fs.readFileSync('src/config/brand.ts', 'utf8');
const pct = cfg.match(/discountPercent:\s*(\d+)/)[1];
const qrSvg = fs.readFileSync('public/qr/beauty1010-qr.svg', 'utf8');

const css = `
${font('Jost', 300, 'normal', 'jost/files/jost-latin-300-normal.woff2')}
${font('Jost', 400, 'normal', 'jost/files/jost-latin-400-normal.woff2')}
${font('Jost', 500, 'normal', 'jost/files/jost-latin-500-normal.woff2')}
${font('Cormorant Garamond', 400, 'normal', 'cormorant-garamond/files/cormorant-garamond-latin-400-normal.woff2')}
${font('Cormorant Garamond', 400, 'italic', 'cormorant-garamond/files/cormorant-garamond-latin-400-italic.woff2')}
${font('Cormorant Garamond', 300, 'normal', 'cormorant-garamond/files/cormorant-garamond-latin-300-normal.woff2')}
*{box-sizing:border-box;margin:0;padding:0}
html,body{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:Jost,sans-serif;color:#232B30;font-variant-numeric:lining-nums}
.serif{font-family:'Cormorant Garamond',serif}
`;

const logo = (color = '#232B30', disc = null) => `
<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">
  ${disc ? `<circle cx="120" cy="120" r="120" fill="${disc}"/>` : ''}
  <g fill="none" stroke="${color}" stroke-width="3" stroke-linecap="square">
    <path d="M38.5 46 V184.5"/><path d="M38.5 46 H204 V196 H172"/>
  </g>
  <g fill="${color}" font-family="Jost, sans-serif" font-weight="400">
    <text x="186" y="151" font-size="22" text-anchor="end" letter-spacing="0.5">1010</text>
    <text x="33" y="185" font-size="37" textLength="155" lengthAdjust="spacing">BEAUTY</text>
  </g>
</svg>`;

/**
 * Karte. Alle Maße in mm. bleed = Beschnitt rundum.
 * Format-Variablen: W×H (Endformat), qr (QR-Kantenlänge in mm), s (Skalierung Schrift).
 */
const card = ({ W, H, qr, s, bleed = 3 }) => `<!doctype html><html lang="de-AT"><head><meta charset="utf-8"><style>
${css}
@page{size:${W + 2 * bleed}mm ${H + 2 * bleed}mm;margin:0}
body{width:${W + 2 * bleed}mm;height:${H + 2 * bleed}mm;background:#9AA9A9;position:relative;overflow:hidden}
.paper{position:absolute;inset:0;background:
  radial-gradient(120% 70% at 0% 0%,rgba(255,255,255,.28),transparent 55%),
  radial-gradient(90% 70% at 100% 100%,rgba(35,43,48,.10),transparent 60%)}
.frame{position:absolute;left:${bleed + 6 * s}mm;top:${bleed + 6 * s}mm;right:${bleed + 6 * s}mm;bottom:${bleed + 6 * s}mm;
  border:${0.35}mm solid rgba(255,255,255,.8);border-radius:${3 * s}mm}
.c{position:absolute;left:${bleed}mm;top:${bleed}mm;width:${W}mm;height:${H}mm;
  display:flex;flex-direction:column;align-items:center;text-align:center;padding:${11 * s}mm ${12 * s}mm ${9.5 * s}mm}
.logo{width:${16 * s}mm;height:${16 * s}mm}
.kicker{margin-top:${3 * s}mm;font-size:${2.6 * s}mm;font-weight:500;letter-spacing:.32em;text-transform:uppercase}
.welcome{margin-top:${1.6 * s}mm;font-size:${5.4 * s}mm;line-height:1.1;font-style:italic}
.val{display:flex;align-items:flex-end;justify-content:center;gap:${1.2 * s}mm;margin-top:${3.6 * s}mm;line-height:.8}
.num{font-weight:300;font-size:${23 * s}mm;letter-spacing:-.04em}
.unit{display:flex;flex-direction:column;align-items:flex-start;padding-bottom:${1.1 * s}mm}
.pct{font-weight:300;font-size:${10 * s}mm;line-height:.9}
.rab{margin-top:${1.3 * s}mm;font-size:${2.5 * s}mm;font-weight:500;letter-spacing:.3em}
.scope{margin-top:${2.6 * s}mm;font-size:${4.8 * s}mm;font-style:italic}
.qrbox{margin-top:auto;margin-bottom:0;background:#fff;border-radius:${2.5 * s}mm;padding:${2.4 * s}mm;box-shadow:0 0 0 ${0.35}mm rgba(35,43,48,.12)}
.qr{width:${qr}mm;height:${qr}mm}
.qr svg{width:100%;height:100%;display:block}
.cta{margin-top:${3.4 * s}mm;font-size:${2.9 * s}mm;font-weight:500;letter-spacing:.24em;text-transform:uppercase}
.addr{margin-top:${1.6 * s}mm;font-size:${2.2 * s}mm;letter-spacing:.14em;text-transform:uppercase;opacity:.82}
</style></head><body><div class="paper"></div><div class="frame"></div>
<div class="c">
  <div class="logo">${logo()}</div>
  <div class="kicker">Willkommen bei Beauty 1010</div>
  <div class="welcome serif">Ein Moment für dich.</div>
  <div class="val"><span class="num">${pct}</span><span class="unit"><span class="pct">%</span><span class="rab">RABATT</span></span></div>
  <div class="scope serif">Auf jede Behandlung</div>
  <div class="qrbox"><div class="qr">${qrSvg}</div></div>
  <div class="cta">Jetzt scannen &amp; Termin buchen</div>
  <div class="addr">Kleeblattgasse 11 · 1010 Wien</div>
</div></body></html>`;

const square = () => `<!doctype html><html><head><meta charset="utf-8"><style>
${css}
body{width:1080px;height:1080px;background:#9AA9A9;position:relative;overflow:hidden}
.paper{position:absolute;inset:0;background:radial-gradient(120% 70% at 0% 0%,rgba(255,255,255,.28),transparent 55%),radial-gradient(90% 70% at 100% 100%,rgba(35,43,48,.1),transparent 60%)}
.frame{position:absolute;inset:44px;border:2px solid rgba(255,255,255,.8);border-radius:18px}
.c{position:absolute;inset:0;display:grid;grid-template-columns:1fr 1fr;align-items:center;padding:0 100px;gap:60px}
.l{display:flex;flex-direction:column;align-items:flex-start}
.logo{width:150px;height:150px;margin-left:-14px}
.kicker{margin-top:28px;font-size:20px;font-weight:500;letter-spacing:.3em;text-transform:uppercase}
.val{display:flex;align-items:flex-end;gap:10px;margin-top:22px;line-height:.8}
.num{font-weight:300;font-size:230px;letter-spacing:-.04em}
.unit{display:flex;flex-direction:column;padding-bottom:8px}.pct{font-weight:300;font-size:100px;line-height:.9}
.rab{margin-top:12px;font-size:22px;font-weight:500;letter-spacing:.3em}
.scope{margin-top:26px;font-size:44px;font-style:italic}
.r{display:flex;flex-direction:column;align-items:center}
.qrbox{background:#fff;border-radius:22px;padding:22px}.qr{width:330px;height:330px}.qr svg{width:100%;height:100%;display:block}
.cta{margin-top:30px;font-size:21px;font-weight:500;letter-spacing:.22em;text-transform:uppercase;text-align:center;line-height:1.6}
.addr{position:absolute;left:0;right:0;bottom:84px;text-align:center;font-size:18px;letter-spacing:.2em;text-transform:uppercase;opacity:.85}
</style></head><body><div class="paper"></div><div class="frame"></div><div class="c">
<div class="l"><div class="logo">${logo()}</div><div class="kicker">Dein Beauty-Gutschein</div>
<div class="val"><span class="num">${pct}</span><span class="unit"><span class="pct">%</span><span class="rab">RABATT</span></span></div>
<div class="scope serif">auf jede Behandlung</div></div>
<div class="r"><div class="qrbox"><div class="qr">${qrSvg}</div></div><div class="cta">Jetzt scannen<br>&amp; Termin buchen</div></div>
</div><div class="addr">Beauty 1010 · Kleeblattgasse 11 · 1010 Wien</div></body></html>`;

const og = () => `<!doctype html><html><head><meta charset="utf-8"><style>
${css}
body{width:1200px;height:630px;display:grid;grid-template-columns:560px 1fr;background:#9AA9A9}
.ph{background:url('${f('public/img/salon-interior-1280.jpg')}') 30% 50%/cover}
.r{position:relative;display:flex;flex-direction:column;justify-content:center;padding:0 70px;background:radial-gradient(120% 80% at 0% 0%,rgba(255,255,255,.28),transparent 55%)}
.logo{width:120px;height:120px;margin-left:-12px}
.k{margin-top:18px;font-size:17px;font-weight:500;letter-spacing:.3em;text-transform:uppercase}
.val{display:flex;align-items:flex-end;gap:8px;margin-top:16px;line-height:.8}.num{font-weight:300;font-size:170px;letter-spacing:-.04em}
.unit{display:flex;flex-direction:column;padding-bottom:6px}.pct{font-weight:300;font-size:74px;line-height:.9}.rab{margin-top:10px;font-size:17px;font-weight:500;letter-spacing:.3em}
.s{margin-top:22px;font-size:38px;font-style:italic}.a{margin-top:26px;font-size:15px;letter-spacing:.2em;text-transform:uppercase;opacity:.85}
</style></head><body><div class="ph"></div><div class="r"><div class="logo">${logo()}</div><div class="k">Exklusives Angebot</div>
<div class="val"><span class="num">${pct}</span><span class="unit"><span class="pct">%</span><span class="rab">RABATT</span></span></div>
<div class="s serif">auf jede Behandlung</div><div class="a">Kleeblattgasse 11 · 1010 Wien</div></div></body></html>`;

const icon = (size, pad = 0) => `<!doctype html><html><head><meta charset="utf-8"><style>${css}
body{width:${size}px;height:${size}px;background:${pad ? '#9AA9A9' : 'transparent'};display:grid;place-items:center}
.l{width:${size - pad * 2}px;height:${size - pad * 2}px}</style></head><body><div class="l">${logo('#232B30', pad ? null : '#9AA9A9')}</div></body></html>`;

const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const page = await browser.newPage();
const tmp = path.join(out, '.tmp.html');
async function load(html, w, h, dpr = 1) {
  fs.writeFileSync(tmp, html);
  await page.setViewport({ width: Math.round(w), height: Math.round(h), deviceScaleFactor: dpr });
  await page.goto(pathToFileURL(tmp).href, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
}
const mm = 96 / 25.4;

for (const [name, spec] of [
  ['A5', { W: 148, H: 210, qr: 58, s: 1.4 }],
  ['A6', { W: 105, H: 148, qr: 40, s: 1 }],
]) {
  const html = card(spec);
  const b = 3;
  await load(html, (spec.W + 2 * b) * mm, (spec.H + 2 * b) * mm, 300 / 96);
  await page.pdf({ path: `${out}/beauty1010-${name}-druck-3mm-beschnitt.pdf`, preferCSSPageSize: true, printBackground: true });
  await page.screenshot({ path: `${out}/beauty1010-${name}-vorschau-300dpi.png`, clip: { x: b * mm, y: b * mm, width: spec.W * mm, height: spec.H * mm } });
  fs.writeFileSync(`${out}/beauty1010-${name}.html`, html);
}

await load(square(), 1080, 1080, 1);
await page.screenshot({ path: `${out}/beauty1010-social-1080.png` });

await load(og(), 1200, 630, 1);
await page.screenshot({ path: 'public/og-image.jpg', type: 'jpeg', quality: 86 });

for (const [file, size, pad] of [
  ['public/favicon-32.png', 32, 0],
  ['public/apple-touch-icon.png', 180, 14],
  ['public/icon-512.png', 512, 40],
]) {
  await load(icon(size, pad), size, size, 1);
  await page.screenshot({ path: file, omitBackground: !pad });
}
fs.writeFileSync('public/favicon.svg', logo('#232B30', '#9AA9A9').replace('style="width:100%;height:100%;display:block"', ''));
fs.rmSync(tmp);
await browser.close();
console.log('fertig:', fs.readdirSync(out).join(', '));
