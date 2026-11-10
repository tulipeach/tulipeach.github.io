// Small bits of interaction for the portfolio. Nothing here is required
// for the page to work; it just makes it feel smoother.

// 1. Add a thin line under the nav once you scroll
const nav = document.querySelector(".nav");
function updateNav() {
  nav.classList.toggle("scrolled", window.scrollY > 8);
}
window.addEventListener("scroll", updateNav, { passive: true });
updateNav();

// 2. The sideways project shelf: arrows, counter, and arrow states
const shelf = document.querySelector(".shelf");
const prevBtn = document.querySelector("#prev");
const nextBtn = document.querySelector("#next");
const counter = document.querySelector(".counter");
const cards = shelf.querySelectorAll(".card");

function cardStep() {
  const gap = parseFloat(getComputedStyle(shelf).columnGap) || 24;
  return cards[0].getBoundingClientRect().width + gap;
}

function updateShelf() {
  const index = Math.round(shelf.scrollLeft / cardStep());
  const maxScroll = shelf.scrollWidth - shelf.clientWidth;
  counter.textContent = Math.min(index + 1, cards.length) + " / " + cards.length;
  prevBtn.disabled = shelf.scrollLeft <= 4;
  nextBtn.disabled = shelf.scrollLeft >= maxScroll - 4;
}

prevBtn.addEventListener("click", () => shelf.scrollBy({ left: -cardStep() }));
nextBtn.addEventListener("click", () => shelf.scrollBy({ left: cardStep() }));
shelf.addEventListener("scroll", updateShelf, { passive: true });
window.addEventListener("resize", updateShelf);
updateShelf();

// 3. Copy email button
const copyBtn = document.querySelector(".copy-btn");
const emailText = document.querySelector("#email");
copyBtn.addEventListener("click", () => {
  const done = () => {
    copyBtn.textContent = "Copied";
    setTimeout(() => (copyBtn.textContent = "Copy"), 1800);
  };
  const selectIt = () => {
    const range = document.createRange();
    range.selectNodeContents(emailText);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    copyBtn.textContent = "Selected";
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(emailText.textContent.trim()).then(done, selectIt);
  } else {
    selectIt();
  }
});

// 4. Footer year
document.querySelector("#year").textContent = new Date().getFullYear();
