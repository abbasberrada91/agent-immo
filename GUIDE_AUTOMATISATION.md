# Guide : Automatisation de l'ajout de biens immobiliers

> **🔑 NOUVEAU** : Vous ne savez pas comment configurer le token GitHub ?  
> Consultez le **[Guide interactif de configuration du token](configurer-token.html)** (5 minutes seulement !)  
> Ou lisez le **[Guide détaillé en markdown](CONFIGURATION_TOKEN_GITHUB.md)**

## 🎯 Problème résolu

Avant, quand vous ajoutiez un bien, vous deviez :
1. Cliquer sur la tâche automatisée qui vous emmenait sur GitHub
2. Copier le fichier JSON manuellement
3. Le coller pour lancer le workflow

**Maintenant, tout se fait automatiquement en un seul clic !**

## ✨ Nouvelles fonctionnalités

### 1. Bouton "Publier maintenant"
- Un seul clic après avoir rempli le formulaire
- Le bien est ajouté automatiquement à votre liste
- Affichage immédiat du statut : "Bien ajouté avec succès" ou "Erreur"

### 2. Informations de suivi
Chaque bien ajouté contient maintenant :
- **Date d'ajout** : Date et heure exactes de publication
- **Statut** : "published" (publié) ou autre statut selon le cas

### 3. Interface d'administration
Nouvelle page `admin_properties.html` pour gérer tous vos biens :
- Liste complète de tous les biens publiés
- Recherche et filtres (vente/location)
- Modification des biens existants
- Suppression de biens
- Affichage de la date d'ajout pour chaque bien

## 🚀 Comment utiliser

### Première configuration (une seule fois)

1. **Créer un token GitHub**
   - Allez sur GitHub → Settings → Developer settings
   - Personal access tokens → Tokens (classic)
   - Generate new token (classic)
   - Cochez les permissions :
     - ✅ **repo** (Full control of private repositories)
     - ✅ **workflow** (Update GitHub Action workflows)
   - Générez le token et **copiez-le immédiatement** (vous ne pourrez plus le revoir)

2. **Configurer le token**
   - Ouvrez le formulaire d'ajout de bien
   - Cliquez sur "⚙️ Configurer Token"
   - Collez votre token GitHub
   - Le token est enregistré localement dans votre navigateur

### Ajouter un bien

1. Connectez-vous sur le site
2. Cliquez sur "✨ Ajouter un bien"
3. Remplissez le formulaire
4. Cliquez sur "✨ Générer le JSON"
5. Cliquez sur "🚀 Publier maintenant"
6. Attendez le message de confirmation

**Résultat** : Le bien est ajouté automatiquement avec sa date d'ajout et son statut "published" !

### Gérer vos biens (interface admin)

1. Connectez-vous sur le site
2. Cliquez sur "📊 Admin" dans la navigation
3. Vous voyez tous vos biens avec :
   - Référence, type, ville, prix
   - Date d'ajout
   - Statut
4. Actions disponibles :
   - **Rechercher** : par référence, ville, titre
   - **Filtrer** : tous / vente / location
   - **Modifier** : cliquez sur "✏️ Modifier"
   - **Supprimer** : cliquez sur "🗑️ Supprimer"

## 🔧 Fichiers techniques

### Nouveaux fichiers créés

1. **`api.js`**
   - Module API pour communiquer avec GitHub
   - Gère l'ajout, la modification et la suppression de biens
   - Utilise l'API GitHub pour modifier `biens.json` directement

2. **`admin_properties.html`**
   - Interface d'administration complète
   - Liste tous les biens avec tri et recherche
   - Permet la modification et la suppression

### Fichiers modifiés

1. **`ajouter_appartement.html`**
   - Nouveau bouton "🚀 Publier maintenant"
   - Affichage du statut en temps réel
   - Lien vers l'interface admin

2. **`index.html`**
   - Nouveau bouton "📊 Admin" dans la navigation
   - Visible uniquement pour les utilisateurs connectés

## 📊 Structure des données

### Ancien format
```json
{
  "reference": "VT-1001",
  "transaction": "vente",
  "propertyType": "Appartement",
  "title": "Appartement moderne",
  ...
}
```

### Nouveau format (avec métadonnées)
```json
{
  "reference": "VT-1001",
  "transaction": "vente",
  "propertyType": "Appartement",
  "title": "Appartement moderne",
  "dateAdded": "2026-02-10T12:30:45.123Z",
  "status": "published",
  ...
}
```

## 🔒 Sécurité

- Le token GitHub est stocké **localement** dans votre navigateur
- Il n'est **jamais envoyé** à un serveur tiers
- Il est utilisé uniquement pour communiquer directement avec l'API GitHub
- Vous pouvez le supprimer à tout moment via "⚙️ Configurer Token"

## ⚠️ Important

- **Gardez votre token secret** : ne le partagez jamais
- **Permissions minimales** : le token n'a accès qu'à vos dépôts
- **Révocation** : vous pouvez révoquer le token à tout moment sur GitHub

## 🎉 Avantages

1. **Gain de temps** : plus besoin de copier-coller manuellement
2. **Moins d'erreurs** : tout est automatisé
3. **Traçabilité** : date d'ajout pour chaque bien
4. **Gestion facilitée** : interface admin intuitive
5. **Statut en temps réel** : vous savez immédiatement si l'ajout a réussi

## 📝 Notes techniques

### Comment ça marche ?

1. **Formulaire** → Génère les données du bien
2. **API JavaScript** → Utilise l'API GitHub
3. **GitHub API** → Modifie `biens.json` directement sur le dépôt
4. **Commit automatique** → Le changement est enregistré
5. **GitHub Pages** → Le site se met à jour automatiquement

### Compatibilité

- ✅ Fonctionne sur GitHub Pages (site statique)
- ✅ Pas besoin de serveur backend
- ✅ Utilise uniquement l'API GitHub
- ✅ Compatible avec tous les navigateurs modernes

## 🐛 Résolution de problèmes

### "Token non configuré"
→ Cliquez sur "⚙️ Configurer Token" et ajoutez votre token GitHub

### "Erreur lors de l'ajout"
→ Vérifiez que votre token a les bonnes permissions (repo + workflow)

### "Bien déjà existant"
→ Un bien avec la même référence existe déjà, changez la référence

### L'interface admin ne charge pas
→ Vérifiez votre connexion et que le token est configuré

## 📞 Support

En cas de problème, vérifiez :
1. Que vous êtes connecté
2. Que le token est configuré
3. Que le token a les bonnes permissions
4. Les messages d'erreur dans la console du navigateur (F12)

---

**Version** : 1.0  
**Date** : Février 2026  
**Auteur** : GitHub Copilot
