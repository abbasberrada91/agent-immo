# 📧 Configuration de l'Envoi d'Emails pour Mot de Passe Oublié

## Vue d'ensemble

Le système de réinitialisation de mot de passe utilise **EmailJS** pour envoyer des emails directement depuis le navigateur sans nécessiter de serveur backend.

## 🔧 Configuration EmailJS

### Étape 1 : Créer un compte EmailJS

1. Allez sur [EmailJS](https://www.emailjs.com/)
2. Cliquez sur "Sign Up" pour créer un compte gratuit
3. Confirmez votre adresse email

### Étape 2 : Ajouter un service email

1. Dans le dashboard EmailJS, allez dans "Email Services"
2. Cliquez sur "Add New Service"
3. Choisissez votre fournisseur d'email (Gmail, Outlook, etc.)
4. Suivez les instructions pour connecter votre compte email
5. Notez le **Service ID** (ex: `service_abc123`)

### Étape 3 : Créer un template d'email

1. Allez dans "Email Templates"
2. Cliquez sur "Create New Template"
3. Configurez votre template avec les variables suivantes :

```
Subject: Récupération de vos identifiants - Henri Martin Immobilier

Bonjour {{to_name}},

Vous avez demandé à récupérer vos identifiants de connexion pour le site Henri Martin Immobilier.

Voici vos informations de connexion :

🔑 Identifiant : {{username}}
🔐 Mot de passe : {{password}}

Vous pouvez vous connecter sur : https://votre-site.com/login.html

Pour des raisons de sécurité, nous vous recommandons de :
- Ne pas partager ces identifiants
- Vous déconnecter après chaque session
- Contacter l'administrateur si vous n'avez pas fait cette demande

Cordialement,
L'équipe Henri Martin Immobilier
```

4. Notez le **Template ID** (ex: `template_xyz789`)

### Étape 4 : Obtenir la clé publique

1. Allez dans "Account" > "General"
2. Trouvez votre **Public Key** (ex: `abcdef123456`)
3. Copiez cette clé

### Étape 5 : Configurer le code

Dans le fichier `reset-password.html`, remplacez les valeurs de configuration :

```javascript
const EMAILJS_CONFIG = {
    serviceId: 'service_abc123',      // Votre Service ID
    templateId: 'template_xyz789',    // Votre Template ID
    publicKey: 'abcdef123456'         // Votre Public Key
};
```

### Étape 6 : Ajouter des utilisateurs

Dans le même fichier, ajoutez les utilisateurs enregistrés avec leurs emails :

```javascript
const REGISTERED_USERS = {
    'abbas.berrada@example.com': {
        username: 'abbasberrada',
        password: 'Abbasberr1991',
        name: 'Abbas Berrada'
    },
    'autre.utilisateur@example.com': {
        username: 'autreuser',
        password: 'MotDePasse123',
        name: 'Autre Utilisateur'
    }
};
```

## 📝 Template Variables

Les variables suivantes doivent être utilisées dans votre template EmailJS :

| Variable | Description | Exemple |
|----------|-------------|---------|
| `{{to_email}}` | Email du destinataire | `abbas.berrada@example.com` |
| `{{to_name}}` | Nom du destinataire | `Abbas Berrada` |
| `{{username}}` | Identifiant de connexion | `abbasberrada` |
| `{{password}}` | Mot de passe | `Abbasberr1991` |
| `{{site_name}}` | Nom du site | `Henri Martin Immobilier` |

## 🧪 Test

### Mode Développement (Sans configuration EmailJS)

Si EmailJS n'est pas configuré, le système :
- ✅ Valide quand même que l'email est enregistré
- ✅ Affiche un message de simulation
- ✅ Montre dans la console ce qui serait envoyé
- ℹ️ Ne envoie pas d'email réel

### Mode Production (Avec EmailJS configuré)

Une fois configuré :
1. Allez sur `reset-password.html`
2. Entrez un email enregistré
3. Cliquez sur "Envoyer l'email"
4. Vérifiez la réception de l'email

## 🔒 Sécurité

### Points importants

1. **Validation côté client** : La liste des utilisateurs est stockée côté client
   - ⚠️ Pour la production, utilisez une base de données backend
   
2. **Emails en clair** : Les mots de passe sont envoyés en clair par email
   - ⚠️ Pour la production, utilisez des tokens de réinitialisation
   
3. **Limite EmailJS gratuit** : 200 emails/mois
   - 💡 Passez à un plan payant si nécessaire

### Recommandations pour la production

Pour un système de production sécurisé :

1. **Backend requis** :
   - Stockez les utilisateurs dans une base de données
   - Hashage des mots de passe (bcrypt, Argon2)
   - Génération de tokens temporaires pour réinitialisation
   
2. **Flux sécurisé** :
   - L'utilisateur demande une réinitialisation
   - Un token unique à durée limitée est généré
   - Un email avec un lien contenant le token est envoyé
   - L'utilisateur clique sur le lien et définit un nouveau mot de passe
   - Le token est invalidé après utilisation

3. **Protection** :
   - Rate limiting (limitation du nombre de demandes)
   - CAPTCHA pour éviter les bots
   - HTTPS obligatoire
   - Logging des tentatives de réinitialisation

## 📚 Ressources

- [Documentation EmailJS](https://www.emailjs.com/docs/)
- [Guide des templates](https://www.emailjs.com/docs/user-guide/creating-email-template/)
- [Exemples de code](https://www.emailjs.com/docs/examples/reactjs/)

## 💰 Tarification EmailJS

- **Gratuit** : 200 emails/mois
- **Solo** : 1000 emails/mois ($10/mois)
- **Team** : 5000 emails/mois ($35/mois)

## ❓ Dépannage

### L'email n'est pas envoyé

1. Vérifiez que les IDs EmailJS sont corrects
2. Vérifiez la console du navigateur pour les erreurs
3. Vérifiez que le service email est actif dans EmailJS
4. Vérifiez que l'email source n'est pas bloqué

### L'email arrive en spam

1. Configurez SPF, DKIM dans EmailJS
2. Utilisez un domaine personnalisé
3. Demandez aux utilisateurs d'ajouter l'email à leurs contacts

### Rate limit atteint

1. Vérifiez votre quota dans le dashboard EmailJS
2. Passez à un plan supérieur si nécessaire
3. Implémentez un rate limiting côté client

## 📞 Support

Pour toute question :
- Documentation EmailJS : https://www.emailjs.com/docs/
- Support EmailJS : https://www.emailjs.com/support/
