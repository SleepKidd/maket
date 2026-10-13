import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { RELATIONSHIP, SCENES } from "../src/data/story.js";
import { LOVE_LETTERS, TENDER_NOTES, DAY_NIGHT_LETTERS, PROMISES, FINAL_LETTER } from "../src/data/love-letters.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = path => readFileSync(resolve(root, path), "utf8");
const files = [
  "app.js", "src/data/story.js", "src/webgl/world.js",
  "src/core/quality.js", "src/core/audio.js", "src/core/input.js",
  "src/visual/light-effects.js", "src/data/love-letters.js", "src/interactive/love-experience.js"
];
for (const path of files) {
  assert(existsSync(resolve(root, path)), `Missing ${path}`);
  execFileSync(process.execPath, ["--check", resolve(root, path)], {stdio:"pipe"});
}
const html = read("index.html");
assert(html.includes("light.css"), "Light theme must be loaded");
assert(html.includes("love.css"), "Love letter styles missing");
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
assert(app.includes("initLoveExperience()"), "Letter interaction initialization missing");
assert(app.includes('this.sections = $(".scene")'), "Scene manager must iterate a list, not one element");
const webgl = read("src/webgl/world.js");
assert(webgl.includes("InstancedMesh"), "Flowers should be instanced");
assert(webgl.includes("petalGeometry"), "Curved petal geometry missing");
assert(!webgl.includes("SphereGeometry(.23"), "Old sphere flowers were not replaced");
const start = RELATIONSHIP.startDate.split(".").reverse().join("-");
const end = RELATIONSHIP.anniversaryDate.split(".").reverse().join("-");
const days = Math.round((Date.parse(end + "T00:00:00Z") - Date.parse(start + "T00:00:00Z")) / 86400000);
assert.equal(days, RELATIONSHIP.days, "Anniversary date and number of days disagree");
assert.equal(SCENES.length, 30, "Expected 30 story scenes");
assert.equal(LOVE_LETTERS.length, 7, "All seven heartfelt letters required");
assert(TENDER_NOTES.length >= 12, "All tenderness messages required");
assert(PROMISES.length >= 6, "Promise list incomplete");
assert(FINAL_LETTER.paragraphs.length >= 7, "Final long letter incomplete");
assert(DAY_NIGHT_LETTERS.morning.paragraphs.length > 0 && DAY_NIGHT_LETTERS.night.paragraphs.length > 0);
for(const kind of ["letters","tender","daynight","vows"]){
  assert(SCENES.some(scene => scene.kind === kind), `Missing interactive chapter: ${kind}`);
  assert(app.includes(`case "${kind}":`), `Renderer missing chapter: ${kind}`);
}
assert.equal(SCENES.find(scene => scene.id === "half-year").number, "181", "Six calendar months from 18 Nov 2024 is 181 days");
assert.equal(new Set(SCENES.map(s => s.id)).size, SCENES.length, "Duplicate scene IDs");
assert(SCENES.every(s => s.stage >= 0 && s.stage <= 1), "Invalid scene stage");
assert(SCENES.every((scene,index)=> scene.index === String(index).padStart(2,"0")), "Chapter index drift");
for (const scene of SCENES) assert(html.includes("id=\"story\""), "Story mount missing");
console.log("MILANA smoke checks passed: 30 scenes, 7 letters, 12 notes, vows, selectors, JS, styles and dates.");
