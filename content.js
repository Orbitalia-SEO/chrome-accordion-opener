(() => {
  let opened = 0;
  const bump = () => { opened++; };

  // Para anchors: bloquea la navegación por defecto (hash change o URL) en fase
  // captura ANTES de que el navegador la ejecute, pero deja que los handlers JS
  // del framework (fase burbuja) sigan corriendo y abran el acordeón.
  // Para submit buttons: skip — podrían enviar formularios y recargar.
  const safeClick = (el) => {
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
      bump();
    } catch (_) {}
  };

  // ---------- Divi ----------
  document.querySelectorAll('.et_pb_toggle').forEach(el => {
    el.classList.remove('et_pb_toggle_close');
    el.classList.add('et_pb_toggle_open');
    const c = el.querySelector('.et_pb_toggle_content');
    if (c) c.style.display = 'block';
    bump();
  });

  // Divi tabs
  document.querySelectorAll('.et_pb_tabs_controls li:not(.et_pb_tab_active) a').forEach(safeClick);

  // ---------- Elementor legacy (accordion + toggle + tabs) ----------
  document.querySelectorAll('.elementor-tab-title:not(.elementor-active)').forEach(safeClick);
  document.querySelectorAll('.elementor-toggle-title:not(.elementor-active)').forEach(safeClick);

  // ---------- Elementor v3+ / Gutenberg / nativos: <details> ----------
  document.querySelectorAll('details:not([open])').forEach(el => {
    el.setAttribute('open', '');
    bump();
  });

  // ---------- Bootstrap 4 / 5 collapse ----------
  document.querySelectorAll('.collapse:not(.show)').forEach(el => {
    el.classList.add('show');
    el.style.height = 'auto';
    bump();
  });
  document.querySelectorAll('.accordion-button.collapsed').forEach(el => {
    el.classList.remove('collapsed');
    el.setAttribute('aria-expanded', 'true');
    bump();
  });
  // Bootstrap 3 legacy
  document.querySelectorAll('.panel-collapse:not(.in)').forEach(el => {
    el.classList.add('in');
    el.style.height = 'auto';
    bump();
  });

  // ---------- WPBakery / Visual Composer ----------
  document.querySelectorAll('.vc_tta-panel:not(.vc_active)').forEach(el => {
    el.classList.add('vc_active');
    const body = el.querySelector('.vc_tta-panel-body');
    if (body) body.style.display = 'block';
    bump();
  });

  // ---------- Beaver Builder ----------
  document.querySelectorAll('.fl-accordion-item').forEach(el => {
    el.classList.add('fl-accordion-item-active');
    const c = el.querySelector('.fl-accordion-content');
    if (c) c.style.display = 'block';
    bump();
  });

  // ---------- Kadence Blocks ----------
  document.querySelectorAll('.kt-accordion-panel').forEach(el => {
    el.classList.add('kt-accordion-panel-active');
    const inner = el.querySelector('.kt-accordion-panel-inner');
    if (inner) inner.style.display = 'block';
    bump();
  });
  document.querySelectorAll('.kt-blocks-accordion-header[aria-expanded="false"]').forEach(safeClick);

  // ---------- Oxygen Builder ----------
  document.querySelectorAll('.oxy-pro-accordion_row:not(.oxy-pro-accordion-row-active)').forEach(el => {
    el.classList.add('oxy-pro-accordion-row-active');
    bump();
  });

  // ---------- Ultimate Addons (UAGB) ----------
  document.querySelectorAll('.uagb-faq-item:not(.uagb-faq-item-active)').forEach(el => {
    el.classList.add('uagb-faq-item-active');
    bump();
  });

  // ---------- Stackable ----------
  document.querySelectorAll('.stk-block-accordion:not([data-open])').forEach(el => {
    el.setAttribute('data-open', 'true');
    bump();
  });

  // ---------- jQuery UI accordion ----------
  document.querySelectorAll('.ui-accordion-header:not(.ui-accordion-header-active)').forEach(safeClick);

  // ---------- Foundation ----------
  document.querySelectorAll('.accordion-item:not(.is-active)').forEach(el => {
    el.classList.add('is-active');
    const content = el.querySelector('.accordion-content');
    if (content) {
      content.style.display = 'block';
      content.setAttribute('aria-hidden', 'false');
    }
    bump();
  });

  // ---------- ARIA genérico (fallback) ----------
  // Solo botones no-submit y role=button. Excluimos menús de navegación y
  // dropdowns de menú para no disparar navegaciones ni abrir megamenús.
  const NAV_SELECTOR = 'nav, [role="navigation"], .nav, .menu, .navbar, .main-menu, .site-navigation, .main-navigation, .primary-menu, header .menu';
  document.querySelectorAll(
    'button[aria-expanded="false"]:not([type="submit"]):not([data-toggle="dropdown"]):not([data-bs-toggle="dropdown"]):not(.dropdown-toggle), [role="button"][aria-expanded="false"]'
  ).forEach(el => {
    if (el.closest(NAV_SELECTOR)) return;
    safeClick(el);
  });

  console.log(`%c[Orbitalia Accordion Opener] ✅ Procesados: ${opened}`, 'color:#00a878;font-weight:bold');
})();
