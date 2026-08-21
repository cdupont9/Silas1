import path from "node:path"
import { createRequire } from "node:module"
const require = createRequire(import.meta.url)
const sharp = require(path.resolve("node_modules/.pnpm/sharp@0.34.5/node_modules/sharp"))

const pages = process.argv.slice(2)
if (pages.length === 0) pages.push("20", "21", "22")

for (const p of pages) {
  const file = `public/case-studies/bank-of-daniel/page-${p}.jpg`
  const img = sharp(file)
  const meta = await img.metadata()
  const W = meta.width
  const H = meta.height
  const { data, info } = await img
    .raw()
    .toBuffer({ resolveWithObject: true })
  const ch = info.channels

  // sample background color from top-left 20x20 block
  let br = 0, bg = 0, bb = 0, n = 0
  for (let y = 0; y < 20; y++) {
    for (let x = 0; x < 20; x++) {
      const i = (y * W + x) * ch
      br += data[i]; bg += data[i + 1]; bb += data[i + 2]; n++
    }
  }
  br /= n; bg /= n; bb /= n

  // find bounding box of pixels that differ strongly from bg (the phone screenshots)
  // scan whole image; record min/max x/y of "content" pixels
  let minX = W, minY = H, maxX = 0, maxY = 0
  const step = 2
  for (let y = 0; y < H; y += step) {
    for (let x = 0; x < W; x += step) {
      const i = (y * W + x) * ch
      const d =
        Math.abs(data[i] - br) +
        Math.abs(data[i + 1] - bg) +
        Math.abs(data[i + 2] - bb)
      // light screenshot pixels: high brightness AND far from purple bg
      const bright = data[i] + data[i + 1] + data[i + 2]
      if (d > 120 && bright > 360) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
  console.log(
    JSON.stringify({
      page: p,
      W, H,
      bg: [Math.round(br), Math.round(bg), Math.round(bb)],
      box: { minX, minY, maxX, maxY, w: maxX - minX, h: maxY - minY },
      frac: {
        x: +(minX / W).toFixed(3),
        y: +(minY / H).toFixed(3),
        r: +(maxX / W).toFixed(3),
        b: +(maxY / H).toFixed(3),
      },
    }),
  )
}
