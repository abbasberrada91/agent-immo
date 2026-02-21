# Guide de contribution — Henri Martin Immobilier

Merci de contribuer à ce projet ! Ce guide explique comment collaborer efficacement.

## 📋 Sommaire

1. [Inviter un collaborateur](#inviter-un-collaborateur)
2. [Prérequis](#prérequis)
3. [Travailler sur le projet](#travailler-sur-le-projet)
4. [Ajouter ou modifier des biens](#ajouter-ou-modifier-des-biens)
5. [Proposer une modification (Pull Request)](#proposer-une-modification-pull-request)
6. [Signaler un problème (Issue)](#signaler-un-problème-issue)

---

## 👥 Inviter un collaborateur

Pour donner accès au dépôt à un autre utilisateur GitHub :

1. Aller dans **Paramètres** du dépôt
2. Cliquer sur **Collaborateurs** dans le menu de gauche
3. Cliquer sur **Ajouter des personnes**
4. Saisir le nom d'utilisateur ou l'adresse e-mail GitHub du collaborateur
5. Choisir le niveau d'accès : **Lecture**, **Triage**, **Écriture**, **Maintenance** ou **Admin**
6. Cliquer sur **Ajouter [nom d'utilisateur] à ce dépôt**

Le collaborateur recevra une invitation par e-mail et devra l'accepter pour accéder au dépôt.

---

## 🛠 Prérequis

- Avoir un compte GitHub
- Avoir accès au dépôt (voir ci-dessus)
- Avoir un token GitHub Personnel pour modifier les biens via l'interface web
  → Consulter le [guide de configuration du token](CONFIGURATION_TOKEN_GITHUB.md)

---

## 💻 Travailler sur le projet

### Cloner le dépôt

```bash
git clone https://github.com/abbasberrada91/agent-immo.git
cd agent-immo
```

### Lancer le site en local

```bash
python3 -m http.server 4173
```

Puis ouvrir [http://localhost:4173](http://localhost:4173) dans votre navigateur.

### Structure du projet

```
agent-immo/
├── index.html              # Page d'accueil (catalogue des biens)
├── detail.html             # Page de détail d'un bien
├── bien.html               # Fiche bien
├── biens.json              # Base de données des biens immobiliers
├── styles.css              # Styles principaux
├── script.js               # Logique principale
├── config.js               # Configuration centralisée
├── api.js                  # Appels API GitHub
├── auth.js                 # Authentification
├── ajouter_appartement.html  # Formulaire d'ajout de bien
├── admin_properties.html   # Interface d'administration
├── agence/                 # Pages de l'agence (équipe, histoire, etc.)
├── services/               # Pages des services
├── ventes/                 # Pages dédiées aux ventes
└── .github/workflows/      # Workflows GitHub Actions
```

---

## 🏠 Ajouter ou modifier des biens

### Via l'interface web (recommandé)

1. Ouvrir [le formulaire d'ajout](https://abbasberrada91.github.io/agent-immo/ajouter_appartement.html)
2. Configurer votre token GitHub si ce n'est pas déjà fait
3. Remplir le formulaire et soumettre

### Via `biens.json` directement

Modifier le fichier `biens.json` en respectant le format existant, puis soumettre une Pull Request.

---

## 🔀 Proposer une modification (Pull Request)

1. Créer une branche à partir de `main` :
   ```bash
   git checkout -b ma-modification
   ```
2. Faire vos modifications
3. Commiter et pousser :
   ```bash
   git add .
   git commit -m "Description claire de la modification"
   git push origin ma-modification
   ```
4. Ouvrir une Pull Request sur GitHub en ciblant la branche `main`

---

## 🐛 Signaler un problème (Issue)

1. Aller dans l'onglet **Issues** du dépôt
2. Cliquer sur **New issue**
3. Choisir le type d'issue approprié
4. Décrire le problème de manière claire et précise
5. Soumettre l'issue

---

## 📝 Bonnes pratiques

- Toujours travailler sur une branche dédiée, jamais directement sur `main`
- Écrire des messages de commit clairs et descriptifs en français ou en anglais
- Ne jamais commiter de tokens, mots de passe ou informations sensibles
- Tester les modifications en local avant de soumettre une Pull Request
