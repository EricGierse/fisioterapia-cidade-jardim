/* Fisioterapia e Pilates Cidade Jardim — interações */

// Menu mobile
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("is-open");
  navToggle.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

// Fecha o menu ao clicar em um link (mobile)
navMenu.addEventListener("click", (event) => {
  if (event.target.tagName === "A") {
    navMenu.classList.remove("is-open");
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

// Animações de entrada ao rolar.
// Baseado na posição atual (e não em IntersectionObserver) para que seções
// puladas por links de âncora também apareçam.
let revealQueued = false;

function revealVisible() {
  revealQueued = false;
  const limit = window.innerHeight * 0.88;
  document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => {
    if (el.getBoundingClientRect().top < limit) {
      el.classList.add("is-visible");
    }
  });
}

function queueReveal() {
  if (revealQueued) return;
  revealQueued = true;
  requestAnimationFrame(revealVisible);
}

window.addEventListener("scroll", queueReveal, { passive: true });
window.addEventListener("resize", queueReveal);
// O salto para uma âncora (#servicos, #faq...) nem sempre dispara "scroll",
// então revalidamos também no load e na troca de hash.
window.addEventListener("load", queueReveal);
window.addEventListener("hashchange", queueReveal);
revealVisible();

// Ano atual no rodapé
document.getElementById("year").textContent = new Date().getFullYear();
