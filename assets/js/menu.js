// assets/js/menu.js
document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector(".layout__menu-toggle");
  const iconBars = document.querySelector(".layout__menu-toggle .fa-bars");
  const iconX = document.querySelector(".layout__menu-toggle .fa-xmark");
  const aside = document.querySelector(".layout__aside");

  if (!button || !aside || !iconBars || !iconX) return;

  const isOpen = () => aside.classList.contains("layout__aside--visible");

  const setAriaLabel = (open) => {
    const key = open ? "common.closeMenu" : "common.openMenu";
    const fallback = open ? "Cerrar menú" : "Abrir menú";
    const label = (window.i18n && i18n.t(key)) || fallback;
    button.setAttribute("aria-label", label);
  };

  function openMenu() {
    aside.classList.add("layout__aside--visible");
    iconBars.style.opacity = 0;
    iconX.style.opacity = 1;
    button.setAttribute("aria-expanded", "true");
    setAriaLabel(true);
  }

  function closeMenu() {
    aside.classList.remove("layout__aside--visible");
    iconBars.style.opacity = 1;
    iconX.style.opacity = 0;
    button.setAttribute("aria-expanded", "false");
    setAriaLabel(false);
  }

  function toggleMenu() {
    isOpen() ? closeMenu() : openMenu();
  }

  // Click/tap
  button.addEventListener("click", toggleMenu);

  // Teclado: Enter o Espacio
  button.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleMenu();
    }
  });

  // Escape cierra
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) closeMenu();
  });

  // Clic en enlaces de menú -> cierra (útil en móvil)
  document.querySelectorAll(".menu__link").forEach((a) => {
    a.addEventListener("click", () => {
      if (isOpen()) closeMenu();
    });
  });

  // En resize, cerramos si es vista móvil y está abierto
  window.addEventListener("resize", () => {
    const size = document.body.clientWidth;
    if (size <= 1060 && isOpen()) closeMenu();
  });

  // Inicializar aria-label acorde al estado/idioma actual
  setAriaLabel(false);

  // Si cambias de idioma con el toggle, refrescamos el aria-label
  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => {
      setTimeout(() => setAriaLabel(isOpen()), 0);
    });
  });
});
