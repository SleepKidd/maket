import { LOVE_LETTERS, TENDER_NOTES, DAY_NIGHT_LETTERS } from "../data/love-letters.js";

/**
 * Mobile-first reading interactions:
 * accessible native dialog, one delegated gallery handler, no RAF work.
 */
export function initLoveExperience() {
  const story = document.getElementById("story");
  if (!story) return;
  const dialog = document.createElement("dialog");
  dialog.className = "keepsake-dialog";
  dialog.id = "keepsakeDialog";
  dialog.setAttribute("aria-labelledby", "keepsakeTitle");
  dialog.innerHTML = `<div class="keepsake-dialog__page">
      <header class="keepsake-dialog__header">
        <span class="keepsake-dialog__index" data-letter-index>01 / 07</span>
        <button class="keepsake-close" type="button" data-close-letter aria-label="Закрыть письмо">×</button>
      </header>
      <div class="keepsake-dialog__seal" aria-hidden="true">M</div>
      <p class="keepsake-dialog__address" data-letter-address></p>
      <h2 id="keepsakeTitle" class="keepsake-dialog__title"></h2>
      <p class="keepsake-dialog__lead" data-letter-lead></p>
      <div class="keepsake-dialog__paragraphs" data-letter-body></div>
      <p class="keepsake-dialog__ending" data-letter-ending></p>
      <footer class="keepsake-dialog__footer">
        <button type="button" data-letter-prev aria-label="Предыдущее письмо">← Предыдущее</button>
        <span aria-hidden="true" class="keepsake-dialog__flourish">✳</span>
        <button type="button" data-letter-next aria-label="Следующее письмо">Следующее →</button>
      </footer>
    </div>`;
  document.body.append(dialog);
  let activeIndex = 0;
  let lastTrigger = null;
  const visited = new Set();

  function updateLetter(index) {
    activeIndex = Math.max(0, Math.min(LOVE_LETTERS.length - 1, index));
    const letter = LOVE_LETTERS[activeIndex];
    dialog.querySelector("[data-letter-index]").textContent =
      `${String(activeIndex + 1).padStart(2, "0")} / ${String(LOVE_LETTERS.length).padStart(2, "0")}`;
    dialog.querySelector("[data-letter-address]").textContent = letter.address;
    dialog.querySelector("#keepsakeTitle").textContent = letter.title;
    dialog.querySelector("[data-letter-lead]").textContent = letter.lead;
    const container = dialog.querySelector("[data-letter-body]");
    container.replaceChildren();
    for (const paragraph of letter.paragraphs) {
      const p = document.createElement("p");
      p.textContent = paragraph;
      container.append(p);
    }
    dialog.querySelector("[data-letter-ending]").textContent = letter.ending;
    dialog.querySelector("[data-letter-prev]").disabled = activeIndex === 0;
    dialog.querySelector("[data-letter-next]").disabled = activeIndex === LOVE_LETTERS.length - 1;
    dialog.scrollTop = 0;
    visited.add(letter.id);
    const trigger = document.querySelector(`[data-open-letter="${activeIndex}"]`);
    if (trigger) {
      trigger.classList.add("is-read");
      trigger.setAttribute("aria-label", `Перечитать письмо: ${letter.title}`);
    }
    const complete = document.querySelector("[data-letter-complete]");
    if (complete && visited.size === LOVE_LETTERS.length) {
      complete.hidden = false;
    }
  }

  function openLetter(index, trigger) {
    lastTrigger = trigger;
    updateLetter(index);
    if (typeof dialog.showModal === "function") {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
    dialog.querySelector("[data-close-letter]").focus({ preventScroll: true });
  }
  function closeLetter() {
    if (typeof dialog.close === "function" && dialog.open) dialog.close();
    else dialog.removeAttribute("open");
    lastTrigger?.focus({ preventScroll: true });
  }

  story.addEventListener("click", event => {
    const target = event.target instanceof Element ? event.target.closest("[data-open-letter]") : null;
    if (target) {
      openLetter(Number(target.dataset.openLetter), target);
      return;
    }
    const tender = event.target instanceof Element ? event.target.closest("[data-tender-index]") : null;
    if (tender) {
      const note = TENDER_NOTES[Number(tender.dataset.tenderIndex)];
      if (!note) return;
      document.querySelector("[data-tender-heading]").textContent = note.title;
      document.querySelector("[data-tender-text]").textContent = note.text;
      document.querySelectorAll("[data-tender-index]").forEach(button => {
        button.setAttribute("aria-pressed", String(button === tender));
      });
      return;
    }
    const dayButton = event.target instanceof Element ? event.target.closest("[data-daypart]") : null;
    if (dayButton) {
      const mode = dayButton.dataset.daypart;
      const letter = DAY_NIGHT_LETTERS[mode];
      if (!letter) return;
      const panel = document.querySelector("[data-daynight-panel]");
      panel.dataset.mode = mode;
      panel.querySelector("[data-day-icon]").textContent = letter.icon;
      panel.querySelector("[data-day-title]").textContent = letter.title;
      panel.querySelector("[data-day-caption]").textContent = letter.kicker;
      const paragraphs = panel.querySelector("[data-day-paragraphs]");
      paragraphs.replaceChildren();
      for (const text of letter.paragraphs) {
        const p = document.createElement("p");
        p.textContent = text;
        paragraphs.append(p);
      }
      document.querySelectorAll("[data-daypart]").forEach(button => {
        button.setAttribute("aria-pressed", String(button === dayButton));
      });
    }
  });

  dialog.addEventListener("click", event => {
    if (event.target === dialog) {
      closeLetter();
      return;
    }
    if (!(event.target instanceof Element)) return;
    if (event.target.closest("[data-close-letter]")) closeLetter();
    if (event.target.closest("[data-letter-prev]")) updateLetter(activeIndex - 1);
    if (event.target.closest("[data-letter-next]")) updateLetter(activeIndex + 1);
  });
  dialog.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft" && activeIndex > 0) {
      event.preventDefault();
      updateLetter(activeIndex - 1);
    }
    if (event.key === "ArrowRight" && activeIndex < LOVE_LETTERS.length - 1) {
      event.preventDefault();
      updateLetter(activeIndex + 1);
    }
  });
  dialog.addEventListener("close", () => {
    lastTrigger?.focus({ preventScroll: true });
  });
}
