document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".layout__menu-toggle");
  const aside = document.getElementById("aside-nav");
  if (!toggle || !aside) return;

  const bars = toggle.querySelector(".fa-bars");
  const xmark = toggle.querySelector(".fa-xmark");

  function setMenu(open) {
    aside.classList.toggle("layout__aside--visible", open);
    toggle.setAttribute("aria-expanded", String(open));
    if (bars && xmark) {
      bars.style.opacity = open ? "0" : "1";
      xmark.style.opacity = open ? "1" : "0";
    }
    document.body.style.overflow = open ? "hidden" : "";
  }

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
