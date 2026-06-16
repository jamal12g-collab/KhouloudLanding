import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
process.env.NODE_PATH = "C:/Users/jamal/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/.pnpm/playwright-core@1.60.0/node_modules";
require("node:module").Module._initPaths();
const { chromium } = require("C:/Users/jamal/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const port = 3000;
const baseUrl = `http://localhost:${port}`;
const screenshotDir = path.join(process.cwd(), "test-results");
mkdirSync(screenshotDir, { recursive: true });
const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(port)], {
  cwd: process.cwd(),
  env: { ...process.env, PATH: `${process.execPath.replace(/\\node\.exe$/i, "")};${process.env.PATH || ""}` },
  stdio: ["ignore", "pipe", "pipe"]
});

let logs = "";
child.stdout.on("data", (chunk) => {
  logs += chunk.toString();
});
child.stderr.on("data", (chunk) => {
  logs += chunk.toString();
});

async function waitForServer() {
  for (let index = 0; index < 60; index += 1) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  throw new Error(logs);
}

try {
  await waitForServer();
  const browser = await chromium.launch({ headless: true });
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  await desktop.goto(baseUrl, { waitUntil: "networkidle" });
  await desktop.getByRole("heading", { level: 1, name: /Kholoud Khaled Makeup Artist/i }).waitFor();
  await desktop.screenshot({ path: path.join(screenshotDir, "home-desktop.png"), fullPage: true });

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  await mobile.goto(`${baseUrl}/booking`, { waitUntil: "networkidle" });
  await mobile.getByRole("heading", { name: /Reserve a beauty appointment/i }).waitFor();
  await mobile.screenshot({ path: path.join(screenshotDir, "booking-mobile.png"), fullPage: true });
  await browser.close();
  console.log("Visual test passed: desktop home and mobile booking rendered. Screenshots saved in test-results.");
} finally {
  child.kill();
}
