document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".layout__menu-toggle");
  const aside = document.getElementById("aside-nav");
  if (!toggle || !aside) return;

  const bars = toggle.querySelector(".fa-bars");
  const xmark = toggle.querySelector(".fa-xmark");

  const T = (key, fb) =>
    (window.i18n && typeof i18n.t === "function" && i18n.t(key)) || fb;

  function setAriaLabel(open) {
    const label = open
      ? T("common.closeMenu", "Cerrar menú")
      : T("common.openMenu", "Abrir menú");
    toggle.setAttribute("aria-label", label);
  }

  function setMenu(open) {
    aside.classList.toggle("layout__aside--visible", open);
    toggle.setAttribute("aria-expanded", String(open));
    if (bars && xmark) {
      bars.style.opacity = open ? "0" : "1";
      xmark.style.opacity = open ? "1" : "0";
    }
    document.body.style.overflow = open ? "hidden" : "";
    setAriaLabel(open);

    // Mueve el foco al primer enlace del menú cuando abre
    if (open) {
      const firstLink = aside.querySelector(".menu__link");
      if (firstLink) firstLink.focus({ preventScroll: true });
    } else {
      toggle.focus({ preventScroll: true });
    }
  }

  // Inicializa etiqueta correcta según estado (cerrado)
  setAriaLabel(false);

  toggle.addEventListener("click", () => {
    const open = aside.classList.contains("layout__aside--visible");
    setMenu(!open);
  });

  toggle.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle.click();
    }
  });

  // Cierra con Esc
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  // Cierra al hacer clic fuera del aside y del botón
  document.addEventListener("pointerdown", (e) => {
    const target = e.target;
    const open = aside.classList.contains("layout__aside--visible");
    if (!open) return;
    if (!aside.contains(target) && !toggle.contains(target)) setMenu(false);
  });
});
