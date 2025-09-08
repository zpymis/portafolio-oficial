// assets/js/map.js
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("#load-iframe-map");
  if (!container) return;

  const getLang = () =>
    window.i18n && typeof i18n.current === "function" ? i18n.current() : "es";

  const cityQuery = encodeURIComponent("Guadalajara, Jal.");

  const getTitle = (lang) => {
    const key = "contact.mapTitle";
    const fallback = lang === "en" ? "Map: Guadalajara" : "Mapa: Guadalajara";
    return (
      (window.i18n && typeof i18n.t === "function" && i18n.t(key, lang)) ||
      fallback
    );
  };

  const getSrc = (lang) =>
    `https://www.google.com/maps?q=${cityQuery}&output=embed&hl=${lang}`;

  const render = (lang = getLang()) => {
    container.innerHTML = `
      <iframe class="contact__iframe"
              title="${getTitle(lang)}"
              frameborder="0"
              scrolling="no"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              src="${getSrc(lang)}"></iframe>`;
  };

  // Render inicial (pequeño delay para que se vea el loader, si lo usas)
  setTimeout(() => render(), 500);

  // Cambio de idioma: solo actualiza el título del iframe (sin recargar el mapa)
  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang") || getLang();
      const iframe = container.querySelector(".contact__iframe");
      if (iframe) {
        iframe.setAttribute(
          "title",
          lang === "en" ? "Map: Guadalajara" : "Mapa: Guadalajara"
        );
      }
    });
  });
});
