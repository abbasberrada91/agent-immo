# 🏠 COMMENT AJOUTER VOS BIENS - GUIDE PRATIQUE

## 🚀 MÉTHODE 1 : Formulaire HTML (LA PLUS SIMPLE)

### Étape 1 : Ouvrir le formulaire

**Double-cliquez sur le fichier :**
```
START.html
```

OU directement sur :
```
ajouter_appartement.html
```

### Étape 2 : Remplir le formulaire

Voici les informations à préparer :

| Champ | Exemple | Notes |
|-------|---------|-------|
| **Référence** | VT-1234 | VT- pour vente, LC- pour location |
| **Transaction** | vente ou location | Choisir dans le menu |
| **Type** | Appartement, Maison, Villa... | Choisir dans le menu |
| **Titre** | Appartement moderne | Court et descriptif |
| **Ville** | Paris | Nom de la ville |
| **Quartier** | 16e, Marais, Centre... | Arrondissement ou quartier |
| **Surface** | 85 | En m² (nombre seul) |
| **Pièces** | 3 | Nombre de pièces (nombre seul) |
| **Prix** | 650000 ou 1500 | Prix total (vente) ou loyer mensuel (location) |
| **Caractéristiques** | Balcon, Parking, Rénové | Séparées par des virgules |
| **Image URL** | https://images.unsplash.com/photo-... | URL complète de l'image |
| **Description image** | Appartement lumineux avec balcon | Pour l'accessibilité |
| **URL Canva** | https://www.canva.com/design/... | Lien vers votre fiche Canva |

### Étape 3 : Générer le JSON

1. Cliquez sur **"✨ Générer le JSON"**
2. Le JSON apparaît en bas de page
3. Cliquez sur **"📋 Copier le JSON"**

### Étape 4 : Ajouter dans biens.json

1. Ouvrez le fichier `biens.json`
2. Trouvez la dernière propriété (actuellement LC-4523)
3. Ajoutez une **virgule** après l'accolade fermante `}`
4. **Collez** le JSON copié
5. **Sauvegardez** le fichier

**Exemple visuel :**
```json
{
  "properties": [
    {
      "reference": "LC-4523",
      ...
    },    <-- Ajoutez une virgule ici
    {
      "reference": "VT-1234",  <-- Collez votre nouveau bien ici
      "transaction": "vente",
      ...
    }
  ]
}
```

---

## 🐍 MÉTHODE 2 : Script Python (AUTOMATIQUE)

Le script fait tout automatiquement !

### Lancement

```bash
python3 ajouter_appartement.py
```

### Suivez les instructions

Le script vous demande chaque information et met à jour automatiquement `biens.json`.

---

## 📊 MÉTHODE 3 : Canva Bulk Create (POUR PLUSIEURS BIENS)

### Étape 1 : Préparer vos données

Ouvrez `template_canva_bulk_create.csv` et remplissez avec vos biens.

### Étape 2 : Créer les fiches Canva

1. Allez sur Canva.com
2. Utilisez Bulk Create avec votre CSV
3. Générez toutes vos fiches
4. Récupérez les URLs

### Étape 3 : Ajouter dans biens.json

Ajoutez chaque bien manuellement ou avec le script Python.

---

## ✅ VÉRIFICATION

### Valider le JSON

```bash
python3 -c "import json; json.load(open('biens.json')); print('✅ JSON valide')"
```

### Compter les biens

```bash
python3 -c "import json; data = json.load(open('biens.json')); print(f'📊 Total : {len(data[\"properties\"])} biens')"
```

### Tester localement

```bash
python3 -m http.server 8080
```

Puis ouvrez : `http://localhost:8080`

---

## 🎯 EXEMPLES DE BIENS À AJOUTER

### Exemple 1 : Appartement à vendre

```json
{
  "reference": "VT-2001",
  "transaction": "vente",
  "propertyType": "Appartement",
  "title": "Appartement lumineux",
  "city": "Paris",
  "district": "Marais",
  "surface": 90,
  "rooms": 3,
  "price": 780000,
  "features": ["Balcon", "Parking", "Rénové"],
  "image": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
  "alt": "Appartement lumineux avec balcon",
  "brochureUrl": "https://www.canva.com/design/VOTRE-ID/view"
}
```

### Exemple 2 : Maison en location

```json
{
  "reference": "LC-3001",
  "transaction": "location",
  "propertyType": "Maison",
  "title": "Maison avec jardin",
  "city": "Lyon",
  "district": "Croix-Rousse",
  "surface": 150,
  "rooms": 5,
  "price": 2500,
  "features": ["Jardin", "Garage", "Terrasse"],
  "image": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
  "alt": "Maison avec jardin et terrasse",
  "brochureUrl": "https://www.canva.com/design/VOTRE-ID/view"
}
```

---

## 🖼️ TROUVER DES IMAGES

### Unsplash (Gratuit et libre de droits)

1. Allez sur https://unsplash.com/
2. Cherchez : "apartment", "house", "modern interior", "living room"
3. Cliquez sur une image
4. Copiez l'URL et ajoutez : `?auto=format&fit=crop&w=1200&q=80`

**Exemple d'URL complète :**
```
https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80
```

### Vos propres images

1. Uploadez sur un hébergeur (Imgur, Cloudinary, etc.)
2. Utilisez l'URL publique

---

## 🔄 DÉPLOYER VOS CHANGEMENTS

Une fois vos biens ajoutés dans `biens.json` :

```bash
git add biens.json
git commit -m "Ajout de nouveaux biens immobiliers"
git push
```

Le site se mettra à jour automatiquement via GitHub Actions !

---

## ❓ QUESTIONS FRÉQUENTES

### Combien de biens puis-je ajouter ?

Autant que vous voulez ! Le site gère automatiquement tous les biens.

### Comment modifier un bien existant ?

Ouvrez `biens.json` et modifiez directement les valeurs du bien concerné.

### Comment supprimer un bien ?

Ouvrez `biens.json` et supprimez l'objet JSON complet du bien, en faisant attention aux virgules.

### Le JSON est invalide, que faire ?

Utilisez https://jsonlint.com/ pour trouver l'erreur. Généralement c'est :
- Une virgule manquante ou en trop
- Un guillemet oublié
- Une accolade mal fermée

---

## 🎉 VOUS ÊTES PRÊT !

**Méthode recommandée :** Utilisez le formulaire HTML (START.html) pour commencer !

C'est visuel, simple et sûr. ✨
