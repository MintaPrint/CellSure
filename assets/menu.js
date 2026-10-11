/* CellSure mobile menu: the 3-line button shows the page links on narrow screens. */
(function () {
  var header = document.querySelector("header");
  var btn = document.querySelector(".nav-toggle");
  var nav = document.querySelector("nav.main-nav");
  if (!header || !btn || !nav) return;

  var BARS = '<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  var CROSS = '<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

  function isOpen() { return header.classList.contains("menu-open"); }
  function set(open) {
    header.classList.toggle("menu-open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    btn.innerHTML = open ? CROSS : BARS;
  }

  btn.addEventListener("click", function (e) { e.stopPropagation(); set(!isOpen()); });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) set(false); });
  document.addEventListener("click", function (e) { if (isOpen() && !header.contains(e.target)) set(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && isOpen()) { set(false); btn.focus(); } });
  window.addEventListener("resize", function () { if (window.innerWidth >= 620 && isOpen()) set(false); });
})();
