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
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true })
  const ch = info.channels

  // background from top-left block
  let br = 0, bg = 0, bb = 0, n = 0
  for (let y = 0; y < 20; y++)
    for (let x = 0; x < 20; x++) {
      const i = (y * W + x) * ch
      br += data[i]; bg += data[i + 1]; bb += data[i + 2]; n++
    }
  br /= n; bg /= n; bb /= n

  const isContent = (x, y) => {
    const i = (y * W + x) * ch
    const d = Math.abs(data[i] - br) + Math.abs(data[i + 1] - bg) + Math.abs(data[i + 2] - bb)
    const bright = data[i] + data[i + 1] + data[i + 2]
    return d > 100 && bright > 300
  }

  const step = 2
  // column density (vertical extent of content per column)
  const colTop = new Array(W).fill(-1)
  const colBot = new Array(W).fill(-1)
  const colCount = new Array(W).fill(0)
  for (let x = 0; x < W; x += step) {
    for (let y = 0; y < H; y += step) {
      if (isContent(x, y)) {
        if (colTop[x] < 0) colTop[x] = y
        colBot[x] = y
        colCount[x]++
      }
    }
  }
  // phone columns: vertical extent tall (> 0.55*H) — text lines are short bands
  const tall = []
  for (let x = 0; x < W; x += step) {
    const ext = colBot[x] - colTop[x]
    if (ext > 0.5 * H && colCount[x] > 40) tall.push(x)
  }
  const minX = tall.length ? tall[0] : 0
  const maxX = tall.length ? tall[tall.length - 1] : W
  // vertical box within phone columns
  let minY = H, maxY = 0
  for (const x of tall) {
    if (colTop[x] >= 0 && colTop[x] < minY) minY = colTop[x]
    if (colBot[x] > maxY) maxY = colBot[x]
  }
  console.log(
    JSON.stringify({
      page: p, W, H,
      box: { minX, minY, maxX, maxY, w: maxX - minX, h: maxY - minY },
      frac: { x: +(minX / W).toFixed(3), y: +(minY / H).toFixed(3), r: +(maxX / W).toFixed(3), b: +(maxY / H).toFixed(3) },
    }),
  )
}
