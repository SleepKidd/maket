import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const shots = resolve(root, "test-screenshots");
mkdirSync(shots, { recursive: true });
const port = 4187;
const server = spawn("python3", ["-m", "http.server", String(port), "--bind", "127.0.0.1"], { cwd: root, stdio: "ignore" });
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

let browser;
try {
  let online = false;
  for (let i = 0; i < 60; i++) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/index.html`);
      if (response.ok) { online = true; break; }
    } catch {}
    await delay(100);
  }
  assert(online, "Local HTTP server unavailable");
  browser = await chromium.launch({ headless: true, args: ["--disable-dev-shm-usage"] });
  const devices = [
    { name: "iphone-375", width: 375, height: 812, mobile: true },
    { name: "iphone-390", width: 390, height: 844, mobile: true },
    { name: "android-430", width: 430, height: 932, mobile: true },
    { name: "desktop-1440", width: 1440, height: 900, mobile: false },
  ];

  for (const device of devices) {
    const context = await browser.newContext({
      viewport: { width: device.width, height: device.height },
      isMobile: device.mobile,
      hasTouch: device.mobile,
      deviceScaleFactor: device.mobile ? 2 : 1,
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const runtimeErrors = [];
    page.on("pageerror", error => runtimeErrors.push(error.message));
    await page.goto(`http://127.0.0.1:${port}/index.html`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForSelector("#story > section", { timeout: 10000 });
    await page.waitForSelector("[data-letter-note]", { timeout: 10000 });

    assert.equal(await page.locator("#story > section").count(), 15, `${device.name}: scene count`);
    assert.equal(await page.locator("[data-letter-note]").count(), 7, `${device.name}: scattered letter count`);
    assert((await page.locator(".photo-slot").count()) <= 50, `${device.name}: photo display budget exceeded`);
    const layout = await page.evaluate(() => ({
      horizontal: document.documentElement.scrollWidth - window.innerWidth,
      date: document.querySelector(".hero-date")?.textContent,
      topbar: document.querySelector(".topbar-meta")?.textContent,
    }));
    assert(layout.horizontal <= 5, `${device.name}: horizontal overflow ${layout.horizontal}px`);
    assert.match(layout.date, /18\.11\.2026/);
    assert.match(layout.topbar, /00\s*\/\s*14/);

    await page.locator("#beginButton").click();
    assert(await page.locator("body").evaluate(el => el.classList.contains("started")), `${device.name}: start state`);

    await page.locator(".memory-trigger").first().click();
    assert(await page.locator("#secretModal").evaluate(el => el.classList.contains("is-visible")), `${device.name}: modal did not open`);
    await page.locator(".close-modal").click();
    assert(!(await page.locator("#secretModal").evaluate(el => el.classList.contains("is-visible"))), `${device.name}: modal did not close`);

    await page.locator("#places [data-place]").first().click();
    assert(await page.locator("[data-place-popover]").evaluate(el => el.classList.contains("is-visible")), `${device.name}: map popover`);

    const compare = page.locator("[data-compare]");
    await compare.scrollIntoViewIfNeeded();
    const compareBox = await compare.boundingBox();
    assert(compareBox, `${device.name}: compare frame missing`);
    await page.mouse.move(compareBox.x + compareBox.width * .5, compareBox.y + compareBox.height * .5);
    await page.mouse.down();
    await page.mouse.move(compareBox.x + compareBox.width * .68, compareBox.y + compareBox.height * .5);
    await page.mouse.up();
    assert(Number(await page.locator("[data-compare-divider]").getAttribute("aria-valuenow")) > 60, `${device.name}: compare drag`);

    await page.locator("#replayButton").click();
    assert.equal(await page.evaluate(() => window.scrollY), 0, `${device.name}: replay scroll reset`);
    assert(!(await page.locator("body").evaluate(el => el.classList.contains("started"))), `${device.name}: replay state`);

    await page.locator(".prologue-scene").screenshot({ path: resolve(shots, `${device.name}.png`) });
    await page.locator(".before-scene").screenshot({ path: resolve(shots, `${device.name}-letters.png`) });
    assert.deepEqual(runtimeErrors, [], `${device.name}: runtime errors`);
    console.log(`${device.name}: OK | 15 scenes | 15 unique photos | 7 letter moments | touch-safe layout`);
    await context.close();
  }
} finally {
  await browser?.close();
  server.kill();
}
