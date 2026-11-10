// Liest die erzeugten QR-PNGs wieder ein und prüft, ob sie die erwartete URL enthalten.
import jsQR from 'jsqr';
import sharp from 'sharp';
import fs from 'node:fs';
const cfg = fs.readFileSync(new URL('../src/config/brand.ts', import.meta.url), 'utf8');
const expected = process.env.QR_URL ?? cfg.match(/publicUrl:\s*'([^']+)'/)[1];
const files = process.argv.slice(2).length ? process.argv.slice(2) : ['public/qr/beauty1010-qr.png', 'public/qr/beauty1010-qr-black.png'];
let ok = true;
for (const f of files) {
  for (const w of [1200, 300, 160]) {
    const { data, info } = await sharp(f).flatten({ background: '#fff' }).resize({ width: w }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const res = jsQR(new Uint8ClampedArray(data), info.width, info.height);
    const pass = res?.data === expected;
    ok &&= pass;
    console.log(`${pass ? 'OK  ' : 'FAIL'} ${f} @${w}px → ${res?.data ?? 'nicht lesbar'}`);
  }
}
process.exit(ok ? 0 : 1);
