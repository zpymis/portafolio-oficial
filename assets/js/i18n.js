(() => {
  const DEFAULT_LANG = "es";
  const SUPPORTED = ["es", "en"];
  const STORAGE_KEY = "site:lang";
  const translations = window.TRANSLATIONS || {};
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ---------- utils ----------
  const getFromPath = (obj, path) =>
    path
      .split(".")
      .reduce((acc, k) => (acc && acc[k] != null ? acc[k] : undefined), obj);

  const resolve = (key, lang) =>
    getFromPath(translations[lang], key) ??
    getFromPath(translations[DEFAULT_LANG], key) ??
    null;

  let canStore = true;
  try {
    localStorage.setItem("__test", "1");
    localStorage.removeItem("__test");
  } catch (e) {
    canStore = false;
  }

  const preferred = () => {
    const saved = canStore ? localStorage.getItem(STORAGE_KEY) : null;
    if (SUPPORTED.includes(saved)) return saved;
    const nav = (navigator.language || "es").toLowerCase();
    return nav.startsWith("es") ? "es" : "en";
  };

  // ---------- UI helpers ----------
  function updateToggleUI(lang) {
    $$("[data-lang]").forEach((btn) => {
      const active = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
  }

  function updateToggleTooltips(lang) {
    const btnEs = document.querySelector('[data-lang="es"]');
    const btnEn = document.querySelector('[data-lang="en"]');
    if (!btnEs || !btnEn) return;
    const t = (k, fb) => resolve(k, lang) ?? fb;
    btnEs.setAttribute(
      "title",
      t(
        "tooltips.toEs",
        lang === "en" ? "Switch to Spanish" : "Cambiar a español"
      )
    );
    btnEn.setAttribute(
      "title",
      t(
        "tooltips.toEn",
        lang === "en" ? "Switch to English" : "Cambiar a inglés"
      )
    );
  }

  // ---------- apply ----------
  function applyLang(lang) {
    if (!SUPPORTED.includes(lang)) lang = DEFAULT_LANG;

    // <html lang="..."> y clases para el toggle (controlan la píldora inicial por CSS)
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.classList.toggle("lang-en", lang === "en");
    document.documentElement.classList.toggle("lang-es", lang === "es");

    // Textos + atributos
    $$("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const htmlMode = el.hasAttribute("data-i18n-html");
      const tag = el.tagName;
      const hasAttrBindings = el.hasAttribute("data-i18n-attr");

      // 1) TEXTO:
      //    - si hay data-i18n-html, sí escribimos HTML.
      //    - si NO hay data-i18n-attr (o sea, no es solo atributos), sí escribimos texto.
      //    - jamás escribimos texto en INPUT/TEXTAREA (salvo htmlMode).
      const shouldSetText =
        htmlMode ||
        (!hasAttrBindings && !(tag === "INPUT" || tag === "TEXTAREA"));

      if (shouldSetText) {
        const val = resolve(key, lang);
        if (val != null) {
          if (htmlMode) el.innerHTML = val;
          else el.textContent = val;
        }
      }

      // 2) ATRIBUTOS (placeholder, title, aria-label, value, content, ...)
      const attrs = (el.getAttribute("data-i18n-attr") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      attrs.forEach((attr) => {
        let v = resolve(`${key}.${attr}`, lang);
        if (v == null) v = resolve(key, lang); // fallback al valor base si no existe key.attr
        if (v != null) {
          if (attr === "value" && (tag === "INPUT" || tag === "TEXTAREA")) {
            el.value = v; // e.g. <input type="submit">
          } else {
            el.setAttribute(attr, v);
          }
        }
      });

      // 3) FIX específico TEXTAREA: si quedó texto igual al placeholder, límpialo
      if (tag === "TEXTAREA") {
        const ph = resolve(`${key}.placeholder`, lang) ?? resolve(key, lang);
        if (typeof ph === "string" && el.value === ph) el.value = "";
      }
    });

    updateToggleUI(lang);
    updateToggleTooltips(lang);
  }

  function setLang(lang) {
    if (!SUPPORTED.includes(lang)) return;
    if (canStore) localStorage.setItem(STORAGE_KEY, lang);
    applyLang(lang);
  }

  function t(key, lang) {
    const used =
      lang ||
      (canStore && localStorage.getItem(STORAGE_KEY)) ||
      preferred() ||
      DEFAULT_LANG;
    return resolve(key, used);
  }

  // Exponer API mínima
  window.i18n = {
    setLang,
    t,
    current: () =>
      (canStore && localStorage.getItem(STORAGE_KEY)) ||
      preferred() ||
      DEFAULT_LANG,
    apply: applyLang,
  };

  // ---------- boot ----------
  document.addEventListener("DOMContentLoaded", () => {
    const initial =
      (canStore && localStorage.getItem(STORAGE_KEY)) || preferred();

    // 1) Aplica idioma inicial (sin animación de la píldora)
    applyLang(initial);

    // 2) Habilita la animación del toggle tras DOS repintados (evita cualquier salto)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document
          .querySelectorAll(".lang-toggle")
          .forEach((el) => el.classList.add("is-animated"));
      });
    });

    // 3) Listeners del toggle de idioma
    $$("[data-lang]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        setLang(btn.getAttribute("data-lang"));
      });
    });
  });
})();
