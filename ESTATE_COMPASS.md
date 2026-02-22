# 🧭 Estate Compass — Guide de Référence Rapide

Ce document identifie les composants clés du projet **Estate Compass** (Henri Martin Immobilier) dans ce dépôt, fournit le lien direct vers l'interface utilisateur, explique comment lancer des recherches et comment redémarrer les services.

---

## 🔗 Lien vers l'interface UI

| Environnement | URL |
|---|---|
| **Domaine personnalisé (production)** | **[https://henrimartinimmobilier.com/](https://henrimartinimmobilier.com/)** |
| **GitHub Pages (miroir)** | [https://abbasberrada91.github.io/agent-immo/](https://abbasberrada91.github.io/agent-immo/) |

> **Point d'entrée HTML** : [`index.html`](index.html) — page d'accueil principale avec catalogue de biens, filtres et barre de recherche.

---

## 🏗️ Composants du projet

| Composant | Fichier(s) | Rôle |
|---|---|---|
| **Page d'accueil / UI** | `index.html` | Catalogue de biens, recherche, filtres Vente/Location |
| **Logique de recherche** | `script.js` | Filtrage des biens (zone, type, budget) depuis `biens.json` |
| **Données des biens** | `biens.json` | Source de données (JSON) de tous les biens immobiliers |
| **Authentification** | `auth.js` | Gestion de session via `localStorage` |
| **API GitHub** | `api.js` | Ajout / modification / suppression de biens via l'API GitHub |
| **Formulaire d'ajout** | `ajouter_appartement.html` | Interface de publication d'un nouveau bien |
| **Interface admin** | `admin_properties.html` | Gestion complète des biens (recherche, modification, suppression) |
| **Style** | `styles.css`, `drawer.css` | Feuilles de style |
| **Menu mobile** | `drawer.js` | Menu responsive |
| **Déploiement frontend** | `.github/workflows/pages.yml` | Déploiement automatique sur GitHub Pages à chaque push sur `main` |
| **Ajout de bien (workflow)** | `.github/workflows/add-property.yml` | Ajoute un bien à `biens.json` via GitHub Actions |
| **Cloudinary (fiches)** | `.github/workflows/cloudinary-gallery.yml` | Génère les fiches de biens depuis un dossier Cloudinary |
| **Script de génération** | `scripts/generate_fiche_from_cloudinary.js` | Génération automatique de fiches depuis Cloudinary |

---

## 🔍 Lancer une recherche de biens (prospection)

### Depuis l'interface web

1. Ouvrez **[https://henrimartinimmobilier.com/](https://henrimartinimmobilier.com/)**
2. Dans la **barre de recherche** au centre de la page, renseignez :
   - **Zone** : ville ou quartier (ex : `Paris`, `Lyon`, `16e`)
   - **Type** : sélectionnez dans la liste (`Appartement`, `Maison`, `Villa`, etc.)
   - **Budget max** : montant en euros (ex : `500000` pour une vente, `2000` pour une location)
3. Cliquez sur **Rechercher**
4. Utilisez les boutons de filtre **Tous / Vente / Location** pour affiner l'affichage

### Depuis le code (`script.js`)

La logique de filtrage se trouve dans `script.js` — fonction `matchesFilters()` :

```js
const matchesFilters = (property) => {
  const transactionMatch = state.activeTransaction === 'all' || property.transaction === state.activeTransaction;
  const zoneMatch = !state.zone || property.city.toLowerCase().includes(state.zone) || property.district.toLowerCase().includes(state.zone);
  const typeMatch = !state.type || property.propertyType === state.type;
  const budgetMatch = state.budget === null || property.price <= state.budget;
  return transactionMatch && zoneMatch && typeMatch && budgetMatch;
};
```

### Ajouter un bien à prospecter (via workflow GitHub Actions)

Pour déclencher une recherche/ajout via le workflow `add-property.yml` :

1. Allez sur **[GitHub Actions](https://github.com/abbasberrada91/agent-immo/actions/workflows/add-property.yml)**
2. Cliquez sur **"Run workflow"**
3. Collez le JSON du bien dans le champ `property_json`
4. Cliquez sur **"Run workflow"** (bouton vert)

Exemple de JSON :

```json
{
  "reference": "VT-1234",
  "transaction": "vente",
  "propertyType": "Appartement",
  "title": "Appartement lumineux",
  "city": "Paris",
  "district": "11e",
  "surface": 65,
  "rooms": 3,
  "price": 480000,
  "features": ["Balcon", "Parquet"],
  "image": "https://images.unsplash.com/photo-...",
  "alt": "Vue de l'appartement",
  "brochureUrl": null
}
```

### Générer une fiche depuis Cloudinary

Pour créer ou mettre à jour une fiche de bien à partir d'un dossier Cloudinary :

1. Allez sur **[GitHub Actions — Cloudinary Gallery](https://github.com/abbasberrada91/agent-immo/actions/workflows/cloudinary-gallery.yml)**
2. Cliquez sur **"Run workflow"**
3. Saisissez le nom du dossier Cloudinary (ex : `V01`, `LC01`)
4. Cliquez sur **"Run workflow"**

---

## 🔄 Redémarrer / Relancer les services

### Frontend (GitHub Pages)

Le site est **statique** — il n'y a pas de serveur backend à redémarrer. Le déploiement se fait automatiquement à chaque push sur la branche `main`.

#### Redéployer manuellement

1. Allez sur **[GitHub Actions — Deploy Pages](https://github.com/abbasberrada91/agent-immo/actions/workflows/pages.yml)**
2. Cliquez sur **"Run workflow"**
3. Sélectionnez la branche `main`
4. Cliquez sur **"Run workflow"** (bouton vert)
5. Attendez **1 à 2 minutes** — le site est mis à jour

#### Redéployer via `git push`

```bash
git add .
git commit -m "Redéploiement forcé"
git push origin main
```

Le workflow `pages.yml` se déclenche automatiquement.

### Développement local (serveur local)

Pour tester les changements en local avant de déployer :

```bash
# Démarrer un serveur local
python3 -m http.server 4173

# Ouvrir dans le navigateur
# http://localhost:4173
```

> **Note** : Utilisez `Ctrl+C` dans le terminal pour arrêter le serveur local.

### Relancer un workflow en erreur

Si un workflow GitHub Actions échoue :

1. Allez sur **[GitHub Actions](https://github.com/abbasberrada91/agent-immo/actions)**
2. Cliquez sur le workflow en erreur
3. Cliquez sur **"Re-run all jobs"** ou **"Re-run failed jobs"**

---

## 🔐 Accès à l'espace admin

| Identifiant | Valeur |
|---|---|
| URL de connexion | [https://henrimartinimmobilier.com/login.html](https://henrimartinimmobilier.com/login.html) |
| Formulaire d'ajout | [https://henrimartinimmobilier.com/ajouter_appartement.html](https://henrimartinimmobilier.com/ajouter_appartement.html) |
| Interface admin | [https://henrimartinimmobilier.com/admin_properties.html](https://henrimartinimmobilier.com/admin_properties.html) |

---

## 📋 Résumé des URLs clés

| Ressource | Lien |
|---|---|
| Site public | [https://henrimartinimmobilier.com/](https://henrimartinimmobilier.com/) |
| Page de connexion | [https://henrimartinimmobilier.com/login.html](https://henrimartinimmobilier.com/login.html) |
| Ajouter un bien | [https://henrimartinimmobilier.com/ajouter_appartement.html](https://henrimartinimmobilier.com/ajouter_appartement.html) |
| Admin biens | [https://henrimartinimmobilier.com/admin_properties.html](https://henrimartinimmobilier.com/admin_properties.html) |
| GitHub Actions | [https://github.com/abbasberrada91/agent-immo/actions](https://github.com/abbasberrada91/agent-immo/actions) |
| Workflow ajout bien | [https://github.com/abbasberrada91/agent-immo/actions/workflows/add-property.yml](https://github.com/abbasberrada91/agent-immo/actions/workflows/add-property.yml) |
| Workflow déploiement | [https://github.com/abbasberrada91/agent-immo/actions/workflows/pages.yml](https://github.com/abbasberrada91/agent-immo/actions/workflows/pages.yml) |
| Données biens (JSON) | [`biens.json`](biens.json) |
