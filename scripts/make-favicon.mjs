// Builds public/favicon.ico (16/32/48 px, RGBA PNG frames) from the brand icon.
import { writeFileSync } from 'node:fs'
import sharp from 'sharp'

const sizes = [16, 32, 48]
const pngs = await Promise.all(
  sizes.map((s) => sharp('legacy/favicon-source.png').resize(s, s).ensureAlpha().png().toBuffer()),
)
const header = Buffer.alloc(6)
header.writeUInt16LE(0, 0) // reserved
header.writeUInt16LE(1, 2) // type: icon
header.writeUInt16LE(sizes.length, 4)
let offset = 6 + 16 * sizes.length
const entries = pngs.map((png, i) => {
  const e = Buffer.alloc(16)
  e.writeUInt8(sizes[i] % 256, 0)
  e.writeUInt8(sizes[i] % 256, 1)
  e.writeUInt8(0, 2) // palette
  e.writeUInt8(0, 3) // reserved
  e.writeUInt16LE(1, 4) // colour planes
  e.writeUInt16LE(32, 6) // bits per pixel
  e.writeUInt32LE(png.length, 8)
  e.writeUInt32LE(offset, 12)
  offset += png.length
  return e
})
writeFileSync('public/favicon.ico', Buffer.concat([header, ...entries, ...pngs]))
console.log('public/favicon.ico written')
