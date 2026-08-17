#!/usr/bin/env node
// Génère une page « Prix au m² » à partir des statistiques DVF d'un secteur.
//
// Le site est statique (GitHub Pages) : les pages sont fabriquées ici puis commitées, plutôt
// que calculées à l'affichage. C'est le bon choix pour trois raisons — Google indexe des
// chiffres présents dans le HTML et non injectés par JavaScript ; la page reste instantanée ;
// et les données DVF ne changent que deux fois par an, donc régénérer à la parution suffit.
//
// Usage :
//   node tools/generer-prix-m2.js tools/16e.json          → écrit prix-m2-paris-16.html
//   node tools/generer-prix-m2.js tools/16e.json --stdout  → affiche sans écrire
//   node tools/generer-prix-m2.js tools/16e.json --voisins=15,17,8
//
// L'entrée est la réponse de GET /api/admin/dvf/secteur (pige-backend), enrichie du numéro
// d'arrondissement et du millésime.
//
// RÈGLE ABBAS — LE NUMÉRO DE VOIE NE SORT JAMAIS : les libellés de rues arrivent déjà
// nettoyés du numéro par le service. Ce générateur n'en réintroduit aucun.

const fs = require("fs");
const path = require("path");

const ordinal = (n) => (n === 1 ? "1er" : `${n}e`);

const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// Espaces insécables entre les groupes de chiffres — lisible, et jamais coupé en fin de ligne.
const nb = (n) => Number(n).toLocaleString("fr-FR").replace(/ | | /g, "&nbsp;");
const eur = (n) => `${nb(n)}&nbsp;€`;
const ppm2 = (n) => `${nb(n)}&nbsp;€/m²`;

const piecesLabel = (p) =>
  p.cinqEtPlus ? "5 pièces et plus" : p.pieces === 1 ? "Studio / 1 pièce" : `${p.pieces} pièces`;

