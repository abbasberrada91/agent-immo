# Henri Martin Immobilier — Mise en ligne

> **🚀 Vous voulez ajouter vos appartements ?** Consultez le [Guide de démarrage rapide](DEMARRAGE_RAPIDE.md) !

Oui, ce site peut être mis en ligne facilement car c'est une application statique (HTML/CSS/JS + `biens.json`).

## Option 1 (recommandée) : GitHub Pages automatique

Ce repo inclut un workflow GitHub Actions (`.github/workflows/deploy-gh-pages.yml`) qui déploie automatiquement le site sur GitHub Pages à chaque push.

### Étapes
1. Pousser le code sur GitHub.
2. Aller dans **Settings > Pages**.
3. Dans **Source**, sélectionner **GitHub Actions**.
4. Relancer le workflow si besoin depuis l'onglet **Actions**.

## Domaine personnalisé (votre cas : Henri Martin Immobilier)

Si vous avez déjà votre nom de domaine, vous pouvez lier le site en quelques minutes.

### 1) Configurer le domaine dans GitHub
- Ouvrir **Settings > Pages**.
- Renseigner le champ **Custom domain** avec votre domaine (ex: `votredomaine.fr` ou `www.votredomaine.fr`).
- Activer **Enforce HTTPS** une fois le certificat prêt.

### 2) Configurer le DNS chez votre registrar

#### Cas A — domaine racine (`votredomaine.fr`)
- Ajouter des enregistrements **A** vers GitHub Pages :
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`

#### Cas B — sous-domaine (`www.votredomaine.fr`)
- Ajouter un enregistrement **CNAME** vers :
  - `<user>.github.io`

> Remplacez `<user>` par votre compte GitHub propriétaire du dépôt.

### 3) Validation
- Attendre la propagation DNS (souvent 5 min à 2 h).
- Vérifier que `https://votredomaine.fr` charge bien le site.


## Configuration prête pour votre domaine

Le site est configuré pour le domaine personnalisé suivant :
- `www.henrimartinimmobilier.fr`

### DNS à créer
- Type : `CNAME`
- Nom/Host : `www`
- Cible/Target : `<votre-compte-github>.github.io`

> Pensez aussi à rediriger `henrimartinimmobilier.fr` vers `www.henrimartinimmobilier.fr` chez votre registrar pour éviter les doublons d’URL.

## Option 2 : Netlify / Vercel

Vous pouvez aussi connecter ce repo à Netlify ou Vercel sans configuration de build:
- Build command : *(vide)*
- Publish directory : `.`

## Vérification locale

```bash
python3 -m http.server 4173
```
Puis ouvrir `http://localhost:4173`.

## 🏠 Ajouter vos appartements avec fiches Canva

Vous voulez alimenter le site avec vos propres appartements ? C'est facile !

### 📖 Guide complet
Consultez le **[Guide d'ajout d'appartements](GUIDE_AJOUT_APPARTEMENTS.md)** pour toutes les instructions détaillées.

### 🚀 Méthodes disponibles

1. **Formulaire HTML** (le plus simple)
   - Ouvrez `ajouter_appartement.html` dans votre navigateur
   - Remplissez le formulaire
   - Copiez le JSON généré dans `biens.json`

2. **Script Python** (automatisé)
   ```bash
   python3 ajouter_appartement.py
   ```
   Le script vous guide pas à pas et met à jour automatiquement `biens.json`.

3. **Canva Bulk Create** (pour plusieurs biens)
   - Utilisez `template_canva_bulk_create.csv` comme modèle
   - Créez vos fiches en masse avec Canva Bulk Create
   - Récupérez les URLs et ajoutez les biens

### 📋 Format d'un bien

Chaque bien contient un champ `brochureUrl` dans `biens.json`.
Il suffit d'y placer l'URL de votre fiche Canva publiée pour que le bouton **Dossier complet Canva** pointe vers la bonne fiche.

Exemple :
```json
{
  "reference": "VT-1001",
  "transaction": "vente",
  "propertyType": "Appartement",
  "title": "Appartement moderne",
  "city": "Paris",
  "district": "15e",
  "surface": 85,
  "rooms": 3,
  "price": 650000,
  "features": ["Balcon", "Parking"],
  "image": "https://images.unsplash.com/photo-...",
  "alt": "Description de l'image",
  "brochureUrl": "https://www.canva.com/design/VOTRE-ID/view"
}
```
