import path from "node:path"
import { createRequire } from "node:module"
const require = createRequire(import.meta.url)
const sharp = require(path.resolve("node_modules/.pnpm/sharp@0.34.5/node_modules/sharp"))

// Deterministic: the phone compositions live in the right portion of every slide,
// clear of the title/body copy on the left. Detect the bright phone bbox there,
// then flood-fill the near-black canvas to transparent from the crop edges so the
// dark UI text INSIDE the white cards is preserved.
const pages = process.argv.slice(2)
const list = pages.length ? pages : ["20", "21", "22"]

const LEFT_START = 0.47 // ignore everything left of this (slide text lives there)
const CONTENT = 190 // brightness sum (0-765) that counts as phone content
const BG = 135 // brightness sum at/below which a pixel is background canvas

for (const p of list) {
  const src = `public/case-studies/bank-of-daniel/page-${p}.jpg`
  const base = sharp(src)
  const meta = await base.metadata()
  const W = meta.width
  const H = meta.height
  const { data, info } = await base.ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const ch = info.channels
  const bright = (x, y) => {
    const i = (y * W + x) * ch
    return data[i] + data[i + 1] + data[i + 2]
  }

  // 1) bounding box of bright content in the right region
  const x0 = Math.floor(W * LEFT_START)
  let minX = W, minY = H, maxX = 0, maxY = 0
  for (let y = 0; y < H; y++) {
    for (let x = x0; x < W; x++) {
      if (bright(x, y) >= CONTENT) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
  const pad = 10
  minX = Math.max(0, minX - pad)
  minY = Math.max(0, minY - pad)
  maxX = Math.min(W - 1, maxX + pad)
  maxY = Math.min(H - 1, maxY + pad)
  const cw = maxX - minX + 1
  const chh = maxY - minY + 1

  // 2) crop region into its own buffer
  const region = await sharp(data, { raw: { width: W, height: H, channels: ch } })
    .extract({ left: minX, top: minY, width: cw, height: chh })
    .raw()
    .toBuffer()

  // 3) flood fill transparency from the border over connected near-black canvas
  const idx = (x, y) => (y * cw + x) * ch
  const b = (x, y) => region[idx(x, y)] + region[idx(x, y) + 1] + region[idx(x, y) + 2]
  const visited = new Uint8Array(cw * chh)
  const stack = []
  for (let x = 0; x < cw; x++) {
    stack.push([x, 0], [x, chh - 1])
  }
  for (let y = 0; y < chh; y++) {
    stack.push([0, y], [cw - 1, y])
  }
  while (stack.length) {
    const [x, y] = stack.pop()
    if (x < 0 || y < 0 || x >= cw || y >= chh) continue
    const v = y * cw + x
    if (visited[v]) continue
    visited[v] = 1
    if (b(x, y) > BG) continue // hit phone/card edge — stop
    region[idx(x, y) + 3] = 0 // background → transparent
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1])
  }

  const out = `public/images/bank-of-daniel/phone-${p}.png`
  await sharp(region, { raw: { width: cw, height: chh, channels: ch } }).png().toFile(out)
  // review composite on white
  await sharp({ create: { width: cw, height: chh, channels: 3, background: "#ffffff" } })
    .composite([{ input: await sharp(region, { raw: { width: cw, height: chh, channels: ch } }).png().toBuffer() }])
    .png()
    .toFile(`/tmp/agent-browser/rev-${p}.png`)
  console.log(`wrote ${out} (${cw}x${chh}) from bbox [${minX},${minY} ${maxX},${maxY}]`)
}
