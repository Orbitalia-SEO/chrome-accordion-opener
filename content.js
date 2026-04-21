(() => {
  const counts = {};
  const bump = (key) => { counts[key] = (counts[key] || 0) + 1; };
  const total = () => Object.values(counts).reduce((a, b) => a + b, 0);

  // Para anchors: bloquea la navegación por defecto (hash change o URL) en fase
  // captura ANTES de que el navegador la ejecute, pero deja que los handlers JS
  // del framework (fase burbuja) sigan corriendo y abran el acordeón.
  // Para submit buttons: skip — podrían enviar formularios y recargar.
  const safeClick = (el, key) => {
    try {
      const tag = el.tagName;
      if (tag === 'A') {
        const preventNav = (e) => {
          e.preventDefault();
          el.removeEventListener('click', preventNav, true);
        };
        el.addEventListener('click', preventNav, true);
        el.click();
      } else if (tag === 'BUTTON' && el.type === 'submit') {
        return;
      } else {
        el.click();
      }
      bump(key);
    } catch (_) {}
  };

  // ---------- Divi ----------
  document.querySelectorAll('.et_pb_toggle').forEach(el => {
    el.classList.remove('et_pb_toggle_close');
    el.classList.add('et_pb_toggle_open');
    const c = el.querySelector('.et_pb_toggle_content');
    if (c) c.style.display = 'block';
    bump('divi-toggle');
  });

  // Divi tabs
  document.querySelectorAll('.et_pb_tabs_controls li:not(.et_pb_tab_active) a').forEach(el => safeClick(el, 'divi-tabs'));

  // ---------- Elementor legacy accordion & toggle ----------
  // Widget accordion.default usa exclusividad: click en una cabecera cierra
  // las anteriores. Saltamos el handler JS y manipulamos DOM directamente
  // para abrir todas a la vez.
  document.querySelectorAll(
    '.elementor-widget-accordion .elementor-tab-title, .elementor-widget-toggle .elementor-tab-title'
  ).forEach(title => {
    if (title.classList.contains('elementor-active')) {
      bump('elementor-accordion-skipped');
      return;
    }
    title.classList.add('elementor-active');
    title.setAttribute('aria-expanded', 'true');
    title.setAttribute('aria-selected', 'true');
    title.setAttribute('tabindex', '0');
    const contentId = title.getAttribute('aria-controls');
    const content = contentId
      ? document.getElementById(contentId)
      : title.nextElementSibling;
    if (content) {
      content.classList.add('elementor-active');
      content.style.display = 'block';
      content.removeAttribute('hidden');
    }
    bump('elementor-accordion');
  });

  // ---------- Elementor v3+ / Gutenberg / nativos: <details> ----------
  document.querySelectorAll('details:not([open])').forEach(el => {
    el.setAttribute('open', '');
    bump('details');
  });

  // ---------- Bootstrap 4 / 5 collapse ----------
  document.querySelectorAll('.collapse:not(.show)').forEach(el => {
    el.classList.add('show');
    el.style.height = 'auto';
    bump('bootstrap-collapse');
  });
  document.querySelectorAll('.accordion-button.collapsed').forEach(el => {
    el.classList.remove('collapsed');
    el.setAttribute('aria-expanded', 'true');
    bump('bootstrap-button');
  });
  // Bootstrap 3 legacy
  document.querySelectorAll('.panel-collapse:not(.in)').forEach(el => {
    el.classList.add('in');
    el.style.height = 'auto';
    bump('bootstrap3-panel');
  });

  // ---------- WPBakery / Visual Composer ----------
  document.querySelectorAll('.vc_tta-panel:not(.vc_active)').forEach(el => {
    el.classList.add('vc_active');
    const body = el.querySelector('.vc_tta-panel-body');
    if (body) body.style.display = 'block';
    bump('wpbakery');
  });

  // ---------- Beaver Builder ----------
  document.querySelectorAll('.fl-accordion-item').forEach(el => {
    el.classList.add('fl-accordion-item-active');
    const c = el.querySelector('.fl-accordion-content');
    if (c) c.style.display = 'block';
    bump('beaver');
  });

  // ---------- Kadence Blocks ----------
  document.querySelectorAll('.kt-accordion-panel').forEach(el => {
    el.classList.add('kt-accordion-panel-active');
    const inner = el.querySelector('.kt-accordion-panel-inner');
    if (inner) inner.style.display = 'block';
    bump('kadence');
  });
  document.querySelectorAll('.kt-blocks-accordion-header[aria-expanded="false"]').forEach(el => safeClick(el, 'kadence-header'));

  // ---------- Oxygen Builder ----------
  document.querySelectorAll('.oxy-pro-accordion_row:not(.oxy-pro-accordion-row-active)').forEach(el => {
    el.classList.add('oxy-pro-accordion-row-active');
    bump('oxygen');
  });

  // ---------- Ultimate Addons (UAGB) ----------
  document.querySelectorAll('.uagb-faq-item:not(.uagb-faq-item-active)').forEach(el => {
    el.classList.add('uagb-faq-item-active');
    bump('uagb');
  });

  // ---------- Stackable ----------
  document.querySelectorAll('.stk-block-accordion:not([data-open])').forEach(el => {
    el.setAttribute('data-open', 'true');
    bump('stackable');
  });

  // ---------- jQuery UI accordion ----------
  document.querySelectorAll('.ui-accordion-header:not(.ui-accordion-header-active)').forEach(el => safeClick(el, 'jqueryui'));

  // ---------- Foundation ----------
  document.querySelectorAll('.accordion-item:not(.is-active)').forEach(el => {
    el.classList.add('is-active');
    const content = el.querySelector('.accordion-content');
    if (content) {
      content.style.display = 'block';
      content.setAttribute('aria-hidden', 'false');
    }
    bump('foundation');
  });

  // ---------- ARIA genérico (fallback) ----------
  // Solo botones no-submit y role=button. Excluimos menús de navegación y
  // dropdowns de menú para no disparar navegaciones ni abrir megamenús.
  // También excluimos elementos ya cubiertos por selectores específicos
  // (elementor-tab-title, kt-blocks-accordion-header) para evitar doble click.
  const NAV_SELECTOR = 'nav, [role="navigation"], .nav, .menu, .navbar, .main-menu, .site-navigation, .main-navigation, .primary-menu, header .menu';
  const SKIP_CLASSES = 'elementor-tab-title kt-blocks-accordion-header ui-accordion-header accordion-button';
  document.querySelectorAll(
    'button[aria-expanded="false"]:not([type="submit"]):not([data-toggle="dropdown"]):not([data-bs-toggle="dropdown"]):not(.dropdown-toggle), [role="button"][aria-expanded="false"]'
  ).forEach(el => {
    if (el.closest(NAV_SELECTOR)) return;
    if (SKIP_CLASSES.split(' ').some(c => el.classList.contains(c))) return;
    safeClick(el, 'aria-generic');
  });

  // ---------- Log final ----------
  const n = total();
  console.log(
    `%c[Orbitalia Accordion Opener] ${n > 0 ? '✅' : 'ℹ️'} Procesados: ${n}`,
    'color:#00a878;font-weight:bold'
  );
  if (n > 0) console.table(counts);
  else console.log('[Orbitalia Accordion Opener] No se detectaron acordeones compatibles en esta página.');
})();
