# 🔐 Système d'Authentification - Henri Martin Immobilier

## ✅ Implémentation Réussie

Le système d'authentification a été créé avec succès pour protéger l'accès à l'interface d'ajout de biens immobiliers.

---

## 🔑 Vos Identifiants

**Login :** `abbasberrada`  
**Mot de passe :** `Abbasberr1991`

> 💡 **Mot de passe oublié ?** 
> - **Option 1** : [Demander un email de récupération](reset-password.html) (envoi par email si vous êtes enregistré)
> - **Option 2** : [Consulter la page de récupération directe](mot-de-passe.html) (affichage immédiat)

---

## 🚀 Comment Utiliser

### 1️⃣ Se Connecter

1. Allez sur le site Henri Martin Immobilier
2. Cliquez sur le bouton **"🔐 Se connecter"** en haut à droite
3. Entrez vos identifiants :
   - Login : `abbasberrada`
   - Mot de passe : `Abbasberr1991`
4. Cliquez sur **"Se connecter"**

### 2️⃣ Ajouter des Biens

Une fois connecté :
- Vous êtes automatiquement redirigé vers la page d'ajout
- Votre nom d'utilisateur s'affiche en haut à droite
- Un bouton **"Déconnexion"** est disponible
- Vous pouvez maintenant créer des biens immobiliers

### 3️⃣ Se Déconnecter

Cliquez sur le bouton rouge **"Déconnexion"** en haut à droite de n'importe quelle page protégée.

---

## 🛡️ Pages Protégées

Les pages suivantes nécessitent une connexion :

- **START.html** - Page de démarrage pour ajouter un bien
- **ajouter_appartement.html** - Formulaire d'ajout de bien

Si vous essayez d'accéder à ces pages sans être connecté, vous serez automatiquement redirigé vers la page de connexion.

---

## 📱 Interface Utilisateur

### Sur la Page Principale (Non Connecté)

- Bouton **"🔐 Se connecter"** visible dans la navigation

### Sur la Page Principale (Connecté)

- Le bouton change en **"✨ Ajouter un bien"**
- Cliquez dessus pour accéder directement au formulaire

### Sur les Pages Protégées (Connecté)

- Affichage de votre nom : **"👤 abbasberrada"**
- Bouton **"Déconnexion"** rouge à côté
- Accès complet aux fonctionnalités

---

## 🔒 Sécurité

### Fonctionnement

- **Authentification côté client** avec localStorage
- **Session persistante** : reste connecté même si vous rechargez la page
- **Protection automatique** : redirection si non authentifié
- **Déconnexion propre** : efface toutes les données de session

### Note Importante

⚠️ Ce système utilise une authentification côté client pour simplifier l'utilisation. Pour un site en production accessible publiquement, il est recommandé d'utiliser une authentification côté serveur avec une base de données sécurisée.

---

## 📁 Fichiers Créés

- **login.html** - Page de connexion avec design élégant
- **auth.js** - Système d'authentification JavaScript
- Modifications dans **index.html**, **START.html**, **ajouter_appartement.html**
- Ajout de styles dans **styles.css**

---

## 🎨 Design

- **Page de connexion** : Fond gradient violet élégant
- **Formulaire moderne** : Champs avec bordures et effets au focus
- **Messages clairs** : Erreurs affichées en rouge
- **Responsive** : Fonctionne sur tous les écrans

---

## ❓ Résolution de Problèmes

### Je ne peux pas me connecter

- Vérifiez que vous utilisez exactement : `abbasberrada` (sans espaces)
- Le mot de passe est sensible à la casse : `Abbasberr1991`
- Essayez de vider le cache du navigateur si le problème persiste
- **🔑 Options de récupération** :
  - [Demander un email de récupération](reset-password.html) - Recevez vos identifiants par email
  - [Page de récupération directe](mot-de-passe.html) - Consultez vos identifiants immédiatement

### Je suis déconnecté automatiquement

- Cela peut arriver si vous videz les données du navigateur
- Reconnectez-vous simplement avec vos identifiants

### Le bouton "Se connecter" ne s'affiche pas

- Rechargez la page (Ctrl+F5 ou Cmd+R)
- Vérifiez que JavaScript est activé dans votre navigateur

---

## 🎉 C'est Prêt !

Vous pouvez maintenant vous connecter en toute sécurité et gérer vos biens immobiliers.

**Profitez de votre nouvelle interface protégée !**
