# Orbitalia Accordion Opener

Extensión de Chrome (Manifest V3) que abre de un solo click todos los acordeones, toggles, tabs y elementos `<details>` de la página activa. Útil para auditorías SEO, revisiones de contenido y capturas completas de páginas con contenido oculto.

## Constructores / frameworks soportados

- **Divi** — `.et_pb_toggle`, tabs `.et_pb_tabs_controls`
- **Elementor** — accordion / toggle legacy (`.elementor-tab-title`, `.elementor-toggle-title`) y el nuevo widget basado en `<details>`
- **Gutenberg / WordPress core** — bloque Details (`<details>`)
- **Bootstrap 3 / 4 / 5** — `.collapse`, `.accordion-button.collapsed`, `.panel-collapse`
- **WPBakery / Visual Composer** — `.vc_tta-panel`
- **Beaver Builder** — `.fl-accordion-item`
- **Kadence Blocks** — `.kt-accordion-panel`, `.kt-blocks-accordion-header`
- **Oxygen Builder** — `.oxy-pro-accordion_row`
- **Ultimate Addons (UAGB)** — `.uagb-faq-item`
- **Stackable** — `.stk-block-accordion`
- **jQuery UI** — `.ui-accordion-header`
- **Foundation** — `.accordion-item`
- **Fallback ARIA** — cualquier `button`/`a`/`[role]` con `aria-expanded="false"`

Se ejecuta también dentro de iframes del mismo origen (`allFrames: true`).

## Instalación (modo desarrollador)

1. Descarga el ZIP desde GitHub (botón verde **Code → Download ZIP**) o clona el repo.
2. **Descomprime el ZIP** en una carpeta estable de tu equipo (p. ej. `Documentos/Extensiones/chrome-accordion-opener`). Chrome necesita acceso continuo a esa carpeta, así que no la borres ni la muevas después.
3. Abre `chrome://extensions/` en Chrome / Edge / Brave.
4. Activa **Modo de desarrollador** (esquina superior derecha).
5. Click en **Cargar descomprimida** y selecciona la carpeta descomprimida (la que contiene `manifest.json`, no el ZIP ni una carpeta padre).
6. (Opcional) Fija el icono a la barra de herramientas desde el menú de extensiones.

## Uso

1. Abre la página que quieras expandir.
2. Click en el icono de la extensión.
3. Todos los elementos colapsables compatibles se abren. La consola muestra el nº de elementos procesados.

## Estructura

```
chrome-accordion-opener/
├── manifest.json       # Manifest V3
├── background.js       # Service worker — inyecta content.js al click
├── content.js          # Lógica de apertura por framework
├── icons/              # 16 / 48 / 128 px
└── README.md
```

## Añadir soporte para otro constructor

Edita [`content.js`](content.js) y añade un bloque con el selector correspondiente. Formato:

```js
document.querySelectorAll('.mi-selector:not(.abierto)').forEach(el => {
  el.classList.add('abierto');
  bump();
});
```

O, si el framework usa handlers JS, simula el click:

```js
document.querySelectorAll('.mi-cabecera[aria-expanded="false"]').forEach(safeClick);
```

## Permisos

- `activeTab` — acceso solo a la pestaña activa al hacer click en el icono.
- `scripting` — necesario para inyectar `content.js` vía `chrome.scripting.executeScript`.

Sin `host_permissions` amplios: la extensión **no** lee ni modifica ninguna web hasta que el usuario hace click en el icono.

## Licencia

Uso interno Orbitalia. Ver [LICENSE](LICENSE).
