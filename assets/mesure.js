/* Mesure d'audience — Google Analytics 4 + consentement (Consent Mode v2, mode basique).
   INERTE tant que HMI_GA4_ID est vide : aucun script chargé, aucun bandeau affiché,
   le site se comporte exactement comme avant. Pour activer : renseigner l'ID "G-XXXXXXX"
   ci-dessous (propriété GA4 créée dans le compte Google de l'agence) et déployer.
   Choix CNIL conservateur : gtag.js n'est chargé qu'APRÈS le consentement explicite —
   aucun cookie, aucun appel Google avant le clic « Accepter ». Le refus est mémorisé
   6 mois et ne recharge jamais rien. */
(function () {
  "use strict";
  var HMI_GA4_ID = ""; // ← ID de mesure GA4 (G-XXXXXXX). Vide = tout est désactivé.

  if (!HMI_GA4_ID) { window.hmiEvent = function () {}; return; }

  var KEY = "hmi_consent"; // "granted" | "denied", avec horodatage
  var SIX_MONTHS = 182 * 24 * 3600 * 1000;

  function readChoice() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var c = JSON.parse(raw);
      if (!c.t || Date.now() - c.t > SIX_MONTHS) { localStorage.removeItem(KEY); return null; }
      return c.v === "granted" ? "granted" : "denied";
    } catch (e) { return null; }
  }
  function saveChoice(v) {
    try { localStorage.setItem(KEY, JSON.stringify({ v: v, t: Date.now() })); } catch (e) {}
  }

  var queued = [];
  var loaded = false;
  window.hmiEvent = function (name, params) {
    if (loaded && window.gtag) { window.gtag("event", name, params || {}); }
    else { queued.push([name, params || {}]); }
  };

  function loadGA() {
    if (loaded) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("consent", "default", {
      ad_storage: "granted", ad_user_data: "granted",
      ad_personalization: "granted", analytics_storage: "granted"
    });
    window.gtag("config", HMI_GA4_ID, { anonymize_ip: true });
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + HMI_GA4_ID;
    document.head.appendChild(s);
    for (var i = 0; i < queued.length; i++) window.gtag("event", queued[i][0], queued[i][1]);
    queued = [];
  }

  function showBanner() {
    var b = document.createElement("div");
    b.setAttribute("role", "dialog");
    b.setAttribute("aria-label", "Consentement à la mesure d'audience");
    b.style.cssText = "position:fixed;left:0;right:0;bottom:0;z-index:9999;background:#22201A;color:#F4F0E6;" +
      "font:13px/1.5 -apple-system,'Segoe UI',Roboto,Arial,sans-serif;padding:14px 20px;display:flex;" +
      "flex-wrap:wrap;gap:12px;align-items:center;justify-content:center;box-shadow:0 -2px 14px rgba(0,0,0,.25)";
    var txt = document.createElement("span");
    txt.textContent = "Ce site mesure sa fréquentation (Google Analytics) uniquement avec votre accord.";
    var ok = document.createElement("button");
    ok.textContent = "Accepter";
    ok.style.cssText = "background:#9C4A34;color:#F4F0E6;border:none;padding:9px 20px;font:600 13px inherit;cursor:pointer";
    var no = document.createElement("button");
    no.textContent = "Continuer sans accepter";
    no.style.cssText = "background:none;color:#B7AC8A;border:1px solid #B7AC8A;padding:8px 16px;font:13px inherit;cursor:pointer";
    ok.onclick = function () { saveChoice("granted"); b.remove(); loadGA(); };
    no.onclick = function () { saveChoice("denied"); b.remove(); };
    b.appendChild(txt); b.appendChild(ok); b.appendChild(no);
    document.body.appendChild(b);
  }

  var choice = readChoice();
  if (choice === "granted") loadGA();
  else if (choice === null) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", showBanner);
    else showBanner();
  }
})();
