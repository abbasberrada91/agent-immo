# 🏠 Guide : Ajouter vos appartements

Ce guide vous explique comment alimenter le site **Henri Martin Immobilier** avec vos propres appartements.

## 📋 Vue d'ensemble

Le site lit les biens immobiliers depuis le fichier `biens.json`. Chaque bien contient :
- Les informations de l'appartement (prix, surface, localisation, etc.)
- Un lien vers une fiche Canva complète (`brochureUrl`) - **maintenant optionnel !**
- Une image de présentation

**✨ Nouveauté : Le lien Canva n'est plus obligatoire !** Vous pouvez ajouter vos biens immédiatement et créer les fiches Canva plus tard.

## 🎨 Méthode 1 : Avec Canva Bulk Create (Recommandée)

### Étape 1 : Préparer vos données dans un tableur

Créez un fichier CSV ou Google Sheets avec ces colonnes :

| reference | transaction | propertyType | title | city | district | surface | rooms | price | features | image | alt | brochureUrl |
|-----------|-------------|--------------|-------|------|----------|---------|-------|-------|----------|-------|-----|-------------|
| VT-1001 | vente | Appartement | Appartement moderne | Paris | 15e | 85 | 3 | 650000 | Balcon, Parking | https://... | Description | https://canva.com/... |

### Étape 2 : Créer votre template Canva

1. Allez sur **Canva.com** et créez un design pour votre fiche appartement
2. Utilisez des **variables dynamiques** pour les champs qui changent :
   - `{title}` - Titre de l'appartement
   - `{price}` - Prix
   - `{surface}` - Surface
   - `{city}` - Ville
   - `{district}` - Quartier
   - `{rooms}` - Nombre de pièces
   - `{features}` - Caractéristiques
   - `{reference}` - Référence

### Étape 3 : Utiliser Bulk Create

1. Dans Canva, allez dans **Apps → Bulk Create**
2. Importez votre fichier CSV/Google Sheets
3. Mappez les colonnes aux variables de votre template
4. Générez toutes vos fiches en un clic
5. Publiez les fiches et copiez les URLs

### Étape 4 : Mettre à jour biens.json

Utilisez le script `ajouter_appartement.py` (voir Méthode 3) ou ajoutez manuellement :

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
  "image": "https://images.unsplash.com/photo-votre-image",
  "alt": "Appartement moderne avec balcon",
  "brochureUrl": "https://www.canva.com/design/votre-fiche/view"
}
```

## ☁️ Méthode 0 : Cloudinary - Automatisation complète (NOUVEAU ⭐)

**La méthode la plus rapide et moderne !** Stockez vos photos sur Cloudinary et créez automatiquement les fiches.

### Comment ça marche ?

1. **Organisez vos photos** dans des dossiers Cloudinary avec la convention de nommage :
   - **VXX** pour les **ventes** (ex: V01, V02, V15)
   - **LCXX** pour les **locations** (ex: LC01, LC08, LC20)
   - Le numéro (XX) devient automatiquement le rang de la propriété

2. **Déclenchez la synchronisation** de 2 façons :
   
   **Option A : Depuis l'interface admin** (Recommandé)
   - Ouvrez `admin_properties.html`
   - Modifiez une propriété ou créez-en une nouvelle
   - Remplissez le champ "Dossier Cloudinary" (ex: V01, LC08)
   - Cliquez sur "▶️ Créer/Mettre à jour fiche depuis Cloudinary"
   - Attendez 1-2 minutes et rechargez la page
   
   **Option B : Depuis GitHub Actions**
   - Allez sur https://github.com/abbasberrada91/agent-immo/actions
   - Sélectionnez "Cloudinary Gallery - Create/Update Fiche"
   - Cliquez "Run workflow"
   - Entrez le nom du dossier (ex: V01, LC08)
   - Cliquez "Run workflow"

3. **Le workflow automatique va** :
   - ✅ Récupérer toutes les photos du dossier Cloudinary
   - ✅ Déterminer automatiquement le type (vente/location) selon le préfixe
   - ✅ Définir le rang selon le numéro dans le nom du dossier
   - ✅ Créer ou mettre à jour la propriété dans `biens.json`
   - ✅ Committer et pousser les changements automatiquement

### Configuration requise (une seule fois)

**1. Créer un compte Cloudinary** (gratuit)
   - Allez sur https://cloudinary.com/
   - Créez un compte gratuit
   - Notez vos identifiants : Cloud Name, API Key, API Secret

**2. Configurer les secrets GitHub**
   - Allez sur https://github.com/abbasberrada91/agent-immo/settings/secrets/actions
   - Ajoutez 3 secrets :
     - `CLOUDINARY_CLOUD_NAME` : votre cloud name
     - `CLOUDINARY_API_KEY` : votre API key
     - `CLOUDINARY_API_SECRET` : votre API secret

**3. Organiser vos photos sur Cloudinary**
   - Créez des dossiers pour chaque propriété
   - Nommez-les selon la convention : V01, V02, LC01, LC08, etc.
   - Uploadez toutes les photos de la propriété dans le dossier correspondant

### Avantages de cette méthode

- ✅ **Automatisation complète** : Pas besoin de modifier `biens.json` manuellement
- ✅ **Gestion centralisée** : Toutes vos photos au même endroit
- ✅ **Mises à jour faciles** : Ajoutez/supprimez des photos, relancez le workflow
- ✅ **Métadonnées** : Chaque photo inclut URL, format, dimensions
- ✅ **Performance** : URLs optimisées par Cloudinary
- ✅ **Convention claire** : V = vente, LC = location, automatiquement détecté

### Exemple complet

```
Dossiers Cloudinary :
├── V01/         → Crée une vente, rang 1
│   ├── photo1.jpg
│   ├── photo2.jpg
│   └── photo3.jpg
├── V02/         → Crée une vente, rang 2
│   └── ...
├── LC01/        → Crée une location, rang 1
│   ├── img1.jpg
│   └── img2.jpg
└── LC08/        → Crée une location, rang 8
    └── ...
