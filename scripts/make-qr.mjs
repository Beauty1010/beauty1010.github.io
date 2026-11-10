// Erzeugt den QR-Code für die öffentliche Landingpage-URL (aus src/config/brand.ts).
import QRCode from 'qrcode';
import fs from 'node:fs';
import sharp from 'sharp';

const cfg = fs.readFileSync(new URL('../src/config/brand.ts', import.meta.url), 'utf8');
const url = process.env.QR_URL ?? cfg.match(/publicUrl:\s*'([^']+)'/)[1];
const opts = { errorCorrectionLevel: 'H', margin: 4, color: { dark: '#232B30', light: '#FFFFFF' } };

fs.mkdirSync('public/qr', { recursive: true });
fs.writeFileSync('public/qr/beauty1010-qr.svg', await QRCode.toString(url, { ...opts, type: 'svg' }));
await QRCode.toFile('public/qr/beauty1010-qr.png', url, { ...opts, width: 4096 });
// reines Schwarz-Weiß für maximale Scanbarkeit im Druck
await QRCode.toFile('public/qr/beauty1010-qr-black.png', url, { ...opts, width: 4096, color: { dark: '#000000', light: '#FFFFFF' } });
const m = await sharp('public/qr/beauty1010-qr.png').metadata();
console.log(`QR → ${url}  (${m.width}×${m.height}px, Fehlerkorrektur H, Ruhezone 4 Module)`);
