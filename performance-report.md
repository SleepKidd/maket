# Performance audit — MILANA / maket

## Audit baseline

Audited the published baseline and the source on 13 October 2026.

### Baseline findings

| Area | Baseline problem | Refactor |
| --- | --- | --- |
| Render loop | `requestAnimationFrame` ran forever, including when the tab was hidden | One scheduler; pauses on `document.hidden`; caps target FPS by profile |
| Botanical geometry | Separate `Mesh` and `SphereGeometry` instances for petals | Shared geometry + `InstancedMesh` for petals and leaves |
| Resize | Renderer resized on every resize event | Stable `100svh`; debounced width/orientation resize |
| Input | Pointer, touch and orientation competed with one another | Coalesced input state; tilt is opt-in after the first tap |
| CSS compositing | SVG turbulence, blend-mode noise, large blur/backdrop layers | Static low-cost grain; local glass surfaces only |
| Offscreen work | Whole WebGL scene kept active without a scene manager | One active world driven by `IntersectionObserver` scene state |
| WebGL failure | Renderer construction could throw and leave the page with a dead Canvas | Context probe + CSS botanical fallback |
| Audio | Toggle allocated an unused `GainNode`; default oscillator was not a real audio architecture | `AudioManager` with music, voice and SFX channels; no oscillator |
| Layout stability | Hardcoded content, missing media pipeline and incorrect end date | Data-driven scene model, fixed aspect-ratio slots, `18.11.2026` anniversary |

## Current budgets

- Mobile pixel ratio: capped to `1.08–1.35`.
- Desktop pixel ratio: capped to `1.65`.
- Mobile botanical instances: quality profile controls flower, leaf and petal counts.
- No per-frame DOM layout reads in pointer handlers.
- No smooth-scroll library.
- Videos and image assets have a lazy-loading path through `AssetManager`.

## Verification performed

- `node --check` passed for all JavaScript modules.
- Static HTTP server returned `200` for the page, app module and stylesheet.
- Data import check passed: 26 story scenes and 8 secret-memory records.
- Published Pages was opened at desktop viewport and the baseline console showed the old WebGL context failure in the cloud browser; the new fallback path explicitly handles that case.

## Remaining environment limitation

The local Playwright browser binary was unavailable in the execution environment and its download endpoint returned a truncated archive. Therefore a local automated 390×844 / 430×932 / 1440×900 Playwright trace could not be honestly claimed. The source is structured for those viewports, and the published page is checked through the available cloud browser after Pages propagation.

The next performance pass should be run on a real iPhone Safari and Android Chrome with the final photo/video/audio assets present, because media decode cost cannot be measured from placeholders.
