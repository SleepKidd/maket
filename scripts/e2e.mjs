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
const server = spawn("python3", ["-m", "http.server", String(port), "--bind", "127.0.0.1"], {
  cwd: root, stdio: "ignore"
});
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

let browser;
try {
  let online = false;
  for (let i=0; i<60; i++) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/index.html`);
      if (response.ok) { online = true; break; }
    } catch {}
    await delay(100);
  }
  assert(online, "Local HTTP server unavailable");
  browser = await chromium.launch({ headless: true, args: ["--disable-dev-shm-usage"] });
  const devices = [
    { name:"iphone-375", width:375, height:812, mobile:true },
    { name:"iphone-390", width:390, height:844, mobile:true },
    { name:"android-430", width:430, height:932, mobile:true },
    { name:"desktop-1440", width:1440, height:900, mobile:false }
  ];
  for (const d of devices) {
    const context = await browser.newContext({
      viewport:{width:d.width,height:d.height},
      isMobile:d.mobile,hasTouch:d.mobile,
      deviceScaleFactor:d.mobile?2:1,
      reducedMotion:"reduce" // deterministic visual assertions; animations still work in normal mode.
    });
    const page = await context.newPage();
    const runtimeErrors = [];
    page.on("pageerror",error=>runtimeErrors.push(error.message));
    await page.goto(`http://127.0.0.1:${port}/index.html`,{waitUntil:"domcontentloaded",timeout:30000});
    await page.waitForSelector("[data-open-letter]",{timeout:10000});
    assert.equal(await page.locator("#story > section").count(),30, `${d.name}: scene count`);
    assert.equal(await page.locator("[data-open-letter]").count(),7, `${d.name}: letter count`);
    const sceneCheck = await page.evaluate(() => ({
      bg:getComputedStyle(document.body).backgroundColor,
      horizontal:document.documentElement.scrollWidth-window.innerWidth,
      initialized:!!document.getElementById("keepsakeDialog")
    }));
    assert(sceneCheck.initialized, `${d.name}: letter dialog initialized`);
    assert(sceneCheck.horizontal <= 5,`${d.name}: horizontal overflow ${sceneCheck.horizontal}px`);
    assert(sceneCheck.bg!=="rgb(7, 7, 8)",`${d.name}: dark design not replaced`);

    await page.locator('[data-open-letter="0"]').click();
    assert(await page.locator("dialog.keepsake-dialog").evaluate(el=>el.open), `${d.name}: dialog did not open`);
    assert((await page.locator("[data-letter-body] p").count())>=3, `${d.name}: empty letter`);
    await page.locator("[data-letter-next]").click();
    assert.match(await page.locator("[data-letter-index]").textContent(),/02 \/ 07/);
    await page.locator("[data-close-letter]").click();
    assert(!(await page.locator("dialog.keepsake-dialog").evaluate(el=>el.open)), `${d.name}: dialog did not close`);

    await page.locator('[data-daypart="night"]').click();
    assert.match(await page.locator("[data-day-title]").textContent(),/Спокойной ночи/);
    await page.locator('[data-daypart="morning"]').click();
    assert.match(await page.locator("[data-day-title]").textContent(),/Доброе утро/);

    await page.locator('[data-tender-index="4"]').click();
    assert.match(await page.locator("[data-tender-heading]").textContent(),/лучик солнца/);
    await page.locator(".promise summary").first().click();
    assert(await page.locator(".promise").first().evaluate(el=>el.open),`${d.name}: promise accordion not opening`);

    await page.locator(".prologue-scene").screenshot({path:resolve(shots,d.name+".png")});
    await page.locator(".letters-scene").screenshot({path:resolve(shots,d.name+"-letters.png")});
    await page.locator(".tender-scene").screenshot({path:resolve(shots,d.name+"-tender.png")});
    assert.deepEqual(runtimeErrors,[],`${d.name}: runtime errors`);
    console.log(`${d.name}: OK | 30 scenes | 7 envelopes | day/night | tender notes | promises | no horizontal overflow`);
    await context.close();
  }
} finally {
  await browser?.close();
  server.kill();
}