# 📋 Guide de Configuration Complète - Henri Martin Immobilier

## Vue d'ensemble

Ce document explique toutes les configurations nécessaires pour utiliser et déployer l'application Henri Martin Immobilier.

## 🔑 1. Configuration du Token GitHub

### Pourquoi un token est nécessaire ?

Le token GitHub permet à l'application de :
- Lire le fichier `biens.json` depuis votre repository
- Ajouter de nouveaux biens immobiliers automatiquement
- Modifier et supprimer des biens existants
- Déclencher des actions GitHub automatiques

### Options de configuration

#### Option 1 : Guide Interactif (Recommandé) ⭐

Le moyen le plus simple et rapide :

1. Accédez au guide interactif : [https://abbasberrada91.github.io/agent-immo/configurer-token.html](https://abbasberrada91.github.io/agent-immo/configurer-token.html)
2. Suivez les 5 étapes guidées
3. Le token sera automatiquement configuré

**Temps requis** : 5 minutes

#### Option 2 : Configuration Rapide

Pour les utilisateurs expérimentés :

1. Créez un token sur GitHub : [https://github.com/settings/tokens/new](https://github.com/settings/tokens/new)
2. Permissions requises :
   - ✅ `repo` - Full control of private repositories
   - ✅ `workflow` - Update GitHub Action workflows
3. Copiez le token (commence par `ghp_`)
4. Allez sur [Ajouter un appartement](https://abbasberrada91.github.io/agent-immo/ajouter_appartement.html)
5. Cliquez sur "⚙️ Configurer Token"
6. Collez votre token et validez

**Temps requis** : 2-3 minutes

#### Option 3 : Configuration Manuelle

Utilisez la console JavaScript du navigateur :

```javascript
// Stocker le token
localStorage.setItem('githubToken', 'ghp_votre_token_ici');

// Vérifier que le token est enregistré
console.log('Token configuré:', !!localStorage.getItem('githubToken'));

// Supprimer le token (si nécessaire)
localStorage.removeItem('githubToken');
```

### Format du Token

Les tokens GitHub ont deux formats possibles :

1. **Token Classic** (commence par `ghp_`) :
   ```
   ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

2. **Fine-grained Token** (commence par `github_pat_`) :
   ```
   github_pat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

### Validation du Token

L'application vérifie automatiquement :
- ✅ Le token n'est pas vide
- ✅ Le token commence par `ghp_` ou `github_pat_`
- ✅ Le token a les permissions nécessaires (lors de la première utilisation)

### Stockage du Token

**Important** : Le token est stocké dans le `localStorage` du navigateur :
- ✅ Sécurisé : reste sur votre machine
- ✅ Persistant : survit aux rechargements de page
- ✅ Privé : jamais envoyé à des serveurs tiers
- ⚠️ Local : chaque navigateur/ordinateur nécessite sa propre configuration

## ⚙️ 2. Configuration du Repository

### Fichier `config.js`

Le fichier `config.js` centralise toutes les configurations de l'application.

#### Configuration GitHub

```javascript
const AppConfig = {
    github: {
        owner: 'abbasberrada91',          // Votre nom d'utilisateur GitHub
        repo: 'agent-immo',               // Nom de votre repository
        branch: 'main',                   // Branche principale
        dataFile: 'biens.json'            // Fichier de données
    }
};
```

#### Modification de la configuration

Si vous forkez ce projet ou utilisez un autre repository :

1. Ouvrez `config.js`
2. Modifiez les valeurs dans `AppConfig.github` :
   ```javascript
   github: {
       owner: 'votre-username',
       repo: 'votre-repo',
       branch: 'main',
       dataFile: 'biens.json'
   }
   ```
3. Modifiez également `api.js` si vous n'utilisez pas `config.js`

### Fichier `api.js`

Si vous préférez ne pas utiliser `config.js`, modifiez directement `api.js` :

```javascript
class PropertyAPI {
    constructor() {
        this.owner = 'votre-username';    // Votre username
        this.repo = 'votre-repo';         // Votre repository
        this.branch = 'main';             // Votre branche
        this.filePath = 'biens.json';     // Votre fichier de données
    }
}
```

## 🌐 3. Configuration du Domaine

### GitHub Pages

#### Activer GitHub Pages

1. Allez dans **Settings > Pages** de votre repository
2. Dans **Source**, sélectionnez **GitHub Actions**
3. Le site sera déployé automatiquement à chaque push

#### URL par défaut

Votre site sera accessible à :
```
https://votre-username.github.io/votre-repo/
```

### Domaine Personnalisé

#### Configurer le domaine dans GitHub

1. Allez dans **Settings > Pages**
2. Dans **Custom domain**, entrez votre domaine :
   - `www.votredomaine.fr` (recommandé)
   - ou `votredomaine.fr`
3. Activez **Enforce HTTPS**

#### Configurer le DNS

##### Pour un sous-domaine (www.votredomaine.fr) :

Ajoutez un enregistrement **CNAME** :
- **Type** : CNAME
- **Nom** : www
- **Valeur** : `votre-username.github.io`

##### Pour un domaine racine (votredomaine.fr) :

Ajoutez des enregistrements **A** vers les IPs GitHub Pages :
- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

#### Fichier CNAME

Le fichier `CNAME` à la racine du projet contient votre domaine personnalisé :

```
www.votredomaine.fr
```

Si vous changez de domaine :
1. Éditez le fichier `CNAME`
2. Remplacez par votre nouveau domaine
3. Committez et poussez les changements

## 🔒 4. Sécurité

### Bonnes Pratiques

#### ✅ À FAIRE :

1. **Gardez le token secret**
   - Ne le partagez jamais
   - Ne le committez jamais dans le code
   - Ne le publiez jamais en ligne

2. **Permissions minimales**
   - Utilisez uniquement `repo` et `workflow`
   - Ne donnez pas plus de permissions que nécessaire

3. **Rotation du token**
   - Changez le token régulièrement
   - Utilisez une durée d'expiration (90 jours recommandés)

4. **Stockage sécurisé**
   - Le token reste dans le localStorage du navigateur
   - Jamais dans le code source
   - Jamais dans les variables d'environnement publiques

#### ❌ À NE PAS FAIRE :

1. **Ne jamais** committer le token dans Git
2. **Ne jamais** partager le token par email/chat
3. **Ne jamais** utiliser le même token pour plusieurs projets
4. **Ne jamais** stocker le token dans un fichier texte non chiffré

### Révoquer un Token Compromis

Si vous pensez que votre token a été compromis :

1. Allez sur [https://github.com/settings/tokens](https://github.com/settings/tokens)
2. Trouvez le token dans la liste
3. Cliquez sur **Delete**
4. Créez un nouveau token
5. Reconfigurez l'application avec le nouveau token

### Fichiers à ne jamais committer

Le fichier `.gitignore` doit contenir :

```
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/

# Secrets (ne devrait jamais exister, mais au cas où)
.env
.env.local
secrets.json
token.txt

# OS
.DS_Store
Thumbs.db
```

## 🚀 5. Déploiement

### GitHub Actions

L'application utilise GitHub Actions pour le déploiement automatique.

#### Workflow de Déploiement

Fichier : `.github/workflows/deploy-gh-pages.yml`

Ce workflow :
- Se déclenche à chaque push sur `main`
- Déploie le site sur GitHub Pages
- Utilise le `GITHUB_TOKEN` automatique (aucune configuration nécessaire)

#### Workflow d'Ajout de Propriété

Fichier : `.github/workflows/add-property.yml`

Ce workflow :
- Est déclenché manuellement via l'API GitHub
- Ajoute un bien au fichier `biens.json`
- Utilise votre token personnel pour l'authentification

### Déploiement Manuel

Si vous préférez déployer manuellement :

1. **Via GitHub Pages** :
   - Committez vos changements
   - Poussez vers la branche `main`
   - GitHub Pages se mettra à jour automatiquement

2. **Via un serveur web** :
   - Copiez tous les fichiers HTML/CSS/JS
   - Configurez un serveur web (Apache, Nginx, etc.)
   - Assurez-vous que le fichier `biens.json` est accessible

## 📊 6. Configuration des Données

### Fichier `biens.json`

Structure du fichier :

```json
{
  "properties": [
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
      "alt": "Description",
      "brochureUrl": "https://www.canva.com/design/..."
    }
  ]
}
```

### Champs Obligatoires

- `reference` : Référence unique du bien
- `transaction` : Type de transaction (vente, location)
- `propertyType` : Type de bien (Appartement, Maison, etc.)
- `title` : Titre du bien
- `city` : Ville
- `district` : Quartier/arrondissement
- `surface` : Surface en m²
- `rooms` : Nombre de pièces
- `price` : Prix en euros

### Champs Optionnels

- `features` : Liste des caractéristiques
- `image` : URL de l'image
- `alt` : Texte alternatif de l'image
- `brochureUrl` : URL de la brochure Canva
- `description` : Description détaillée
- `floor`, `totalFloors`, `parkingSpaces`, etc.

## 🧪 7. Tests et Validation

### Tester la Configuration du Token

```javascript
// Dans la console du navigateur
const token = localStorage.getItem('githubToken');
console.log('Token exists:', !!token);
console.log('Token format valid:', 
    token && (token.startsWith('ghp_') || token.startsWith('github_pat_')));
```

### Tester l'API GitHub

```javascript
// Test de lecture du fichier biens.json
fetch('https://api.github.com/repos/abbasberrada91/agent-immo/contents/biens.json', {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('githubToken')}`
    }
})
.then(r => r.json())
.then(data => console.log('API test successful:', data))
.catch(err => console.error('API test failed:', err));
```

## 🆘 8. Dépannage

### Problème : "Token non configuré"

**Solution** :
1. Suivez le [guide interactif](https://abbasberrada91.github.io/agent-immo/configurer-token.html)
2. Ou consultez la section "Configuration du Token GitHub" ci-dessus

### Problème : "Erreur d'autorisation"

**Causes possibles** :
- Token expiré
- Permissions insuffisantes
- Token révoqué

**Solution** :
1. Vérifiez le token sur [https://github.com/settings/tokens](https://github.com/settings/tokens)
2. Créez un nouveau token si nécessaire
3. Reconfigurez l'application

### Problème : "Le bien ne s'ajoute pas"

**Vérifications** :
1. Token configuré ? ✅
2. Permissions correctes ? ✅
3. Champs obligatoires remplis ? ✅
4. Référence unique ? ✅

### Problème : "Site non accessible"

**Solution** :
1. Vérifiez GitHub Pages : Settings > Pages
2. Vérifiez le workflow : Actions tab
3. Vérifiez la configuration DNS (domaine personnalisé)

## 📚 9. Ressources

### Documentation

- [Guide Configuration Token](CONFIGURATION_TOKEN_GITHUB.md)
- [Guide Rapide Token](GUIDE_RAPIDE_TOKEN.md)
- [Guide Ajout Appartements](GUIDE_AJOUT_APPARTEMENTS.md)
- [Démarrage Rapide](DEMARRAGE_RAPIDE.md)

### Liens Utiles

- [Documentation GitHub Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [Documentation GitHub Pages](https://docs.github.com/en/pages)
- [Documentation GitHub Actions](https://docs.github.com/en/actions)

### Support

- [Issues GitHub](https://github.com/abbasberrada91/agent-immo/issues)
- [Pull Requests](https://github.com/abbasberrada91/agent-immo/pulls)

## 📝 10. Checklist de Configuration

Utilisez cette checklist pour vous assurer que tout est configuré :

### Configuration Initiale

- [ ] Repository cloné/forké
- [ ] Token GitHub créé
- [ ] Permissions `repo` et `workflow` activées
- [ ] Token configuré dans l'application
- [ ] Token testé et fonctionnel

### Configuration GitHub Pages

- [ ] GitHub Pages activé
- [ ] Source configuré sur "GitHub Actions"
- [ ] Site accessible via l'URL GitHub
- [ ] Workflow de déploiement fonctionnel

### Configuration Domaine (Optionnel)

- [ ] Domaine personnalisé acheté
- [ ] Enregistrements DNS configurés
- [ ] Domaine ajouté dans GitHub Pages
- [ ] HTTPS activé
- [ ] Fichier CNAME mis à jour

### Tests

- [ ] Page d'accueil accessible
- [ ] Formulaire d'ajout fonctionne
- [ ] Interface admin accessible
- [ ] Ajout automatique de bien testé
- [ ] Modification de bien testée
- [ ] Suppression de bien testée

---

**Version** : 1.0.0  
**Dernière mise à jour** : Février 2026  
**Auteur** : Henri Martin Immobilier