```

Après le workflow, `biens.json` contiendra automatiquement :
- `reference`: "V01" ou "LC01"
- `transaction`: "vente" ou "location" (auto-détecté)
- `rank`: 1, 2, 8... (auto-parsé)
- `image`: URL de la première photo
- `images`: Tableau de toutes les URLs
- `photos`: Tableau avec métadonnées complètes
- `cloudinaryFolder`: Référence du dossier

Vous devrez ensuite compléter manuellement :
- `title`, `city`, `district` (initialement "À compléter")
- `surface`, `rooms`, `price` (valeurs par défaut à ajuster)
- `features` (vide par défaut)

---

## 🎨 Méthode 1 : Avec Canva Bulk Create (Recommandée)

Ouvrez le fichier `ajouter_appartement.html` dans votre navigateur ou accédez-y en ligne :

1. Remplissez le formulaire avec les informations de votre appartement
2. **Le champ Canva est maintenant optionnel** - laissez-le vide si vous n'avez pas encore créé la fiche
3. Cliquez sur "Générer JSON"
4. Choisissez votre méthode préférée :
   - **Option automatique** : Cliquez sur "🚀 Ajouter automatiquement (GitHub)" pour utiliser GitHub Actions
   - **Option manuelle** : Téléchargez le fichier `biens.json` mis à jour et remplacez l'ancien

## 🐍 Méthode 3 : Script Python (Automatisé)

Si vous avez plusieurs appartements à ajouter, utilisez le script :

```bash
python3 ajouter_appartement.py
```

Le script vous guidera pas à pas et mettra à jour automatiquement `biens.json`.

## 🖼️ Trouver des images pour vos appartements

### Option 1 : Unsplash (Gratuit)
1. Allez sur https://unsplash.com/
2. Cherchez "apartment", "modern interior", "living room", etc.
3. Copiez l'URL de l'image (format : `https://images.unsplash.com/photo-...?auto=format&fit=crop&w=1200&q=80`)

### Option 2 : Vos propres photos
1. Uploadez vos photos sur un service d'hébergement (imgur, cloudinary, etc.)
2. Utilisez l'URL publique de l'image

### Option 3 : Images depuis Canva
1. Exportez l'image de votre fiche Canva
2. Uploadez-la sur un service d'hébergement
3. Utilisez l'URL publique

## 📊 Structure d'un bien

