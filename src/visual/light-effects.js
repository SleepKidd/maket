import { INTERLUDE_NOTES } from "../data/love-letters.js";
/* Editorial floral motifs and lightweight motion. No per-element RAF. */
const flowerMarkup = (variant = 0) => {
  const shade = variant % 2 ? "#cb89a4" : "#e2a9a5";
  const other = variant % 2 ? "#e5d2bd" : "#f4d8d5";
  return `<svg class="botanical-corner" viewBox="0 0 280 420" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
<defs>
<linearGradient id="petal-${variant}" x1="0" y1="0" x2=".92" y2="1"><stop stop-color="#fffbf0"/><stop offset=".48" stop-color="${other}"/><stop offset="1" stop-color="${shade}"/></linearGradient>
<linearGradient id="leaf-${variant}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#b1c8ab"/><stop offset="1" stop-color="#628b78"/></linearGradient>
</defs>
<g fill="none" stroke="#769580" stroke-width="2.8" stroke-linecap="round" opacity=".72">
<path d="M126 416 C124 350 144 296 122 226 C101 172 130 126 158 85"/>
<path d="M122 308 C90 278 77 239 59 197"/>
<path d="M128 266 C161 242 177 203 192 156"/>
<path d="M114 355 C90 340 62 339 40 342"/>
</g>
<g fill="url(#leaf-${variant})" stroke="#5e8875" stroke-width="1.2" opacity=".86">
<path d="M120 314 C40 298 41 258 33 234 C90 240 116 265 120 314Z"/>
<path d="M129 272 C194 251 209 212 220 195 C164 196 137 227 129 272Z"/>
<path d="M115 354 C65 304 28 314 15 320 C35 358 78 373 115 354Z"/>
<path d="M122 222 C78 194 77 152 91 132 C125 153 135 185 122 222Z"/>
</g>
<g fill="none" stroke="#cbe0cc" stroke-width="1"><path d="M38 247 120 311M216 203 131 270M19 322 110 351M91 138 120 218"/></g>
<g transform="translate(157 85) rotate(-9)">
<g fill="url(#petal-${variant})" stroke="#bd8795" stroke-width="1.1" opacity=".96">
<path d="M0 3 C-66 -84 -92 -25 -35 18 Q-9 28 0 3Z"/>
<path d="M0 3 C11 -88 78 -82 52 -19 Q36 17 0 3Z"/>
<path d="M0 3 C66 -15 98 40 28 52 Q6 48 0 3Z"/>
<path d="M0 3 C16 80 -56 85 -46 33 Q-33 8 0 3Z"/>
<path d="M0 3 C-68 44 -91 -12 -41 -24 Q-7 -25 0 3Z"/>
<path d="M0 0 C-38 -51 23 -64 30 -23 Q26 8 0 0Z"/>
<path d="M0 0 C46 -24 63 18 19 29 Q-3 32 0 0Z"/>
<path d="M0 0 C-40 40 -52 -6 -25 -22 Q-2 -29 0 0Z"/>
</g>
<path d="M-13 -3 C-14 -23 15 -29 19 -7 C24 14 -1 20 -13 -3Z" fill="#e7bcac" stroke="#bf8b91" stroke-width="1"/>
<path d="M-8 -4 Q0 -18 14 -9 M-5 7 Q-6 -7 8 -8" fill="none" stroke="#f9eadd" stroke-width="2.2" opacity=".8"/>
</g>
<g transform="translate(56 192) scale(.52) rotate(14)">
<g fill="url(#petal-${variant})" stroke="#c492a2" stroke-width="1.5"><path d="M0 0C-38 -65 -70 -12 -17 17Z"/><path d="M0 0C22 -62 65 -37 20 20Z"/><path d="M0 0C-42 28 -15 68 13 20Z"/><path d="M0 0C54 -14 54 42 13 28Z"/></g><circle r="12" fill="#edc7b9"/></g>
<circle cx="175" cy="168" r="4" fill="#cf9b89"/><circle cx="96" cy="117" r="3" fill="#c18c91"/>
</svg>`;
};
export function enhanceStory() {
  const scenes = Array.from(document.querySelectorAll(".scene"));
  if (!scenes.length) return;
  const progress = document.createElement("div");
  progress.className = "atelier-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.append(progress);
  const petals = document.createElement("div");
  petals.className = "floating-petals";
  petals.setAttribute("aria-hidden", "true");
  const count = matchMedia("(pointer:coarse)").matches ? 7 : 13;
  for (let i = 0; i < count; i++) {
    const el = document.createElement("i");
    el.style.setProperty("--x", ((i * 67 + 19) % 99) + "%");
    el.style.setProperty("--size", (7 + (i * 7) % 13) + "px");
    el.style.setProperty("--op", (.17 + (i % 4) * .075).toFixed(2));
    el.style.setProperty("--duration", (16 + i % 8 * 2) + "s");
    el.style.setProperty("--delay", (-i * 3.7) + "s");
    petals.append(el);
  }
  document.body.append(petals);
  const ornamented = new Set(["prologue","before-us","first-day","month","three-months","half-year","year","you","days","finale","letter"]);
  scenes.forEach((scene, index) => {
    if (ornamented.has(scene.id)) {
      const left = document.createElement("div");
      left.innerHTML = flowerMarkup(index % 2);
      const right = document.createElement("div");
      right.innerHTML = flowerMarkup((index + 1) % 2);
      left.firstElementChild.classList.add("botanical-corner--left");
      right.firstElementChild.classList.add("botanical-corner--right");
      scene.prepend(left.firstElementChild, right.firstElementChild);
    }
    if (["prologue","month","half-year","year","days","finale"].includes(scene.id)) {
      const orbit = document.createElement("div");
      orbit.className = "botanical-orbit";
      orbit.setAttribute("aria-hidden","true");
      scene.prepend(orbit);
    }
    if (index > 0 && index < 24 && index % 3 === 0) {
      const ornament = document.createElement("div");
      ornament.className = "atelier-stamp";
      ornament.textContent = "M ♥";
      ornament.setAttribute("aria-hidden","true");
      scene.append(ornament);
    }
    if (["film","desk","you","love","messages","letter"].includes(scene.id)) {
      const annotation = document.createElement("div");
      annotation.className = "scene-flourish scene-flourish--one";
      annotation.textContent = index % 2 ? "✳" : "✦";
      annotation.setAttribute("aria-hidden","true");
      scene.append(annotation);
    }
    const personalNote = INTERLUDE_NOTES[scene.id];
    if (personalNote) {
      const whisper = document.createElement("aside");
      whisper.className = "scene-whisper";
      whisper.setAttribute("aria-label", "Маленькое признание");
      const quote = document.createElement("p");
      quote.textContent = personalNote;
      const sign = document.createElement("span");
      sign.textContent = "для тебя · с любовью";
      whisper.append(quote, sign);
      scene.append(whisper);
    }
    if (index > 0) scene.classList.add("reveal-enabled");
  });
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    }, { threshold:.045, rootMargin:"100px 0px" });
    scenes.forEach(scene => observer.observe(scene));
  } else scenes.forEach(scene => scene.classList.add("is-visible"));

  let scheduled = false;
  function setProgress() {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    progress.style.setProperty("--progress", Math.max(0, Math.min(1, window.scrollY / max)).toFixed(5));
    scheduled = false;
  }
  window.addEventListener("scroll", () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(setProgress); }
  }, { passive:true });
  window.addEventListener("resize", () => { if (!scheduled) { scheduled = true; requestAnimationFrame(setProgress); } }, {passive:true});
  setProgress();
}
