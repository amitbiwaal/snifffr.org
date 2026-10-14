// One-off asset optimisation: trims/resizes the brand logo and builds PWA icons.
// Run with: node scripts/optimize-assets.mjs
import sharp from 'sharp'

const logo = await sharp('legacy/logo.png').trim({ threshold: 20 }).toBuffer({ resolveWithObject: true })
console.log('trimmed logo', logo.info.width, 'x', logo.info.height)
await sharp(logo.data).resize({ height: 120 }).png({ compressionLevel: 9, palette: true }).toFile('public/logo.png')
await sharp(logo.data).resize({ height: 120 }).webp({ quality: 90 }).toFile('public/logo.webp')

for (const size of [192, 512]) {
  await sharp('legacy/favicon-source.png').resize(size, size).png({ compressionLevel: 9, palette: true }).toFile(`public/icon-${size}.png`)
}
// Square brand mark used inside generated OG images
await sharp('legacy/favicon-source.png').resize(160, 160).png().toFile('public/brand-mark.png')
const meta = await sharp('public/logo.png').metadata()
console.log('logo.png', meta.width, 'x', meta.height)
