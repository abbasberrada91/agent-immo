# MaisonPartenaires — Mise en ligne

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

## Option 2 : Netlify / Vercel

Vous pouvez aussi connecter ce repo à Netlify ou Vercel sans configuration de build:
- Build command : *(vide)*
- Publish directory : `.`

## Vérification locale

```bash
python3 -m http.server 4173
```
Puis ouvrir `http://localhost:4173`.

## Connexion Canva (solution 2)

Chaque bien contient un champ `brochureUrl` dans `biens.json`.
Il suffit d'y placer les URLs de vos fiches Canva publiées pour que le bouton **Dossier complet Canva** pointe vers la bonne fiche.
