import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const url = process.argv[2] ?? 'http://localhost:5179/beauty1010/';
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const p = await b.newPage();
const errs = [];
p.on('pageerror', (e) => errs.push(e.message));
p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await p.goto(url, { waitUntil: 'networkidle0' });
const r = {};
r.links = await p.$$eval('a[href^="http"]', (as) => as.map((a) => `${a.textContent.trim()} -> ${a.href} [${a.target}]`));
// Gutschein anzeigen
await p.evaluate(() => [...document.querySelectorAll('button')].find((x) => x.textContent.includes('Gutschein anzeigen')).click());
await new Promise((r) => setTimeout(r, 900));
r.viewerOpen = !!(await p.$('.viewer'));
await p.screenshot({ path: 'shots/viewer.png' });
await p.keyboard.press('Escape');
await new Promise((r) => setTimeout(r, 300));
r.viewerClosed = !(await p.$('.viewer'));
// Gutschein speichern (Desktop-Pfad: Download)
const cdp = await p.createCDPSession();
fs.mkdirSync('shots/dl', { recursive: true });
await cdp.send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: process.cwd() + '/shots/dl' });
await p.evaluate(() => [...document.querySelectorAll('button')].find((x) => x.textContent.includes('speichern')).click());
await new Promise((r) => setTimeout(r, 2500));
r.download = fs.readdirSync('shots/dl');
// Impressum / Datenschutz
await p.goto(url + '#impressum', { waitUntil: 'networkidle0' });
r.impressum = await p.$eval('.sheet', (e) => e.innerText.slice(0, 200)).catch(() => 'MISSING');
await p.screenshot({ path: 'shots/impressum.png' });
await p.goto(url + '#datenschutz', { waitUntil: 'networkidle0' });
r.datenschutz = await p.$eval('.sheet h2', (e) => e.innerText).catch(() => 'MISSING');
// Druck
await p.goto(url, { waitUntil: 'networkidle0' });
await p.pdf({ path: 'shots/print-coupon.pdf', format: 'A4', printBackground: true });
r.errors = errs;
console.log(JSON.stringify(r, null, 2));
await b.close();
