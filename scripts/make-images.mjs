import sharp from 'sharp';
const R = 'research/';
const jobs = [
  ['v2.i8831757.w1280.h800.x581A193B.jpg', 'salon-interior'],
  ['v2.i13465365.w1280.h800.x89AC9BB9.jpg', 'nails-nude'],
  ['v2.i8815388.w1280.h800.x39A88559.jpg', 'salon-exterior'],
];
for (const [src, name] of jobs) {
  for (const w of [640, 1280]) {
    await sharp(R + src).resize({ width: w }).webp({ quality: 78 }).toFile(`public/img/${name}-${w}.webp`);
  }
  await sharp(R + src).resize({ width: 1280 }).jpeg({ quality: 80, mozjpeg: true }).toFile(`public/img/${name}-1280.jpg`);
}
console.log('ok');
