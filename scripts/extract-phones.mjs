import path from "node:path"
import { createRequire } from "node:module"
const require = createRequire(import.meta.url)
const sharp = require(path.resolve("node_modules/.pnpm/sharp@0.34.5/node_modules/sharp"))

// crop boxes read from the grid overlays (pixels, 1920x1080 source)
const CROPS = {
  "20": { left: 1045, top: 50, width: 465, height: 790 },
  "21": { left: 835, top: 218, width: 668, height: 566 },
  "22": { left: 835, top: 98, width: 672, height: 715 },
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
    // smooth ramp: fully transparent below 140, opaque above 300
    let a
    if (bright <= 140) a = 0
    else if (bright >= 300) a = 255
    else a = Math.round(((bright - 140) / 160) * 255)
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
