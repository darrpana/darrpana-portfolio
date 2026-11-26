/* Boot: render every [data-component] placeholder from config, then initialise it. */
(function () {
  const { components, cfg, observeReveals, requestFrame } = window.Cafe;
  document.documentElement.classList.remove("no-js");
  // Old ?p= links are redirected to clean URLs, but Netlify keeps the query: drop it from the address bar
  const path = location.pathname.split("/").filter(Boolean);
  if (path.length === 2 && new URLSearchParams(location.search).has("p")) history.replaceState(null, "", location.pathname + location.hash);

  const mounts = Array.from(document.querySelectorAll("[data-component]"));
  mounts.forEach((el) => {
    const c = components[el.dataset.component];
    if (!c) { console.warn("Unknown component:", el.dataset.component); return; }
    if (c.render) el.innerHTML = c.render(cfg(), el);
  });
  mounts.forEach((el) => {
    const c = components[el.dataset.component];
    if (c && c.init) c.init(el, cfg());
  });

  observeReveals();
  requestFrame();

  // Honour a hash in the URL after content has been rendered (e.g. index.html#work from a subpage).
  if (window.location.hash) {
    const target = document.getElementById(window.location.hash.slice(1));
    if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: "instant" }));
  }
})();
