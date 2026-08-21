import path from "node:path"
import { createRequire } from "node:module"
const require = createRequire(import.meta.url)
const sharp = require(path.resolve("node_modules/.pnpm/sharp@0.34.5/node_modules/sharp"))

const pages = process.argv.slice(2)
if (pages.length === 0) pages.push("20", "21", "22")

const W = 1920, H = 1080
for (const p of pages) {
  const file = `public/case-studies/bank-of-daniel/page-${p}.jpg`
  let lines = ""
  for (let f = 0; f <= 10; f++) {
    const x = Math.round((f / 10) * W)
    const y = Math.round((f / 10) * H)
    lines += `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="red" stroke-width="2"/>`
    lines += `<text x="${x + 4}" y="28" fill="yellow" font-size="26" font-family="monospace">${f * 10}</text>`
    lines += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="red" stroke-width="2"/>`
    lines += `<text x="4" y="${y + 26}" fill="cyan" font-size="26" font-family="monospace">${f * 10}</text>`
  }
  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">${lines}</svg>`
  await sharp(file)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .png()
    .toFile(`/tmp/agent-browser/grid-${p}.png`)
  console.log(`wrote /tmp/agent-browser/grid-${p}.png`)
}
