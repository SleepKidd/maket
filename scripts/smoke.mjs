import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { RELATIONSHIP, SCENES } from "../src/data/story.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = path => readFileSync(resolve(root, path), "utf8");
const files = [
  "app.js", "src/data/story.js", "src/webgl/world.js",
  "src/core/quality.js", "src/core/audio.js", "src/core/input.js",
  "src/visual/light-effects.js"
];
for (const path of files) {
  assert(existsSync(resolve(root, path)), `Missing ${path}`);
  execFileSync(process.execPath, ["--check", resolve(root, path)], {stdio:"pipe"});
}
const html = read("index.html");
assert(html.includes("light.css"), "Light theme must be loaded");
assert(html.includes("app.js"), "Application entry must be loaded");
const css = read("light.css");
assert(css.includes(".prologue-scene"), "Real prologue selector missing");
assert(css.includes("@media (max-width:480px)"), "Mobile layout styles missing");
assert(css.includes("prefers-reduced-motion"), "Motion accessibility missing");
assert(css.includes(".floating-petals"), "Decorative petals missing");
const app = read("app.js");
for (const match of app.matchAll(/from\s+"(\.\/[^"]+)"/g)) {
  const path = match[1].replace(/^\.\//, "");
  assert(existsSync(resolve(root, path)), `Broken import: ${path}`);
}
assert(app.includes("enhanceStory()"), "Decorative enhancement not initialized");
assert(app.includes("await createBotanicalWorld"), "WebGL error handling must be async");
const webgl = read("src/webgl/world.js");
assert(webgl.includes("InstancedMesh"), "Flowers should be instanced");
assert(webgl.includes("petalGeometry"), "Curved petal geometry missing");
assert(!webgl.includes("SphereGeometry(.23"), "Old sphere flowers were not replaced");
const start = RELATIONSHIP.startDate.split(".").reverse().join("-");
const end = RELATIONSHIP.anniversaryDate.split(".").reverse().join("-");
const days = Math.round((Date.parse(end + "T00:00:00Z") - Date.parse(start + "T00:00:00Z")) / 86400000);
assert.equal(days, RELATIONSHIP.days, "Anniversary date and number of days disagree");
assert.equal(SCENES.length, 26, "Expected 26 story scenes");
assert.equal(new Set(SCENES.map(s => s.id)).size, SCENES.length, "Duplicate scene IDs");
assert(SCENES.every(s => s.stage >= 0 && s.stage <= 1), "Invalid scene stage");
for (const scene of SCENES) assert(html.includes("id=\"story\""), "Story mount missing");
console.log("MILANA smoke checks passed: JS syntax, imports, light styles, effects, scenes and anniversary date.");
