import { brand, offer, percentLabel } from '../config/brand';

const { colors } = brand;

/** Zeichnet den Gutschein als PNG (1080 × 1350, Instagram-/Handy-Format). Keine externen Bibliotheken. */
export async function renderCouponPng(): Promise<Blob> {
  await document.fonts.ready;
  await Promise.all([
    document.fonts.load('300 200px "Jost"'),
    document.fonts.load('400 40px "Jost"'),
    document.fonts.load('500 40px "Jost"'),
    document.fonts.load('italic 400 40px "Cormorant Garamond"'),
  ]).catch(() => undefined);

  const W = 1080;
  const H = 1350;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const x = c.getContext('2d')!;

  // Hintergrund
  x.fillStyle = colors.stone;
  x.fillRect(0, 0, W, H);

  // Karte
  const m = 90;
  const cw = W - m * 2;
  const ch = H - m * 2;
  x.fillStyle = colors.sage;
  roundRect(x, m, m, cw, ch, 28);
  x.fill();

  // Kerben
  x.fillStyle = colors.stone;
  for (const cx of [m, m + cw]) {
    x.beginPath();
    x.arc(cx, m + ch * 0.64, 34, 0, Math.PI * 2);
    x.fill();
  }

  // Innenrahmen
  x.strokeStyle = 'rgba(255,255,255,0.75)';
  x.lineWidth = 2;
  roundRect(x, m + 28, m + 28, cw - 56, ch - 56, 14);
  x.stroke();

  x.fillStyle = colors.graphite;
  x.textAlign = 'center';
  x.textBaseline = 'alphabetic';

  // Logo
  drawLogo(x, W / 2 - 60, 190, 120, colors.graphite);

  x.font = '500 30px Jost, sans-serif';
  spaced(x, offer.voucherTitle.toUpperCase(), W / 2, 380, 7);

  // 10 %
  x.font = '300 300px Jost, sans-serif';
  const num = String(offer.discountPercent);
  const numW = x.measureText(num).width;
  x.font = '300 130px Jost, sans-serif';
  const pctW = x.measureText('%').width;
  const total = numW + 18 + pctW;
  const sx = W / 2 - total / 2;
  x.textAlign = 'left';
  x.font = '300 300px Jost, sans-serif';
  x.fillText(num, sx, 690);
  x.font = '300 130px Jost, sans-serif';
  x.fillText('%', sx + numW + 18, 610);
  x.font = '500 30px Jost, sans-serif';
  spaced(x, 'RABATT', sx + numW + 18 + 4, 690, 8, 'left');

  x.textAlign = 'center';
  x.font = 'italic 400 54px "Cormorant Garamond", serif';
  x.fillText(offer.scope, W / 2, 790);

  // Trennlinie (gestrichelt, wie Abreißkante)
  x.save();
  x.setLineDash([10, 12]);
  x.strokeStyle = 'rgba(35,43,48,0.45)';
  x.lineWidth = 2;
  x.beginPath();
  x.moveTo(m + 70, m + ch * 0.64);
  x.lineTo(m + cw - 70, m + ch * 0.64);
  x.stroke();
  x.restore();

  x.font = '400 34px Jost, sans-serif';
  let y = 990;
  for (const line of wrap(x, `${percentLabel} ${offer.voucherLine}`, cw - 200)) {
    x.fillText(line, W / 2, y);
    y += 48;
  }
  const extras = [
    offer.code ? `Code: ${offer.code}` : null,
    offer.validUntil ? `Gültig bis ${offer.validUntil}` : null,
    ...offer.conditions,
  ].filter(Boolean) as string[];
  x.font = '400 26px Jost, sans-serif';
  for (const e of extras) {
    x.fillText(e, W / 2, y);
    y += 38;
  }
  x.font = '400 26px Jost, sans-serif';
  x.fillStyle = 'rgba(35,43,48,0.85)';
  spaced(x, `${brand.address.street.toUpperCase()} · ${brand.address.zip} ${brand.address.city.toUpperCase()}`, W / 2, H - m - 70, 3);

  return new Promise((res) => c.toBlob((b) => res(b!), 'image/png'));
}

function roundRect(x: CanvasRenderingContext2D, X: number, Y: number, w: number, h: number, r: number) {
  x.beginPath();
  x.moveTo(X + r, Y);
  x.arcTo(X + w, Y, X + w, Y + h, r);
  x.arcTo(X + w, Y + h, X, Y + h, r);
  x.arcTo(X, Y + h, X, Y, r);
  x.arcTo(X, Y, X + w, Y, r);
  x.closePath();
}

function spaced(x: CanvasRenderingContext2D, t: string, cx: number, y: number, sp: number, align: 'center' | 'left' = 'center') {
  const chars = [...t];
  const widths = chars.map((ch) => x.measureText(ch).width);
  const total = widths.reduce((a, b) => a + b, 0) + sp * (chars.length - 1);
  let px = align === 'center' ? cx - total / 2 : cx;
  const prev = x.textAlign;
  x.textAlign = 'left';
  chars.forEach((ch, i) => {
    x.fillText(ch, px, y);
    px += widths[i] + sp;
  });
  x.textAlign = prev;
}

function wrap(x: CanvasRenderingContext2D, t: string, max: number) {
  const words = t.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w;
    if (x.measureText(test).width > max && cur) {
      lines.push(cur);
      cur = w;
    } else cur = test;
  }
  if (cur) lines.push(cur);
  return lines;
}

/** Logo auf Canvas (gleiche Geometrie wie Logo.tsx, viewBox 240). */
function drawLogo(x: CanvasRenderingContext2D, X: number, Y: number, size: number, color: string) {
  const s = size / 240;
  x.save();
  x.translate(X, Y);
  x.scale(s, s);
  x.strokeStyle = color;
  x.fillStyle = color;
  x.lineWidth = 3;
  x.lineCap = 'square';
  x.beginPath();
  x.moveTo(38.5, 46);
  x.lineTo(38.5, 184.5);
  x.moveTo(38.5, 46);
  x.lineTo(204, 46);
  x.lineTo(204, 196);
  x.lineTo(172, 196);
  x.stroke();
  x.font = '400 22px Jost, sans-serif';
  x.textAlign = 'right';
  x.fillText('1010', 186, 151);
  x.font = '400 37px Jost, sans-serif';
  x.textAlign = 'left';
  // gleichmäßig auf 152 px Breite verteilen
  const t = 'BEAUTY';
  const ws = [...t].map((ch) => x.measureText(ch).width);
  const gap = (155 - ws.reduce((a, b) => a + b, 0)) / (t.length - 1);
  let px = 33;
  [...t].forEach((ch, i) => {
    x.fillText(ch, px, 185);
    px += ws[i] + gap;
  });
  x.restore();
}
