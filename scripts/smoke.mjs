import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { RELATIONSHIP, SCENES, PHOTO_LIBRARY, PHOTO_PIPELINE, LETTER_MOMENTS } from "../src/data/story.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = path => readFileSync(resolve(root, path), "utf8");
const files = [
  "index.html", "styles.css", "app.js", "src/data/story.js", "src/webgl/world.js",
  "src/core/quality.js", "src/core/audio.js", "src/core/input.js",
];

for (const path of files) {
  assert(existsSync(resolve(root, path)), `Missing ${path}`);
  if (path.endsWith(".js")) execFileSync(process.execPath, ["--check", resolve(root, path)], { stdio: "pipe" });
}

const html = read("index.html");
const css = read("styles.css");
const app = read("app.js");
const webgl = read("src/webgl/world.js");

assert(html.includes('id="story"'), "Story mount missing");
assert(html.includes('type="module"'), "ES module entry missing");
assert(html.includes("styles.css"), "Stylesheet missing");
assert(css.includes(".scene"), "Scene system missing");
assert(css.includes("@media (min-width: 760px)"), "Desktop composition missing");
assert(css.includes(".letter-note"), "Scattered letter treatment missing");
assert(css.includes("prefers-reduced-motion"), "Motion accessibility missing");
assert(app.includes("new Scheduler"), "Single scheduler missing");
assert(app.includes("letterNote"), "Letter composition missing");
assert(app.includes("createBotanicalWorld"), "WebGL world missing");
assert(webgl.includes("InstancedMesh"), "Instanced botanical geometry missing");
assert(webgl.includes("createHeartGeometry"), "3D heart geometry missing");
assert(webgl.includes("setScrollProgress"), "Scroll-driven heart rotation missing");
assert(!webgl.includes("SphereGeometry(.23"), "Old primitive flower geometry remains");

const start = RELATIONSHIP.startDate.split(".").reverse().join("-");
const end = RELATIONSHIP.anniversaryDate.split(".").reverse().join("-");
const days = Math.round((Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86400000);
assert.equal(days, RELATIONSHIP.days, "Anniversary date and day count disagree");
assert.equal(RELATIONSHIP.startDate, "18.11.2024");
assert.equal(RELATIONSHIP.anniversaryDate, "18.11.2026");
assert.equal(RELATIONSHIP.days, 730);
assert.equal(SCENES.length, 26, "Expected 26 story scenes");
assert.equal(PHOTO_LIBRARY.length, 15, "The compact archive should contain 15 unique photos");
assert.equal(PHOTO_PIPELINE.uniquePhotos, 15);
assert.equal(LETTER_MOMENTS.length, 7, "Expected seven scattered letter moments");
assert.equal(new Set(SCENES.map(scene => scene.id)).size, SCENES.length, "Duplicate scene IDs");
assert(SCENES.every((scene, index) => scene.index === String(index).padStart(2, "0")), "Chapter index drift");
assert(SCENES.every(scene => scene.stage >= 0 && scene.stage <= 1), "Invalid scene stage");
const displaySlots = SCENES.flatMap(scene => scene.slots || []);
assert(displaySlots.length <= 45, `Too many unique display slots: ${displaySlots.length}`);
assert.equal(new Set(PHOTO_LIBRARY.map(photo => photo.id)).size, PHOTO_LIBRARY.length, "Duplicate photo IDs");
assert(PHOTO_LIBRARY.every(photo => photo.id && photo.label && photo.category), "Incomplete photo catalog entry");

console.log(`MILANA smoke checks passed: ${SCENES.length} scenes, ${PHOTO_LIBRARY.length} unique photos, ${LETTER_MOMENTS.length} scattered letters, dates, JS and CSS.`);