```json
{
  "reference": "VT-1234",          // Référence unique (ex: VT-1234 pour vente, LC-5678 pour location)
  "transaction": "vente",          // "vente" ou "location"
  "propertyType": "Appartement",   // "Appartement", "Maison", "Villa", "Loft", "Studio", "Penthouse"
  "title": "Titre court",          // Titre descriptif court
  "city": "Paris",                 // Ville
  "district": "16e",               // Quartier/Arrondissement
  "surface": 95,                   // Surface en m² (nombre entier)
  "rooms": 3,                      // Nombre de pièces (nombre entier)
  "price": 850000,                 // Prix en € (vente) ou €/mois (location) - nombre entier
  "features": [                    // 2-3 caractéristiques principales
    "Balcon",
    "Parking"
  ],
  "image": "https://...",          // URL de l'image principale
  "alt": "Description image",      // Description alternative de l'image
  "brochureUrl": "https://..."     // URL de votre fiche Canva publiée
}
```

## 🎯 Bonnes pratiques

### Références
- **Vente** : Utilisez le préfixe `VT-` suivi d'un numéro (ex: VT-1001, VT-1002, etc.)
- **Location** : Utilisez le préfixe `LC-` suivi d'un numéro (ex: LC-2001, LC-2002, etc.)

### Prix
- **Vente** : Prix total en euros (ex: 850000 pour 850 000 €)
- **Location** : Loyer mensuel en euros (ex: 2500 pour 2 500 €/mois)

### Caractéristiques (features)
Limitez-vous à 2-3 caractéristiques principales :
- ✅ Balcon, Terrasse, Jardin, Vue mer, Parking, Cave, Ascenseur
- ✅ Rénové, Meublé, Climatisation, Cheminée
- ✅ Dernier étage, Rez-de-jardin, Duplex

### Images
- Privilégiez des images haute qualité (min. 1200px de largeur)
- Format paysage (horizontal)
- Lumineuses et attrayantes

### URLs Canva (Optionnel)
- Le champ Canva est maintenant **optionnel**
- Si vous laissez le champ vide, une URL par défaut sera utilisée
- Vous pouvez ajouter l'URL Canva plus tard en éditant `biens.json`
- Si vous créez une fiche Canva :
  - Publiez votre fiche avec le partage public
  - Utilisez l'URL complète (ex: `https://www.canva.com/design/DAFxxx/view`)
  - Vérifiez que le lien est accessible sans connexion

## 🚀 Workflow complet recommandé

### Workflow simplifié (sans Canva)
1. **Ouvrez le formulaire** `ajouter_appartement.html`
2. **Remplissez les informations** de votre bien
3. **Laissez le champ Canva vide** si vous n'avez pas de fiche
4. **Cliquez sur "🚀 Ajouter automatiquement"** pour utiliser GitHub Actions
5. **Le bien est ajouté** automatiquement au site !

### Workflow avec Canva (avancé)
1. **Créez votre template Canva** avec variables dynamiques
2. **Préparez vos données** dans un tableur (CSV ou Google Sheets)
3. **Générez vos fiches** avec Canva Bulk Create
4. **Récupérez les URLs** des fiches publiées
5. **Ajoutez vos appartements** avec l'URL Canva :
   - Soit avec le formulaire HTML `ajouter_appartement.html`
   - Soit avec le script Python `ajouter_appartement.py`
   - Soit manuellement dans `biens.json`
6. **Testez localement** : `python3 -m http.server 4173`
7. **Poussez sur GitHub** : le site se met à jour automatiquement !

```bash
git add biens.json
git commit -m "Ajout de nouveaux appartements"
git push
```

## ❓ Questions fréquentes

### Comment modifier un appartement existant ?
Éditez directement `biens.json` et changez les valeurs du bien concerné.

### Comment supprimer un appartement ?
Supprimez l'objet JSON correspondant dans le tableau `properties` de `biens.json`.

### Puis-je utiliser mes propres images ?
Oui ! Uploadez-les sur un service d'hébergement et utilisez l'URL publique.

### Combien d'appartements puis-je ajouter ?
Autant que vous voulez ! Le site gère automatiquement tous les biens du fichier.

### Le site se met à jour automatiquement ?
Oui, si vous utilisez GitHub Pages. Chaque push déclenche un déploiement automatique.

## 🆘 Besoin d'aide ?

Si vous rencontrez des difficultés :
1. Vérifiez que votre JSON est valide : https://jsonlint.com/
2. Testez localement avant de pousser sur GitHub
3. Consultez les exemples dans `biens.json`

---

**Bon courage pour l'alimentation de votre catalogue ! 🎉**
