# MILANA — Two Years · Light Atelier

An interactive, **mobile-first** love-story website for the anniversary **18 November 2026**.

**Live site:** https://sleepkidd.github.io/maket/

**Design direction:** daylight, warm ivory, cream, blush pink, botanical greens, editorial typography, soft shadows, floating petals and 3D flowers. The site is an evolving photo archive, not a dark landing page.

## Project files

```text
index.html                       page shell
styles.css                       original foundational styles
light.css                        light-theme styling and mobile scene art direction
app.js                           30 story chapters, scene rendering and interactions
love.css                         premium envelopes, love letters, notes and mobile layout
src/data/story.js                relationship dates, captions, photo slots, audio paths
src/core/quality.js              quality profiles and single render scheduler
src/core/input.js                pointer interaction and optional tilt
src/core/audio.js                optional music / voice playback
src/webgl/world.js               instantiated 3D petals, leaves, flowers, lighting
src/visual/light-effects.js      botanical illustration, falling petals, chapter love notes
src/data/love-letters.js         7 letters, 12 tender names, morning/night, vows, final letter
src/interactive/love-experience.js accessible letter dialog and touch-ready interactions
scripts/e2e.mjs                 Playwright checks on mobile and desktop
scripts/smoke.mjs                dependency-free source checks
```

Vanilla ES modules; no bundling required for GitHub Pages. Three.js is loaded dynamically; story content and SVG botanical decoration remain visible if WebGL or its CDN fails.

## The 3D floral artwork

The botanical scene uses a curved triangular mesh for each petal (rather than sphere primitives), layered per blossom, with instanced flower petals, leaves, stems, centres and floating petals. Mobile and desktop have different flower positions. A capped device pixel ratio and 30/45/60 fps scheduler are used for different performance tiers. Detail is gradually added as the story progresses.

Visual elements include decorative floral illustrations, ambient petals, animated reveals, circular filigree, a timeline with botanical details, paper/film/Polaroid treatments, glass, fabric, a memory map, a compare slider and large typographic anniversary chapters.

## Important: photos and personal content

There are deliberately **no invented photos, voice clips, private messages or made-up memories** in this repository. Romantic prose in `src/data/love-letters.js` is original drafted text for the site, not claimed to be the couple's actual private messages or remembered events. The styled placeholders are only waiting for your real archive.

Open `src/data/story.js`. An image slot can use:

```js
{
  label: "Наша первая прогулка",
  alt: "Мы с Миланой в парке",
  category: "beginning",
  ratio: "4 / 5",
  src: "./assets/photos/beginning/first-walk.webp",
  width: 960,
  height: 1200
}
```

For the existing `slot` helper, you can extend it to accept `src` and actual dimensions, or use such objects directly in each scene's `slots`. Keep stable aspect ratios, compress original photos, and use descriptive filenames. Do not commit uncompressed multi-megabyte source photos.

**Privacy:** This site and repository are public. Anything committed under `assets/photos/` or included as messages will be viewable/downloadable by anyone with the URL. Review photo/message privacy before uploading.

Music and voice are optional. In `RELATIONSHIP`, set:

```js
musicSrc: "./assets/audio/relationship.mp3",
voiceSrc: "./assets/audio/voice-note.mp3",
```

Only after uploading the actual files. The player will otherwise stay hidden or disabled instead of pretending to play nonexistent media.

## Running locally

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173/`.

Verify sources with:

```bash
node scripts/smoke.mjs
node --check app.js
node --check src/webgl/world.js
node --check src/visual/light-effects.js
```

Use `?debug=1` for the WebGL FPS/draw-call HUD.

## Customizing the love letters

Edit `src/data/love-letters.js` to customize the seven envelope letters, twelve affectionate messages (котёнок, кошечка, заенька, лучик солнца, любимка, родная девочка…), two morning/night letters, six real-life promises, twelve chapter interludes, and the final long letter. They deliberately avoid inventing specific memories.

All seven envelopes work as accessible tap-to-open letters. The native dialog supports Escape, keyboard navigation, and next/previous letters. `scripts/e2e.mjs` verifies these interactions with Playwright on 375×812, 390×844, 430×932 and 1440×900 viewports. CI uploads screenshots for review.

To run the browser tests locally, install Playwright and its Chromium browser, then run `node scripts/e2e.mjs`.

## Test devices

Design for 360/375/390/414/430 px portrait phones, tablets and wide desktop layouts. Test iPhone Safari and Android Chrome before gifting. The initial light-theme revision was source-validated; **it is not yet a substitute for a real-device FPS and visual review**.

## GitHub Pages

This is a static `main` branch site. A push updates GitHub Pages automatically using the repository's deployment configuration.

## Future anniversaries

Add a scene in `src/data/story.js` and any required scene renderer in `app.js`. Keep private messages and photos as replaceable data, not embedded in CSS.
