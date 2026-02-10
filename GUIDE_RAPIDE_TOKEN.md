# 🚀 Guide rapide : Token GitHub

## Pour les pressés (2 minutes)

### 1. Créer le token
1. Allez sur [https://github.com/settings/tokens/new](https://github.com/settings/tokens/new)
2. Nom : `Token Henri Martin Immobilier`
3. Expiration : `90 days` ou `No expiration`
4. **Cochez UNIQUEMENT** :
   - ✅ **repo** (Full control of private repositories)
   - ✅ **workflow** (Update GitHub Action workflows)
5. Cliquez sur **Generate token**
6. **COPIEZ immédiatement** le token (commence par `ghp_`)

### 2. Configurer dans le site
1. Allez sur [Ajouter un appartement](https://abbasberrada91.github.io/agent-immo/ajouter_appartement.html)
2. Cliquez sur **⚙️ Configurer Token**
3. Collez votre token
4. Cliquez sur **OK**

### 3. C'est terminé ! ✅
Vous pouvez maintenant ajouter vos biens automatiquement.

---

## Besoin de plus de détails ?

### 📖 Guides complets disponibles

1. **[Guide interactif (recommandé)](configurer-token.html)** - Interface pas à pas avec explications
2. **[Guide détaillé (markdown)](CONFIGURATION_TOKEN_GITHUB.md)** - Documentation complète avec captures d'écran
3. **[Guide d'automatisation](GUIDE_AUTOMATISATION.md)** - Comment utiliser le système

### ❓ Questions fréquentes

**Q : Pourquoi un token ?**
R : Pour que votre site puisse ajouter automatiquement des biens sans intervention manuelle.

**Q : Est-ce sécurisé ?**
R : Oui ! Le token est stocké localement dans votre navigateur et utilisé uniquement pour communiquer avec GitHub.

**Q : Que faire si je perds mon token ?**
R : Créez-en un nouveau en suivant les étapes ci-dessus. L'ancien sera automatiquement remplacé.

**Q : Combien de temps ça prend ?**
R : 2-5 minutes pour la première configuration. Une seule fois !

**Q : Le token expire ?**
R : Selon votre choix (90 days ou No expiration). Vous recevrez un email avant expiration.

### 🆘 Problèmes ?

**"Token non valide"**
- Vérifiez que vous avez coché **repo** ET **workflow**
- Vérifiez que le token commence par `ghp_`
- Créez un nouveau token si nécessaire

**"Erreur d'autorisation"**
- Le token a peut-être expiré
- Créez un nouveau token avec les bonnes permissions

**Autres problèmes**
- Consultez le [guide complet](CONFIGURATION_TOKEN_GITHUB.md)
- Vérifiez que vous êtes connecté à GitHub

---

## 🔗 Liens rapides

- 🚀 [Ajouter un bien](https://abbasberrada91.github.io/agent-immo/ajouter_appartement.html)
- 📊 [Gérer mes biens](https://abbasberrada91.github.io/agent-immo/admin_properties.html)
- 🔑 [Guide interactif token](https://abbasberrada91.github.io/agent-immo/configurer-token.html)
- 📖 [Guide complet token](CONFIGURATION_TOKEN_GITHUB.md)
- 🏠 [Accueil](https://abbasberrada91.github.io/agent-immo/)

---

**Version** : 1.0  
**Dernière mise à jour** : Février 2026
