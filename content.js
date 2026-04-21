(() => {
  let opened = 0;
  const bump = () => { opened++; };

  const safeClick = (el) => {
    try { el.click(); bump(); } catch (_) {}
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
  document.querySelectorAll('.et_pb_tabs_controls li:not(.et_pb_tab_active) a').forEach(el => safeClick(el));

  // ---------- Elementor legacy (accordion + toggle + tabs) ----------
  document.querySelectorAll('.elementor-tab-title:not(.elementor-active)').forEach(el => safeClick(el));
  document.querySelectorAll('.elementor-toggle-title:not(.elementor-active)').forEach(el => safeClick(el));

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
  document.querySelectorAll('.kt-blocks-accordion-header[aria-expanded="false"]').forEach(el => safeClick(el));

  // ---------- Oxygen Builder ----------
  document.querySelectorAll('.oxy-pro-accordion_row:not(.oxy-pro-accordion-row-active)').forEach(el => {
    el.classList.add('oxy-pro-accordion-row-active');
    bump();
  });

  // ---------- GenerateBlocks / Stackable / Ultimate Addons ----------
  document.querySelectorAll('.uagb-faq-item:not(.uagb-faq-item-active)').forEach(el => {
    el.classList.add('uagb-faq-item-active');
    bump();
  });
  document.querySelectorAll('.stk-block-accordion:not([data-open])').forEach(el => {
    el.setAttribute('data-open', 'true');
    bump();
  });

  // ---------- jQuery UI accordion ----------
  document.querySelectorAll('.ui-accordion-header:not(.ui-accordion-header-active)').forEach(el => safeClick(el));

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

  // ---------- ARIA genérico (último, captura cualquier patrón estándar) ----------
  document.querySelectorAll('[aria-expanded="false"]').forEach(el => {
    const tag = el.tagName.toLowerCase();
    if (tag === 'button' || tag === 'a' || el.hasAttribute('role')) {
      safeClick(el);
    }
  });

  console.log(`%c[Orbitalia Accordion Opener] ✅ Procesados: ${opened}`, 'color:#00a878;font-weight:bold');
})();
