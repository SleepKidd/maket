# MILANA — TWO YEARS

Mobile-first cinematic interactive archive for two years of relationship.

- Start: **18.11.2024**
- Anniversary: **18.11.2026**
- Story target: **730 days**

## Architecture

This is intentionally a static ES-module project so GitHub Pages can serve it directly without a runtime framework or a build server.

```text
index.html
styles.css
app.js                         composition + interaction wiring
src/data/story.js              data-driven scenes, slots, secrets and categories
src/core/quality.js            HIGH / MEDIUM / LOW + one RAF scheduler
src/core/input.js              coalesced pointer input + opt-in device tilt
src/core/audio.js              music / voice / SFX audio manager
src/webgl/world.js             shared-geometry instanced botanical WebGL scene
```

## Performance decisions

- One render scheduler, paused on `document.hidden`.
- No independent animation loops per scene.
- One shared petal geometry and one shared leaf geometry rendered through `InstancedMesh`.
- Mobile pixel ratio capped to 1.08–1.35 depending on the quality profile.
- Stable `100svh` canvas; resize is width/orientation driven and debounced.
- Native scroll is preserved. There is no Lenis-style smooth-scroll layer.
- Pointer state is coalesced and consumed once per render tick.
- Compare slider caches its rectangle on pointer-down instead of reading layout on every move.
- No animated fullscreen `backdrop-filter`, SVG `feTurbulence`, or global blend-mode noise.
- `prefers-reduced-motion` and `prefers-reduced-transparency` are supported.
- WebGL failure falls back to a CSS botanical composition without breaking the story.
- `?debug=1` enables a development-only FPS / draw-call / triangle overlay.

## Content pipeline

Edit `src/data/story.js` first. The file contains the scenes, photo categories, real-content slots, message slots, places, and hidden memories. It deliberately uses placeholders instead of inventing personal facts.

The visual system is рассчитана ровно на **15 уникальных фотографий**. Готовый каталог и имена файлов находятся в `assets/photos/README.md`, а 15 записей подключены в `src/data/story.js`. Они переиспользуются в разных монтажных формах — крупный кадр, вертикальный тоннель, плёнка, Polaroid, portrait stack, Then / Now и финальный кадр. Поэтому история остаётся насыщенной, но не требует загружать сотню снимков.

Визуальное направление — светлый editorial: молочный фон, кремовые поверхности, пудрово-розовые цветы, мягкая зелень и тёмная serif-типографика. Ботанический мир не использует внешние тяжёлые модели: лепестки, листья, стебли и объёмное сердце собираются процедурно в Three.js с InstancedMesh. Сердце плавно проходит полный оборот на протяжении всей прокрутки страницы.

### Photos

The data model is ready for:

- ровно 15 source photos;
- 15 unique final photos;
- 35–45 display instances through intentional reuse;
- categories: `before-us`, `beginning`, `one-month`, `three-months`, `half-year`, `everyday`, `places`, `first-year`, `second-year`, `milana`, `us`, `then-now`, `finale`.

When real files are added, use known dimensions and `data-src` / WebP or AVIF sources. `AssetManager` loads them only near the viewport.

### Audio

`src/core/audio.js` already supports:

- `assets/audio/relationship.mp3`;
- `assets/audio/voice-note.mp3`;
- separate low-volume SFX.

No oscillator placeholder is used. Add files and pass their paths in `boot()` when the real track and voice are ready.

### Adding another year

Add a new scene object to `SCENES` in `src/data/story.js`, assign a new `stage` value, and select one of the existing scene kinds or add a single renderer branch in `renderScene()`.

## Run locally

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173/`.

The site is GitHub Pages-compatible and has no build step. Before deployment, run:

```bash
node --check app.js
node --check src/data/story.js
node --check src/core/quality.js
node --check src/core/input.js
node --check src/core/audio.js
node --check src/webgl/world.js
```

## Audit notes

The previous version had an always-running RAF, one mesh and geometry per petal, resize on every event, unconditional device-orientation input, global SVG turbulence, several fixed/composited layers, an unused gain node on every sound toggle, hardcoded content, no media pipeline, no WebGL fallback, and showed `13.10.2026` as the end date. These are addressed in the current architecture. The end date is now `18.11.2026`.
