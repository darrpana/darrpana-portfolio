/* Hand-drawn SVG icon set. Swap any string for final artwork (inline SVG or <img>). */
window.Cafe.icons = (function () {
  const s = (vb, body, extra = "") =>
    `<svg viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" ${extra}>${body}</svg>`;

  return {
    bean: s("0 0 24 24", `<ellipse cx="12" cy="12" rx="7" ry="9.5" transform="rotate(30 12 12)" fill="#4a2e1f" stroke="#151515" stroke-width="1.6"/><path d="M8.6 5.6c3 2.6.6 6.6 3.4 9.2 1.2 1.1 1.6 2.2 1.4 3.4" stroke="#f1e3cc" stroke-width="1.5"/>`),
    arrowDown: s("0 0 24 24", `<path d="M12 4v15M6 13l6 6 6-6"/>`),
    arrowCurve: s("0 0 48 40", `<path d="M6 4c2 14 14 24 32 26"/><path d="M30 22l9 8-11 4"/>`),
    arrowCurveLeft: s("0 0 54 40", `<path d="M48 6C40 22 26 30 8 30"/><path d="M16 22l-9 8 10 5"/>`),
    star: s("0 0 40 40", `<path d="M20 4l3.6 11.2L35 19l-11.4 3.6L20 34l-3.6-11.4L5 19l11.4-3.8z" fill="currentColor" stroke="#151515" stroke-width="1.6"/>`),
    squiggle: s("0 0 120 24", `<path d="M4 14c8-10 14-10 20 0s14 10 20 0 14-10 20 0 14 10 20 0 14-10 20 0" stroke-width="3"/>`),
    blob: `<svg viewBox="0 0 600 600" aria-hidden="true" focusable="false"><path fill="currentColor" d="M470 120c70 70 90 190 40 290s-170 160-280 140S40 450 40 330 120 110 220 70s180-20 250 50z"/></svg>`,

    // Social
    instagram: s("0 0 24 24", `<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none"/>`),
    linkedin: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4v11H3zM9.5 9.75h3.8v1.6h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.6 4.77 6v6.46h-4v-5.73c0-1.37-.03-3.13-1.9-3.13-1.92 0-2.2 1.48-2.2 3.03v5.83h-4z"/></svg>`,
    behance: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor"><path d="M8.2 11.3c.9-.4 1.5-1.2 1.5-2.3 0-2.1-1.6-2.9-3.6-2.9H1v11.6h5.3c2.1 0 4-1 4-3.3 0-1.4-.7-2.6-2.1-3.1zM3.4 8h2.2c.9 0 1.6.2 1.6 1.2 0 .9-.6 1.3-1.5 1.3H3.4zm2.5 7.8H3.4v-3.3H6c1 0 1.8.4 1.8 1.6 0 1.3-.9 1.7-1.9 1.7zM15.4 7.1h5V8.4h-5zM18 9.4c-2.8 0-4.6 1.9-4.6 4.4 0 2.6 1.6 4.4 4.6 4.4 2.2 0 3.7-1 4.4-3.1h-2.3c-.3.8-1.2 1.2-2 1.2-1.5 0-2.3-.9-2.3-2.4h6.8c.2-2.8-1.4-4.5-4.6-4.5zm-2.2 3.6c.1-1.1.8-1.8 2.1-1.8 1.2 0 1.9.7 2 1.8z"/></svg>`,

    // Career timeline symbols
    type: s("0 0 48 48", `<path d="M8 38L18 10l10 28M12 28h12"/><path d="M30 26c2-3 8-3 9 1v11M39 32c-5-1-9 0-9 3s5 4 9 0"/><path d="M6 43c10-2 26-2 36 0" stroke-width="1.6" opacity=".6"/>`),
    wireframe: s("0 0 48 48", `<rect x="7" y="8" width="34" height="32" rx="4"/><path d="M7 16h34M13 22h10M13 27h14M13 32h8"/><rect x="29" y="22" width="7" height="12" rx="1.5"/><circle cx="11" cy="12" r=".8" fill="currentColor"/>`),
    overlap: s("0 0 48 48", `<circle cx="18" cy="24" r="12"/><circle cx="30" cy="24" r="12"/><path d="M24 14c3 3 3 17 0 20" stroke-width="3"/>`),
    kite: s("0 0 48 48", `<path d="M6 22L42 8 30 40l-7-12z"/><path d="M42 8L23 28M23 28l-3 10 6-6"/>`),
    star2: s("0 0 48 48", `<path d="M24 6l4.6 12.6L42 20l-10.4 8.4L35 42l-11-7.6L13 42l3.4-13.6L6 20l13.4-1.4z"/><path d="M38 6l1.4 3M43 12l-3 1" stroke-width="1.6"/>`),
    brain: s("0 0 48 48", `<path d="M16 34c-6 0-10-4-10-9 0-3 2-6 5-7-1-5 3-9 8-8 2-3 7-4 10-1 4-2 9 1 9 5 4 1 6 5 4 9 2 3 0 8-4 9-1 4-6 6-10 4-3 3-9 2-12-2z"/><path d="M24 10v26M17 18c3 0 5 2 5 5M31 17c-3 1-4 3-4 6M15 27c3-1 5 0 7 2M33 28c-3-1-5 0-6 2"/><path d="M14 42c1-3 3-5 6-6" stroke-dasharray="2 4"/>`),
    cupSmall: s("0 0 48 48", `<path d="M10 18h24l-2 18a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4z" fill="#fbf8f2" stroke="#151515" stroke-width="2.2"/><path d="M33 22c6 0 7 9 0 10" stroke="#151515" stroke-width="2.2"/><path d="M11 22h22" stroke="#d62a7e" stroke-width="2.2"/><path d="M18 13c-2-2 2-4 0-7M26 13c-2-2 2-4 0-7" stroke="#72cfb8" stroke-width="2"/>`),
  };
})();
