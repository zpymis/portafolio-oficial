// Solo mantiene estados aria-pressed y activa animación del pill.
// El cambio real de idioma lo gestiona i18n.js.
document.addEventListener("DOMContentLoaded", () => {
  const grp = document.querySelector(".lang-toggle");
  if (!grp) return;

  grp.classList.add("is-animated");

  const btns = grp.querySelectorAll(".lang-toggle__btn");
  const getLang = () => document.documentElement.getAttribute("lang") || "es";
  const setPressed = (lang) => {
    btns.forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.lang === lang))
    );
  };

  setPressed(getLang());

  btns.forEach((b) => {
    b.addEventListener("click", () => {
      // i18n.js actualizará <html lang>. Sincronizamos el estado visual.
      requestAnimationFrame(() => setPressed(getLang()));
    });
  });
});
