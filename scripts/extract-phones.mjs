import path from "node:path"
import { createRequire } from "node:module"
const require = createRequire(import.meta.url)
const sharp = require(path.resolve("node_modules/.pnpm/sharp@0.34.5/node_modules/sharp"))

// KEEP boxes: only pixels inside these rectangles are kept; everything else
// (headings, body copy, empty purple margins) becomes transparent.
// Within the kept region, the near-black background is keyed out too.
const SLIDES = {
  "20": { keep: [{ x: 1072, y: 52, w: 448, h: 775 }] },
  "21": {
    keep: [
      { x: 842, y: 226, w: 300, h: 548 }, // receipt phone
      { x: 1158, y: 220, w: 415, h: 558 }, // transaction phone + Sephora card
    ],
  },
  "22": {
    keep: [
      { x: 978, y: 98, w: 350, h: 710 }, // shopping-lists phone
      { x: 1188, y: 198, w: 388, h: 340 }, // Home & Hardware card
      { x: 838, y: 476, w: 292, h: 340 }, // Edit shopping list card
    ],
  },
}

const pages = process.argv.slice(2)
const list = pages.length ? pages : Object.keys(SLIDES)

for (const p of list) {
  const src = `public/case-studies/bank-of-daniel/page-${p}.jpg`
  const { keep } = SLIDES[p]
  const base = sharp(src)
  const meta = await base.metadata()
  const W = meta.width
  const H = meta.height
  const { data, info } = await base.ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const ch = info.channels

  const inKeep = (x, y) => keep.some((b) => x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h)

  let minX = W, minY = H, maxX = 0, maxY = 0
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * ch
      if (!inKeep(x, y)) {
        data[i + 3] = 0
        continue
      }
      const bright = data[i] + data[i + 1] + data[i + 2]
      let a
      if (bright <= 120) a = 0
      else if (bright >= 210) a = 255
      else a = Math.round(((bright - 120) / 90) * 255)
      data[i + 3] = a
      if (a > 30) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }

  const cw = maxX - minX + 1
  const chh = maxY - minY + 1
  const full = await sharp(data, { raw: { width: W, height: H, channels: ch } })
    .extract({ left: minX, top: minY, width: cw, height: chh })
    .png()
    .toBuffer()

  const out = `public/images/bank-of-daniel/phone-${p}.png`
  await sharp(full).toFile(out)
  await sharp({ create: { width: cw, height: chh, channels: 3, background: "#ffffff" } })
    .composite([{ input: full, top: 0, left: 0 }])
    .png()
    .toFile(`/tmp/agent-browser/review-${p}.png`)
  console.log(`wrote ${out} (${cw}x${chh})`)
}
