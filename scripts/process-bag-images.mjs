/**
 * Process bag images: remove white background, add very dark grey BG,
 * and resize all to the same size for a unified look.
 *
 * Usage: Put your bag-1.png … bag-5.png in Fee/public/bag/ then run:
 *   node scripts/process-bag-images.mjs
 *
 * Or: npm run process-bag-images
 */

import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FEE_ROOT = path.join(__dirname, "..");
const BAG_DIR = path.join(FEE_ROOT, "public", "bag");

const TARGET_SIZE = 512;
const WHITE_THRESHOLD = 228; // pixels with r,g,b all >= this become transparent (lower = remove more off-white borders)
const DARK_GREY = { r: 18, g: 18, b: 18 }; // #121212 very dark grey

const BAG_FILES = [
  "bag-1.png",
  "bag-2.png",
  "bag-3.png",
  "bag-4.png",
  "bag-5.png",
  "bag-6.png",
];

if (!fs.existsSync(BAG_DIR)) {
  fs.mkdirSync(BAG_DIR, { recursive: true });
  console.log("Created public/bag/. Add your bag-1.png … bag-5.png there and run this script again.");
  process.exit(0);
}

async function processImage(fileName) {
  const filePath = path.join(BAG_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    console.warn(`Skip ${fileName}: file not found`);
    return;
  }

  const image = sharp(filePath);
  const { data, info } = await image.raw().ensureAlpha().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r >= WHITE_THRESHOLD && g >= WHITE_THRESHOLD && b >= WHITE_THRESHOLD) {
      data[i + 3] = 0;
    }
  }

  const withTransparency = sharp(data, {
    raw: { width, height, channels: 4 },
  });

  const outPath = path.join(BAG_DIR, fileName);
  await withTransparency
    .flatten({ background: DARK_GREY })
    .resize(TARGET_SIZE, TARGET_SIZE, {
      fit: "contain",
      background: DARK_GREY,
    })
    .png()
    .toFile(outPath);

  console.log(`Processed ${fileName} → ${TARGET_SIZE}x${TARGET_SIZE}, dark grey BG`);
}

async function main() {
  console.log("Processing bag images in Fee/public/bag/ ...");
  for (const file of BAG_FILES) {
    await processImage(file);
  }
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
