import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const sourcePath = path.join(root, "public/images/brand/logo.png");
const brand = path.join(root, "public/brand");
const ivory = { r: 250, g: 249, b: 245 };
const sunken = { r: 240, g: 238, b: 230 };
const night = { r: 18, g: 18, b: 17 };
mkdirSync(brand, { recursive: true });

const source = sharp(sourcePath).ensureAlpha();
const { data, info } = await source.raw().toBuffer({ resolveWithObject: true });
const pixels = Buffer.from(data);
const { width, height, channels } = info;
const seen = new Uint8Array(width * height);
const stack = [];
const isNearWhite = (index) => pixels[index] > 246 && pixels[index + 1] > 246 && pixels[index + 2] > 246;

for (let x = 0; x < width; x += 1) stack.push(x, (height - 1) * width + x);
for (let y = 0; y < height; y += 1) stack.push(y * width, y * width + (width - 1));
while (stack.length) {
  const point = stack.pop();
  if (seen[point]) continue;
  seen[point] = 1;
  const index = point * channels;
  if (!isNearWhite(index)) continue;
  pixels[index + 3] = 0;
  const x = point % width;
  const y = (point - x) / width;
  if (x > 0) stack.push(point - 1);
  if (x + 1 < width) stack.push(point + 1);
  if (y > 0) stack.push(point - width);
  if (y + 1 < height) stack.push(point + width);
}
for (let pass = 0; pass < 2; pass += 1) {
  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const index = (y * width + x) * channels;
      const alpha = pixels[index + 3];
      if (alpha === 0 || alpha === 255) continue;
      if (pixels[index] < 238 || pixels[index + 1] < 238 || pixels[index + 2] < 238) continue;
      const neighbors = [index - 4, index + 4, index - width * 4, index + width * 4];
      if (neighbors.some((neighbor) => pixels[neighbor + 3] === 0)) pixels[index + 3] = 0;
    }
  }
}

const transparentPath = path.join(brand, "logo-transparent.png");
await sharp(pixels, { raw: { width, height, channels } }).png().toFile(transparentPath);

function drift(composited, background) {
  let max = 0;
  let count = 0;
  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i + 3] !== 0) continue;
    const delta = Math.max(
      Math.abs(composited[i] - background.r),
      Math.abs(composited[i + 1] - background.g),
      Math.abs(composited[i + 2] - background.b),
    );
    if (delta > max) max = delta;
    if (delta > 2) count += 1;
  }
  return { max, count };
}

async function composite(background) {
  return sharp({ create: { width, height, channels: 4, background } }).composite([{ input: transparentPath }]).raw().toBuffer();
}

async function icon(size, filename) {
  const mark = Math.round(size * 0.68);
  const resized = await sharp(transparentPath).resize(mark, mark).png().toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: ivory } })
    .composite([{ input: resized, gravity: "centre" }])
    .png()
    .toFile(path.join(brand, filename));
}

await icon(32, "favicon-32.png");
await icon(180, "apple-touch-180.png");
await icon(512, "icon-512.png");
await sharp(transparentPath).resize(72, 72).png({ compressionLevel: 9 }).toFile(path.join(brand, "logo-nav.png"));

const png = readFileSync(path.join(brand, "favicon-32.png"));
const header = Buffer.alloc(22);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header.writeUInt8(32, 6);
header.writeUInt8(32, 7);
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(png.length, 14);
header.writeUInt32LE(22, 18);
writeFileSync(path.join(root, "src/app/favicon.ico"), Buffer.concat([header, png]));

const fontPath = path.join(process.env.TEMP ?? "/tmp", "70arc-newsreader.ttf");
const fontResponse = await fetch("https://github.com/google/fonts/raw/main/ofl/newsreader/Newsreader%5Bopsz%2Cwght%5D.ttf");
if (!fontResponse.ok) throw new Error(`Font download failed: ${fontResponse.status}`);
writeFileSync(fontPath, Buffer.from(await fontResponse.arrayBuffer()));
const fontBytes = readFileSync(fontPath);
const { chromium } = await import("playwright");
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.route("http://assets.local/**", async (route) => {
  const url = route.request().url();
  if (url.endsWith(".ttf")) {
    await route.fulfill({ body: fontBytes, contentType: "font/ttf" });
    return;
  }
  await route.fulfill({ path: transparentPath, contentType: "image/png" });
});
await page.setContent(`<!doctype html><html><head><meta charset="utf-8" />
<style>
@font-face { font-family: Newsreader; src: url("http://assets.local/newsreader.ttf") format("truetype"); font-weight: 100 900; }
html, body { margin: 0; width: 1200px; height: 630px; background: #FAF9F5; }
body { display: flex; flex-direction: column; align-items: center; justify-content: center; }
img { width: 280px; height: 280px; }
p { margin: 24px 0 0; font-family: Newsreader, Georgia, serif; font-size: 92px; font-weight: 400; letter-spacing: -0.02em; color: #141413; }
</style></head><body><img src="http://assets.local/logo.png" alt="" /><p>70arc</p></body></html>`, { waitUntil: "networkidle" });
const fontUsed = await page.evaluate(async () => { await document.fonts.ready; return document.fonts.check("400 92px Newsreader"); });
writeFileSync(path.join(root, "public/og.jpg"), await page.screenshot({ type: "jpeg", quality: 90 }));
await browser.close();

const onIvory = await composite(ivory);
const onSunken = await composite(sunken);
const onNight = await composite(night);
console.log(JSON.stringify({
  size: [width, height],
  ivory: drift(onIvory, ivory),
  sunken: drift(onSunken, sunken),
  night: drift(onNight, night),
  fontUsed,
}));
