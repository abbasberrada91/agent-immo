# 🔑 Guide : Comment configurer votre token GitHub

## ❓ Pourquoi un token GitHub ?

Le token GitHub permet à votre site d'ajouter automatiquement de nouveaux biens immobiliers sans avoir à manipuler manuellement les fichiers. C'est comme donner une clé numérique à votre site pour qu'il puisse modifier vos données de manière sécurisée.

## 📋 Configuration en 5 minutes

### Étape 1 : Accéder aux paramètres GitHub

1. **Connectez-vous à GitHub** : [https://github.com](https://github.com)
2. Cliquez sur votre **photo de profil** en haut à droite
3. Sélectionnez **Settings** (Paramètres)

### Étape 2 : Accéder aux tokens d'accès personnel

1. Dans le menu de gauche, tout en bas, cliquez sur **Developer settings** (Paramètres développeur)
2. Dans le menu de gauche, cliquez sur **Personal access tokens**
3. Sélectionnez **Tokens (classic)** (Tokens classiques)

> **💡 Astuce** : Vous pouvez aussi accéder directement via ce lien : [https://github.com/settings/tokens](https://github.com/settings/tokens)

### Étape 3 : Créer un nouveau token

1. Cliquez sur le bouton **Generate new token** (Générer un nouveau token)
2. Sélectionnez **Generate new token (classic)**
3. Vous devrez peut-être entrer votre mot de passe GitHub

### Étape 4 : Configurer le token

#### 4.1 Nom du token
Dans le champ **Note**, entrez un nom descriptif :
```
Token pour Henri Martin Immobilier
```
ou
```
agent-immo automated updates
```

#### 4.2 Durée de validité
Dans **Expiration**, choisissez :
- **90 days** (recommandé pour plus de sécurité)
- **No expiration** (si vous ne voulez pas le renouveler)

> **⚠️ Important** : Si vous choisissez une durée limitée, vous devrez créer un nouveau token à l'expiration.

#### 4.3 Permissions requises
**Cochez uniquement ces deux cases** :

✅ **repo** - Full control of private repositories
- Cela donne accès en lecture/écriture à vos dépôts

✅ **workflow** - Update GitHub Action workflows  
- Cela permet de déclencher les actions automatiques

> **🔒 Sécurité** : Ne cochez PAS d'autres permissions ! Moins de permissions = plus de sécurité.

### Étape 5 : Générer et copier le token

1. Cliquez sur le bouton vert **Generate token** (Générer le token)
2. **IMPORTANT** : Le token s'affiche (il commence par `ghp_`)
3. **Copiez-le immédiatement** en cliquant sur l'icône de copie
4. **⚠️ ATTENTION** : Vous ne pourrez plus jamais le revoir ! Si vous le perdez, vous devrez en créer un nouveau.

Le token ressemble à ceci :
```
ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Étape 6 : Configurer le token dans votre site

#### Option A : Via le formulaire d'ajout de bien
1. Ouvrez votre site : [Ajouter un appartement](https://abbasberrada91.github.io/agent-immo/ajouter_appartement.html)
2. Cliquez sur le bouton **⚙️ Configurer Token**
3. Collez votre token dans la fenêtre qui s'ouvre
4. Cliquez sur **OK**
5. Le bouton devient vert avec ✓ : c'est configuré !

#### Option B : Via l'interface d'administration
1. Ouvrez : [Administration des biens](https://abbasberrada91.github.io/agent-immo/admin_properties.html)
2. Cliquez sur **⚙️ Configurer le token GitHub**
3. Collez votre token
4. Cliquez sur **OK**

## ✅ Vérifier que ça fonctionne

1. Sur la page d'ajout de bien, le bouton **⚙️ Configurer Token** doit afficher un **✓** vert
2. Vous pouvez maintenant remplir le formulaire et cliquer sur **🚀 Ajouter automatiquement**
3. Si tout est configuré correctement, vous verrez un message de succès

## 🔐 Sécurité et bonnes pratiques

### ✅ À faire :
- Gardez votre token **secret** comme un mot de passe
- Ne le partagez **jamais** avec personne
- Ne le publiez **jamais** sur Internet ou dans votre code
- Créez un token **par projet** si vous avez plusieurs sites

### ❌ À ne pas faire :
- Ne donnez **PAS** plus de permissions que nécessaire
- N'utilisez **PAS** le même token pour plusieurs personnes
- Ne stockez **PAS** le token dans un fichier texte sur votre ordinateur

### 🗑️ Révoquer un token
Si vous pensez que votre token a été compromis :
1. Allez sur [https://github.com/settings/tokens](https://github.com/settings/tokens)
2. Trouvez le token dans la liste
3. Cliquez sur **Delete** (Supprimer)
4. Créez-en un nouveau

## 🔄 Renouveler un token expiré

Si vous avez choisi une durée limitée, vous recevrez un email avant l'expiration. Pour renouveler :

1. Créez un nouveau token (suivez les étapes ci-dessus)
2. Dans votre site, cliquez sur **⚙️ Configurer Token**
3. Choisissez **Remplacer** quand on vous demande
4. Collez le nouveau token

## 🆘 Problèmes courants

### "Token non configuré"
**Solution** : Suivez les étapes ci-dessus pour configurer votre token

### "Erreur d'autorisation" lors de l'ajout d'un bien
**Causes possibles** :
- Le token a expiré → Créez-en un nouveau
- Les permissions sont incorrectes → Vérifiez que **repo** et **workflow** sont cochés
- Le token a été révoqué → Créez-en un nouveau

**Solution** :
1. Allez sur [https://github.com/settings/tokens](https://github.com/settings/tokens)
2. Vérifiez que votre token existe et a les bonnes permissions
3. Si nécessaire, créez un nouveau token

### "Le bien ne s'ajoute pas"
**Vérifications** :
1. Le token est-il configuré ? (bouton vert avec ✓)
2. Le token a-t-il les bonnes permissions ?
3. Avez-vous rempli tous les champs obligatoires du formulaire ?

## 📞 Besoin d'aide ?

Si vous rencontrez des difficultés :
1. Relisez ce guide étape par étape
2. Vérifiez les permissions de votre token
3. Essayez de créer un nouveau token
4. Consultez les [Issues GitHub](https://github.com/abbasberrada91/agent-immo/issues) du projet

## 📚 Ressources utiles

- [Documentation officielle GitHub sur les tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [Guide d'automatisation du site](GUIDE_AUTOMATISATION.md)
- [Comment ajouter des biens](GUIDE_AJOUT_APPARTEMENTS.md)

---

**Version** : 1.0  
**Dernière mise à jour** : Février 2026  
**Langue** : Français
