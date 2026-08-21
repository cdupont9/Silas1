import path from "node:path"
import { createRequire } from "node:module"
const require = createRequire(import.meta.url)
const sharp = require(path.resolve("node_modules/.pnpm/sharp@0.34.5/node_modules/sharp"))

// crop boxes read from the grid overlays (pixels, 1920x1080 source)
// generous on the right — keyed background becomes transparent so extra width is harmless
const CROPS = {
  "20": { left: 1060, top: 40, width: 560, height: 800 },
  "21": { left: 835, top: 200, width: 770, height: 600 },
  "22": { left: 820, top: 80, width: 785, height: 740 },
}

const pages = process.argv.slice(2)
const list = pages.length ? pages : Object.keys(CROPS)

for (const p of list) {
  const src = `public/case-studies/bank-of-daniel/page-${p}.jpg`
  const c = CROPS[p]
  const region = sharp(src).extract(c)
  const { data, info } = await region.ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  // key out dark background to transparent (background is near-black ~[11,11,19])
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i], g = data[i + 1], b = data[i + 2]
    const bright = r + g + b
    // smooth ramp: transparent for near-black background, opaque for phone content
    let a
    if (bright <= 120) a = 0
    else if (bright >= 210) a = 255
    else a = Math.round(((bright - 120) / 90) * 255)
    data[i + 3] = a
  }
  const outDir = "public/images/bank-of-daniel"
  const out = `${outDir}/phone-${p}.png`
  await sharp(data, { raw: { width, height, channels } }).png().toFile(out)
  // also a preview on white for review
  await sharp({ create: { width, height, channels: 3, background: "#ffffff" } })
    .composite([{ input: await sharp(data, { raw: { width, height, channels } }).png().toBuffer(), top: 0, left: 0 }])
    .png()
    .toFile(`/tmp/agent-browser/preview-${p}.png`)
  console.log(`wrote ${out} (${width}x${height})`)
}