function page(d) {
  const arr = d.arrondissement;
  const nomArr = `Paris ${ordinal(arr)}`;
  const titre = `Prix au m² à ${nomArr} — ${d.millesime} | Henri Martin Immobilier`;
  const desc = `Prix au m² à ${nomArr} : ${nb(d.ppm2Median)} €/m² en médiane sur ${nb(d.ventes)} ventes réellement signées en ${d.millesime}. Détail par typologie et par rue, source DVF.`;
  const url = `https://henrimartinimmobilier.com/prix-m2-paris-${arr}.html`;

  const lignesPieces = d.parPieces.map((p) => `
        <tr><td>${piecesLabel(p)}</td><td class="num">${ppm2(p.ppm2Median)}</td><td class="num">${p.surfaceMediane}&nbsp;m²</td><td class="num">${eur(p.prixMedian)}</td><td class="num mut">${nb(p.ventes)}</td></tr>`).join("");

  const lignesRues = d.rues.map((r, i) => `
        <tr><td class="mut num">${i + 1}</td><td>${esc(r.voie)}</td><td class="num">${ppm2(r.ppm2Median)}</td><td class="num">${eur(r.prixMedian)}</td><td class="num mut">${nb(r.ventes)}</td></tr>`).join("");

  // Le JSON-LD Dataset dit à Google ce que la page contient vraiment : des données publiques
  // agrégées, avec leur source et leur période. C'est ce qui la distingue d'une page vide.
  const ld = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `Prix au m² des appartements à ${nomArr} en ${d.millesime}`,
    description: `Prix au m² médian, par typologie et par rue, à ${nomArr}, calculés sur ${d.ventes} ventes d'appartements réellement signées en ${d.millesime}.`,
    url,
    temporalCoverage: String(d.millesime),
    spatialCoverage: { "@type": "Place", name: nomArr, address: { "@type": "PostalAddress", postalCode: d.zip, addressLocality: "Paris", addressCountry: "FR" } },
    isBasedOn: { "@type": "Dataset", name: "Demandes de valeurs foncières (DVF)", url: "https://www.data.gouv.fr/fr/datasets/demandes-de-valeurs-foncieres/", creator: { "@type": "Organization", name: "Direction générale des Finances publiques" } },
    creator: { "@type": "RealEstateAgent", name: "Henri Martin Immobilier", url: "https://henrimartinimmobilier.com/" },
    license: "https://www.etalab.gouv.fr/licence-ouverte-open-licence",
  };

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titre)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(titre)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:locale" content="fr_FR">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${esc(titre)}">
<meta name="twitter:description" content="${esc(desc)}">
<style>
  :root{
    --ink:#22201A; --gold:#9C4A34; --gold-2:#B7784F; --gold-3:#D9917A; --cream:#F4F0E6; --paper:#FBF8F0;
    --soft:#F0EADA; --line:#D9D0B8; --mut:#8C8367; --on-dark:#D9D0B8; --on-dark-2:#B7AC8A;
    --serif:Georgia,"Times New Roman",serif;
    --sans:-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
    --mono:'SF Mono','Courier New',monospace;
  }
  *{box-sizing:border-box;margin:0;padding:0;border-radius:0}
  html{scroll-behavior:smooth}
  body{font-family:var(--sans);color:var(--ink);background:var(--paper);line-height:1.55;-webkit-font-smoothing:antialiased}
  a{color:inherit}
  .wrap{max-width:1160px;margin:0 auto;padding:0 24px}
  .serif{font-family:var(--serif)}
  .eyebrow{font-family:var(--mono);font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);font-weight:400}
  .num{font-variant-numeric:tabular-nums;white-space:nowrap}
  .mut{color:var(--mut)}
  @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
  header.top{background:var(--ink);color:var(--cream)}
  .nav{display:flex;align-items:center;justify-content:space-between;padding:18px 0;gap:16px}
  .brand{font-family:var(--serif);font-size:19px;letter-spacing:.02em;text-decoration:none;color:var(--cream)}
  .brand small{display:block;font-family:var(--sans);font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:#B7AC8A;margin-top:2px}
  .nav-links{display:flex;gap:22px;font-size:13.5px}
  .nav-links a{color:#D9D0B8;text-decoration:none}
  .nav-links a:hover,.nav-links a.on{color:var(--cream)}
  .nav-cta{border:1px solid var(--gold);color:var(--gold-2);padding:9px 15px;font-size:12.5px;letter-spacing:.06em;text-transform:uppercase;text-decoration:none;white-space:nowrap}
  @media(max-width:820px){.nav-links{display:none}}
  .bread{padding:14px 0;font-size:12.5px;color:var(--mut);border-bottom:1px solid var(--line)}
  .bread a{color:var(--gold);text-decoration:none}
  .bread a:hover{text-decoration:underline}
  .cle{background:var(--ink);color:var(--cream);padding:54px 0 50px}
  .cle h1{font-family:var(--serif);font-weight:400;font-size:clamp(28px,4.4vw,42px);line-height:1.12;margin:12px 0 0;max-width:22ch}
  .cle h1 i{color:var(--gold-2);font-style:italic}
  .cle .kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:1px;background:#332F22;border:1px solid #332F22;margin-top:30px}
  .kpi{background:#26231A;padding:20px 22px}
  .kpi .k{font-family:var(--mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--on-dark-2)}
  .kpi .v{font-family:var(--serif);font-size:clamp(24px,3.2vw,32px);color:var(--cream);margin-top:7px;line-height:1.1}
  .kpi .v b{color:var(--gold-3);font-weight:400}
  .kpi .s{font-size:12.5px;color:var(--on-dark-2);margin-top:5px;line-height:1.45}
  .sec{padding:56px 0;border-bottom:1px solid var(--line)}
  .sec h2{font-family:var(--serif);font-weight:400;font-size:clamp(24px,3.2vw,32px);margin:8px 0 6px}
  .sec .sub{color:var(--mut);font-size:14.5px;max-width:66ch;margin-bottom:22px}
  .tw{overflow-x:auto;border:1px solid var(--line);background:#fff}
  table{border-collapse:collapse;width:100%;font-size:14px;min-width:560px}
  th{background:var(--ink);color:var(--cream);text-align:left;padding:12px 15px;font:700 11.5px var(--sans);letter-spacing:.06em;text-transform:uppercase;white-space:nowrap}
  th.num,td.num{text-align:right}
  td{padding:11px 15px;border-bottom:1px solid var(--line);color:#5A5140}
  tr:last-child td{border-bottom:none}
  td:first-child,td:nth-child(2){color:var(--ink)}
  tbody tr:nth-child(even) td{background:#FCFAF5}
  .meth{background:var(--soft);padding:48px 0}
  .meth h2{font-family:var(--serif);font-weight:400;font-size:24px;margin-bottom:10px}
  .meth p{font-size:13.5px;color:#5A5140;max-width:78ch;margin:9px 0;line-height:1.65}
  .meth a{color:var(--gold);text-decoration:none}
  .meth a:hover{text-decoration:underline}
  .cta{background:var(--ink);color:var(--cream);padding:54px 0}
  .cta .wrap{display:flex;align-items:center;justify-content:space-between;gap:22px;flex-wrap:wrap}
  .cta h3{font-family:var(--serif);font-weight:400;font-size:26px;max-width:30ch}
  .cta p{color:#B7AC8A;font-size:14px;margin-top:6px;max-width:54ch}
  .cta a{background:var(--gold);color:var(--cream);text-decoration:none;padding:14px 22px;font-weight:700;font-size:13px;letter-spacing:.05em;text-transform:uppercase;white-space:nowrap}
  .voisins{padding:34px 0;font-size:13.5px}
  .voisins .k{font-family:var(--mono);font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--mut);margin-bottom:10px}
  .voisins .liens{display:flex;flex-wrap:wrap;gap:9px}
  .voisins a{border:1px solid var(--line);padding:7px 13px;text-decoration:none;color:var(--ink);background:#fff}
  .voisins a:hover{border-color:var(--gold);color:var(--gold)}
  footer.site{background:#171510;color:#8C8367;font-size:13px;padding:52px 0 26px}
  footer.site .cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:26px}
  footer.site h5{color:var(--on-dark);font-size:12px;font-weight:700;margin-bottom:9px;letter-spacing:.05em;text-transform:uppercase}
  footer.site a{color:var(--gold-2);text-decoration:none}
  footer.site a:hover{text-decoration:underline}
  footer.site .foot{border-top:1px solid rgba(201,168,76,.18);margin-top:24px;padding-top:16px;font-size:12px;color:#8C8367;display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px}
</style>
<script type="application/ld+json">
${JSON.stringify(ld, null, 1)}
</script>
<script src="/assets/mesure.js" defer></script>
</head>
<body>

<header class="top">
  <div class="wrap nav">
    <a class="brand" href="index.html">Henri Martin Immobilier<small>Vente · Location · Investissement</small></a>
    <nav class="nav-links">
      <a href="index.html">Accueil</a>
      <a href="ventes.html">À vendre</a>
      <a href="location.html">À louer</a>
      <a href="vendre.html">Vendre</a>
      <a href="quartiers.html" class="on">Quartiers</a>
      <a href="agence.html">L'agence</a>
    </nav>
    <a class="nav-cta" href="vendre.html#estimation">Estimer mon bien</a>
  </div>
</header>

<div class="wrap bread"><a href="index.html">Accueil</a> · <a href="quartiers.html">Quartiers</a> · Prix au m² à ${nomArr}</div>

<section class="cle">
  <div class="wrap">
    <p class="eyebrow">Ventes réellement signées · ${d.millesime}</p>
    <h1 class="serif">Prix au m² à <i>${nomArr}</i></h1>
    <div class="kpis">
      <div class="kpi">
        <div class="k">Prix médian</div>
        <div class="v"><b>${ppm2(d.ppm2Median)}</b></div>
        <div class="s">La moitié des ventes s'est faite au-dessus, l'autre en dessous.</div>
      </div>
      <div class="kpi">
        <div class="k">Fourchette courante</div>
        <div class="v">${nb(d.ppm2P25)} – ${ppm2(d.ppm2P75)}</div>
        <div class="s">La moitié centrale des ventes. En dehors : biens d'exception ou à rénover.</div>
      </div>
      <div class="kpi">
        <div class="k">Appartement médian</div>
        <div class="v">${eur(d.prixMedian)}</div>
        <div class="s">Pour ${d.surfaceMediane}&nbsp;m², la surface médiane vendue.</div>
      </div>
      <div class="kpi">
        <div class="k">Base de calcul</div>
        <div class="v">${nb(d.ventes)}</div>
        <div class="s">Ventes d'appartements signées chez notaire en ${d.millesime}.</div>
      </div>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <p class="eyebrow">Par typologie</p>
    <h2 class="serif">Le prix ne se lit pas pareil selon la taille.</h2>
    <p class="sub">Les petites surfaces se vendent plus cher au mètre carré que les moyennes ; les grands appartements repartent à la hausse, parce qu'ils sont rares et souvent mieux placés.</p>
    <div class="tw">
      <table>
        <thead><tr><th>Typologie</th><th class="num">Prix au m²</th><th class="num">Surface médiane</th><th class="num">Prix médian</th><th class="num">Ventes</th></tr></thead>
        <tbody>${lignesPieces}
        </tbody>
      </table>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <p class="eyebrow">Rue par rue</p>
    <h2 class="serif">Les ${d.rues.length} voies les plus actives.</h2>
    <p class="sub">Classées par nombre de ventes, pas par prix : ce sont les rues sur lesquelles on dispose du plus de recul. Une rue absente n'est pas une rue sans transaction — simplement trop peu pour en tirer une médiane fiable.</p>
    <div class="tw">
      <table>
        <thead><tr><th class="num">#</th><th>Voie</th><th class="num">Prix au m²</th><th class="num">Prix médian</th><th class="num">Ventes</th></tr></thead>
        <tbody>${lignesRues}
        </tbody>
      </table>
    </div>
  </div>
</section>

<section class="cta">
  <div class="wrap">
    <div>
      <h3 class="serif">Ces chiffres sont une moyenne. Votre bien, non.</h3>
      <p>Étage, exposition, état, vis-à-vis, ascenseur : l'écart entre deux appartements d'une même rue dépasse souvent 20 %. Notre estimation part de ces ventes-là, puis les ajuste à votre bien.</p>
    </div>
    <a href="vendre.html#estimation">Estimer mon bien</a>
  </div>
</section>

<section class="meth">
  <div class="wrap">
    <p class="eyebrow">Méthode</p>
    <h2 class="serif">D'où viennent ces chiffres</h2>
    <p>De la base <b>DVF — Demandes de valeurs foncières</b>, publiée par la Direction générale des Finances publiques : l'enregistrement des ventes réellement signées chez notaire. Ce ne sont pas des prix d'annonces, qui reflètent ce qu'un vendeur espère, mais des prix effectivement payés.</p>
    <p>Périmètre retenu : appartements vendus à ${nomArr} en ${d.millesime}, hors ventes en viager, hors parkings et caves isolés, hors surfaces inférieures à 9&nbsp;m². Les valeurs aberrantes (moins de 6&nbsp;000&nbsp;€/m² ou plus de 40&nbsp;000&nbsp;€/m² à Paris) sont écartées : elles correspondent presque toujours à des ventes entre proches, des démembrements ou des erreurs de saisie.</p>
    <p>Nous publions le <b>nom des rues, jamais les numéros</b> — les données sont publiques, mais aucun logement n'a à être identifiable depuis une page de statistiques.</p>
    <p>Source ouverte : <a href="https://www.data.gouv.fr/fr/datasets/demandes-de-valeurs-foncieres/" target="_blank" rel="noopener">data.gouv.fr — DVF</a>, licence Etalab. Mise à jour à chaque parution semestrielle.</p>
  </div>
</section>

<section class="voisins">
  <div class="wrap">
    <div class="k">Autres arrondissements</div>
    <div class="liens">__VOISINS__</div>
  </div>
</section>

<footer class="site"><div class="wrap">
  <div class="cols">
    <div><h5>HM Immobilier</h5>SASU Henri Martin Immobilier<br>58 rue de Monceau, CS 48756, 75008 Paris<br>RCS Paris 942 327 941<br>Carte T CPI 7501 2026 000 000 160<br><a href="investir.html">Investir à Paris →</a></div>
    <div><h5>Contact</h5>06 25 22 61 94<br><a href="mailto:contact@henrimartinimmobilier.com">contact@henrimartinimmobilier.com</a><br>Réponse sous 24 h ouvrées</div>
    <div><h5>Quartiers</h5><a href="quartier-auteuil.html">Auteuil (16e)</a><br><a href="quartier-passy.html">Passy (16e)</a><br><a href="quartier-monceau.html">Monceau (8e · 17e)</a><br><a href="quartier-quinzieme.html">15e arrondissement</a><br><a href="quartiers.html">Tous les quartiers →</a></div>
    <div><h5>Mentions légales</h5>CCI Paris Île-de-France<br>Non soumise à garantie financière (absence de maniement de fonds)<br><a href="https://loffmarketimmo.com/mentions-legales" target="_blank" rel="noopener">Mentions légales complètes →</a><br><a href="https://loffmarketimmo.com/api/reseau/presentation" target="_blank" rel="noopener">Professionnels : rejoindre le réseau →</a><br><a href="https://loffmarketimmo.com/api/reseau/concept" target="_blank" rel="noopener">Comment ça marche, pour chacun →</a></div>
  </div>
  <div class="foot"><span>© 2026 Henri Martin Immobilier — Paris.</span><span>Vente · Location · Investissement · Estimation.</span></div>
</div></footer>

</body>
</html>
`;
}

// --- exécution ---------------------------------------------------------------
const args = process.argv.slice(2);
const src = args.find((a) => !a.startsWith("--"));
if (!src) {
  console.error("usage : node tools/generer-prix-m2.js <stats.json> [--stdout] [--voisins=1,2,3]");
  process.exit(1);
}
const d = JSON.parse(fs.readFileSync(src, "utf8"));

// Maillage interne : liens vers les arrondissements dont la page existe déjà. Sans argument,
// on ne fabrique aucun lien mort — c'est la génération complète qui les remplira.
const dispo = (args.find((a) => a.startsWith("--voisins=")) || "").split("=")[1];
const voisins = dispo
  ? dispo.split(",").map(Number).filter((n) => n && n !== d.arrondissement)
      .map((n) => `<a href="prix-m2-paris-${n}.html">Paris ${ordinal(n)}</a>`).join("")
  : '<a href="quartiers.html">Voir tous les quartiers →</a>';

const html = page(d).replace("__VOISINS__", voisins);

if (args.includes("--stdout")) {
  process.stdout.write(html);
} else {
  const out = path.join(__dirname, "..", `prix-m2-paris-${d.arrondissement}.html`);
  fs.writeFileSync(out, html);
  console.log(`écrit : ${path.basename(out)} — ${d.ventes} ventes, ${d.rues.length} rues`);
}
