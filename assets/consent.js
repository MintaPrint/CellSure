/* CellSure cookie consent.
   Google Analytics and Google Ads load ONLY after the visitor clicks "Accept".
   "Reject" is as easy as "Accept". The choice is kept in this browser.
   Each page sets window.CS_TAGS (the Google tag IDs it uses) before loading this file.
   To reopen the choice from any page: csConsent.open() */
(function () {
  var KEY = "cs_consent";
  var tags = window.CS_TAGS || ["G-H4P8HEW8DB"];
  var loaded = false;

  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function loadGoogle() {
    if (loaded) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { dataLayer.push(arguments); };
    gtag("consent", "update", {
      analytics_storage: "granted", ad_storage: "granted",
      ad_user_data: "granted", ad_personalization: "granted"
    });
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + tags[0];
    document.head.appendChild(s);
    gtag("js", new Date());
    tags.forEach(function (id) { gtag("config", id); });
  }

  var css =
    "#cs-cookie{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:560px;margin:0 auto;" +
    "background:#131A24;color:#E5E9F0;border:1px solid #243042;border-radius:12px;padding:18px 18px 16px;" +
    "box-shadow:0 12px 40px rgba(0,0,0,.45);font:15px/1.5 Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif}" +
    "#cs-cookie p{margin:0 0 14px}#cs-cookie a{color:#22D3EE}" +
    "#cs-cookie .cs-row{display:flex;gap:10px;flex-wrap:wrap}" +
    "#cs-cookie button{flex:1 1 140px;border-radius:8px;padding:11px 14px;font:600 15px/1 Inter,system-ui,sans-serif;cursor:pointer;" +
    "border:1px solid #2563EB;background:transparent;color:#E5E9F0}" +
    "#cs-cookie button:focus-visible{outline:2px solid #22D3EE;outline-offset:2px}" +
    "#cs-cookie button.cs-yes{background:#2563EB;color:#fff}";

  function close() { var b = document.getElementById("cs-cookie"); if (b) b.remove(); }

  function open() {
    if (document.getElementById("cs-cookie")) return;
    if (!document.getElementById("cs-cookie-css")) {
      var st = document.createElement("style");
      st.id = "cs-cookie-css";
      st.textContent = css;
      document.head.appendChild(st);
    }
    var box = document.createElement("div");
    box.id = "cs-cookie";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-label", "Cookie choice");
    box.innerHTML =
      "<p>We use Google Analytics and Google Ads cookies to see how people find the site. " +
      "They only run if you say yes. <a href=\"/privacy/#cookies\">Read more</a></p>" +
      "<div class=\"cs-row\"><button type=\"button\" class=\"cs-no\">Reject</button>" +
      "<button type=\"button\" class=\"cs-yes\">Accept</button></div>";
    document.body.appendChild(box);
    box.querySelector(".cs-yes").addEventListener("click", function () { set("granted"); close(); loadGoogle(); });
    box.querySelector(".cs-no").addEventListener("click", function () {
      var was = get();
      set("denied");
      close();
      document.cookie.split(";").forEach(function (c) {
        var n = c.split("=")[0].trim();
        if (/^(_ga|_gid|_gcl|_gat)/.test(n)) {
          ["", "; domain=" + location.hostname, "; domain=." + location.hostname.replace(/^www\./, "")].forEach(function (d) {
            document.cookie = n + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" + d;
          });
        }
      });
      if (was === "granted") location.reload(); // stop Google running on this page
    });
  }

  window.csConsent = { open: open };

  var choice = get();
  if (choice === "granted") loadGoogle();
  else if (choice !== "denied") {
    if (document.body) open();
    else document.addEventListener("DOMContentLoaded", open);
  }
})();
