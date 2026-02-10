# Guide d'Ajout Automatique de Biens

Ce guide explique comment utiliser la nouvelle fonctionnalité d'ajout automatique de biens via GitHub Actions.

## Problème Résolu

### 1. Erreur JSON
**Problème**: Erreur "Invalid JSON input - Extra data: line 1 column 4 (char 3)"

**Solution**: Le workflow gère maintenant automatiquement :
- Les JSON entourés de guillemets supplémentaires
- Les espaces blancs en début/fin
- Les guillemets échappés

### 2. Déclenchement Manuel
**Problème**: Il fallait aller manuellement sur GitHub Actions pour déclencher le workflow

**Solution**: Le workflow peut maintenant être déclenché automatiquement via l'interface web

## Configuration (Une seule fois)

1. **Créer un GitHub Personal Access Token**
   - Allez sur GitHub → Settings → Developer settings
   - Cliquez sur "Personal access tokens" → "Tokens (classic)"
   - Cliquez sur "Generate new token (classic)"
   - Donnez un nom au token (ex: "agent-immo-workflow")
   - Cochez la permission **"workflow"**
   - Générez le token et **copiez-le** (vous ne pourrez plus le voir après)

2. **Configurer le Token dans l'Interface**
   - Ouvrez `ajouter_appartement.html` dans votre navigateur
   - Créez un nouveau bien
   - Cliquez sur "⚙️ Configurer Token"
   - Collez votre token GitHub
   - Le token est stocké localement dans votre navigateur (localStorage)

## Utilisation

### Méthode 1: Ajout Automatique (Recommandé)

1. Remplissez le formulaire d'ajout de bien
2. Cliquez sur "Générer l'appartement"
3. Cliquez sur "🚀 Ajouter automatiquement (GitHub)"
4. Confirmez l'ajout
5. Le workflow GitHub Actions se déclenche automatiquement
6. Le bien est ajouté au fichier `biens.json` et déployé sur le site

### Méthode 2: Ajout Manuel (Fallback)

Si vous n'avez pas de token configuré :

1. Cliquez sur "🚀 Ajouter automatiquement (GitHub)"
2. Choisissez "Annuler" pour la méthode manuelle
3. Les données sont copiées dans le presse-papier
4. Vous êtes redirigé vers GitHub Actions
5. Cliquez sur "Run workflow"
6. Collez les données dans le champ "property_json"
7. Cliquez sur "Run workflow" (bouton vert)

## Gestion du Token

### Afficher le Statut
Le bouton "⚙️ Configurer Token" affiche :
- "⚙️ Configurer Token" (violet) si aucun token n'est configuré
- "✅ Token configuré" (vert) si un token est configuré

### Modifier le Token
1. Cliquez sur "⚙️ Configurer Token"
2. Choisissez "Annuler" pour remplacer
3. Entrez le nouveau token

### Supprimer le Token
1. Cliquez sur "⚙️ Configurer Token" 
2. Choisissez "OK" pour supprimer

## Sécurité

- Le token est stocké **uniquement dans votre navigateur** (localStorage)
- Le token n'est jamais envoyé à un serveur tiers
- Le token est utilisé uniquement pour déclencher le workflow GitHub
- Vous pouvez révoquer le token à tout moment sur GitHub

## Dépannage

### Le workflow ne se déclenche pas
- Vérifiez que votre token a la permission "workflow"
- Vérifiez que le token n'a pas expiré
- Essayez de supprimer et reconfigurer le token

### Erreur de parsing JSON
- Le workflow gère automatiquement la plupart des erreurs de formatage
- Si l'erreur persiste, vérifiez que tous les champs requis sont présents :
  - reference
  - transaction
  - propertyType
  - title
  - city
  - district
  - surface
  - rooms
  - price

### Le bien n'apparaît pas sur le site
- Vérifiez que le workflow s'est exécuté avec succès sur GitHub Actions
- Attendez quelques minutes pour le déploiement
- Rafraîchissez le cache de votre navigateur (Ctrl+F5)

## Améliorations Techniques

### Workflow (`add-property.yml`)
- Nettoyage automatique des guillemets superflus
- Messages d'erreur plus détaillés
- Gestion des espaces blancs
- Déséchappement des guillemets

### Interface Web (`ajouter_appartement.html`)
- Déclenchement automatique via l'API GitHub
- Gestion sécurisée du token en localStorage
- Interface de gestion du token
- Feedback visuel de l'état du workflow
- Fallback vers la méthode manuelle si nécessaire
