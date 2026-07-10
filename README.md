# Henri Martin Immobilier — site vitrine

Site public de l'agence : **https://henrimartinimmobilier.com**

## Le site tient en 2 pages

| Fichier | Rôle | Données |
|---------|------|---------|
| `index.html` | Accueil (hero, off-market, réseau pro, vendre/estimer, investir) | Statique, autonome (CSS inline) |
| `location.html` | « À louer » — appartements off-market anonymisés | **En direct** de l'API backend |

**Source des locations** : `https://loffmarketimmo.com/api/public/locations`
(secteur / loyer / surface / pièces — jamais de photo ni d'adresse ; alimenté par le
pige-backend à partir des biens réels du réseau).

## Règle d'or : données RÉELLES uniquement

Aucune annonce de démonstration ne doit apparaître sur le site public. Toute page qui
liste des biens **doit** tirer ses données du backend (pas de JSON de démo committé).

## Déploiement

GitHub Actions (`.github/workflows/pages.yml`) publie la racine du repo à chaque push sur
`main`. Domaine custom via `CNAME`. HTTPS géré par GitHub Pages (Enforce HTTPS).
