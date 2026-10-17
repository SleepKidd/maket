# Botanical 3D reference

`source/10650280.jpg` remains as the untouched archive source.

`source/flower-original-cutout.png` is the production asset: the supplied flower is preserved, while the blue field is removed as real alpha transparency. The same asset is used by the Three.js plane and by the no-WebGL fallback, so the flower does not switch to a blue-backed JPEG on mobile.

The 3D heart remains procedural in `src/webgl/world.js` and rotates through a full 360° as the story scrolls.
