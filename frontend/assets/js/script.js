/* assets/js/script.js
   General site JS: auto-badges, fill specs, simple interactivity
*/

document.addEventListener("DOMContentLoaded", function () {
  decorateCarCards();
  wireBookingForms();
  initMobileMenu();
});

/* Auto add badges & fill spec boxes */
function decorateCarCards() {
  document.querySelectorAll(".car-card").forEach((card) => {
    // add badge if missing based on data attributes
    if (!card.querySelector(".car-badge")) {
      const cat = (card.dataset.category || "").toLowerCase();
      const price = Number(card.dataset.price || 0);
      let badgeText = "";
      if (cat.includes("luxury")) badgeText = "Premium";
      else if (cat.includes("new")) badgeText = "New";
      else if (price && price > 3000) badgeText = "Popular";
      if (badgeText) {
        const s = document.createElement("span");
        s.className = "car-badge";
        s.innerText = badgeText;
        const media = card.querySelector(".media-wrap") || card;
        media.appendChild(s);
      }
    }

    // ensure overlay exists
    if (!card.querySelector(".overlay")) {
      const ov = document.createElement("div");
      ov.className = "overlay";
      (card.querySelector(".media-wrap") || card).appendChild(ov);
    }

    // fill or create specs box
    let specs = card.querySelector(".car-specs-float");
    if (!specs) {
      specs = document.createElement("div");
      specs.className = "car-specs-float";
      (card.querySelector(".media-wrap") || card).appendChild(specs);
    }
    const seats =
      card.dataset.seats || extractFromText(card, /(\d+)\s*seat/i) || "—";
    const trans = card.dataset.transmission || card.dataset.trans || "—";
    const fuel = card.dataset.fuel || "—";
    specs.innerHTML = `
      <div class="spec-row"><span class="spec-icon">🚗</span><small><strong>Seats</strong> ${seats}</small></div>
      <div class="spec-row"><span class="spec-icon">⚙️</span><small><strong>Transmission</strong> ${trans}</small></div>
      <div class="spec-row"><span class="spec-icon">⛽</span><small><strong>Fuel</strong> ${fuel}</small></div>
    `;
  });
}
function extractFromText(el, re) {
  const t = el.innerText || "";
  const m = t.match(re);
  return m ? m[1] : null;
}

/* Wire booking forms to prefill car */
function wireBookingForms() {
  // if booking page has ?car= param, prefill
  const params = new URLSearchParams(window.location.search);
  const carName = params.get("car");
  if (carName) {
    const el = document.querySelector("#booking-carname");
    if (el) el.value = carName;
  }

  // simple demo submit
  const form = document.querySelector("#booking-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Booking submitted (demo). Implement server-side processing.");
      form.reset();
    });
  }
}

/* mobile menu quick */
function initMobileMenu() {
  const btn = document.querySelector("#mobile-menu-btn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    document.querySelector(".nav")?.classList.toggle("open");
  });
}
