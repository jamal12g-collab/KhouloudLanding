import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const fontCacheDir = path.join(process.cwd(), ".font-cache");
mkdirSync(fontCacheDir, { recursive: true });
process.env.FONTCONFIG_CACHE = fontCacheDir;
process.env.NODE_PATH = "C:/Users/jamal/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/.pnpm/sharp@0.34.5/node_modules";
require("node:module").Module._initPaths();
const sharp = require("C:/Users/jamal/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp");

const outDir = path.join(process.cwd(), "public", "images");
mkdirSync(outDir, { recursive: true });

const assets = [
  ["hero", "Kholoud Khaled", "Bridal Makeup Artist", "#5c2338", "#e8b7a6", "#0f6f5f"],
  ["royal-bridal", "Royal Bridal", "Luminous skin - refined eyes", "#4b1028", "#f6dfb8", "#8d4d65"],
  ["engagement-soft-glam", "Engagement Glam", "Soft romance - camera ready", "#283d3b", "#e8b7a6", "#5c2338"],
  ["evening-queen", "Evening Queen", "Formal glam - elegant finish", "#1f1635", "#f6dfb8", "#704c8a"],
  ["natural-glam", "Natural Glam", "Fresh beauty - no-lens look", "#21433d", "#d8efe7", "#e8b7a6"],
  ["bride-sisters", "Bride + Sisters", "Coordinated bridal suite", "#402033", "#f3c7b8", "#b4738a"],
  ["hair-veil", "Hair & Veil", "Final styling coordination", "#2e2438", "#f7d8ad", "#6f8f8b"],
  ["consultation", "Bridal Trial", "Skin prep - style planning", "#341c29", "#e8b7a6", "#6f3d4e"],
  ["studio-booking", "Studio Booking", "Event-ready appointment", "#132d2c", "#f6dfb8", "#476e69"],
  ["mobile-bridal", "Mobile Bridal", "Location preparation", "#3b1733", "#f1c4d4", "#705184"]
];

function escapeXml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function svg(title, subtitle, bg, accent, secondary) {
  const safeTitle = escapeXml(title);
  const safeSubtitle = escapeXml(subtitle.toUpperCase());
  return `
  <svg width="1400" height="1700" viewBox="0 0 1400 1700" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
        <stop stop-color="${bg}" offset="0"/>
        <stop stop-color="#100b12" offset="1"/>
      </linearGradient>
      <linearGradient id="metal" x1="0" x2="1" y1="0" y2="1">
        <stop stop-color="${accent}" offset="0"/>
        <stop stop-color="#fff8f3" offset=".55"/>
        <stop stop-color="${secondary}" offset="1"/>
      </linearGradient>
      <filter id="soft"><feGaussianBlur stdDeviation="24"/></filter>
    </defs>
    <rect width="1400" height="1700" fill="url(#bg)"/>
    <path d="M0 1170 C280 980 470 1290 760 1110 C1040 935 1170 1020 1400 850 L1400 1700 L0 1700 Z" fill="${secondary}" opacity=".20"/>
    <path d="M100 220 C320 70 560 110 710 300 C850 480 800 730 620 860 C430 1000 170 930 70 710 C-30 500 -70 335 100 220Z" fill="${accent}" opacity=".12" filter="url(#soft)"/>
    <g opacity=".78" stroke="url(#metal)" stroke-width="8" stroke-linecap="round" fill="none">
      <path d="M450 1110 L930 480"/>
      <path d="M510 1160 L1010 540"/>
      <path d="M840 530 C920 450 1040 440 1115 500 C1060 610 960 650 870 610"/>
      <path d="M360 1060 C470 1000 580 1030 650 1120 C530 1190 430 1180 360 1060Z"/>
      <path d="M830 1060 C920 970 1080 970 1170 1070 C1070 1170 920 1160 830 1060Z"/>
    </g>
    <circle cx="700" cy="770" r="255" fill="none" stroke="${accent}" stroke-width="2" opacity=".25"/>
    <circle cx="700" cy="770" r="178" fill="none" stroke="#fff8f3" stroke-width="2" opacity=".15"/>
    <text x="90" y="1380" fill="#fff8f3" font-family="Georgia, serif" font-size="118" font-weight="700">${safeTitle}</text>
    <text x="96" y="1465" fill="${accent}" font-family="Arial, sans-serif" font-size="34" font-weight="700" letter-spacing="8">${safeSubtitle}</text>
  </svg>`;
}

for (const [name, title, subtitle, bg, accent, secondary] of assets) {
  await sharp(Buffer.from(svg(title, subtitle, bg, accent, secondary))).png({ quality: 92 }).toFile(path.join(outDir, `${name}.png`));
}

console.log(`Generated ${assets.length} local PNG assets in public/images.`);
