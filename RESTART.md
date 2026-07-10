# 🔄 Restart & UI Links — Henri Martin Immobilier

## 🌐 UI Links

| Environment | URL |
|---|---|
| **Site principal (GitHub Pages)** | https://abbasberrada91.github.io/agent-immo/ |
| **Domaine personnalisé** | https://www.henrimartinimmobilier.com |
| **Formulaire d'ajout de bien** | https://abbasberrada91.github.io/agent-immo/ajouter_appartement.html |
| **Guide configuration token** | https://abbasberrada91.github.io/agent-immo/configurer-token.html |

> **Note :** Le domaine personnalisé `www.henrimartinimmobilier.com` pointe vers GitHub Pages via un enregistrement CNAME. Les deux URLs affichent le même site.

---

## 🔄 Redémarrer / Relancer le site

Ce projet est un site statique (HTML/CSS/JS + `biens.json`) hébergé sur **GitHub Pages**. Il n'y a pas de serveur backend traditionnel à redémarrer.

### Option 1 : Workflow dédié « Restart » (recommandé)

1. Allez sur : **https://github.com/abbasberrada91/agent-immo/actions/workflows/restart-deploy.yml**
2. Cliquez sur **« Run workflow »**
3. (Optionnel) Saisissez une raison dans le champ *Reason for restart*
4. Cliquez sur **« Run workflow »** (bouton vert)
5. Attendez 1–2 minutes → le site est redéployé ✅

### Option 2 : Workflow de déploiement principal

1. Allez sur : **https://github.com/abbasberrada91/agent-immo/actions/workflows/pages.yml**
2. Cliquez sur **« Run workflow »**
3. Sélectionnez la branche `main`
4. Cliquez sur **« Run workflow »** (bouton vert)
5. Attendez 1–2 minutes → le site est redéployé ✅

### Option 3 : Déclencher via un push sur `main`

Tout push sur la branche `main` déclenche automatiquement un redéploiement :

```bash
git commit --allow-empty -m "chore: force redeploy"
git push origin main
```

---

## 📊 Vérifier le statut du déploiement

- **GitHub Actions** : https://github.com/abbasberrada91/agent-immo/actions
- **GitHub Pages Settings** : https://github.com/abbasberrada91/agent-immo/settings/pages

---

## ℹ️ Architecture

```
Frontend (statique)
  └─ HTML / CSS / JS
  └─ biens.json (données des biens)
  └─ Hébergé sur GitHub Pages

"Backend" (GitHub Actions)
  └─ pages.yml         → Déploiement automatique
  └─ restart-deploy.yml → Redémarrage manuel
  └─ add-property.yml  → Ajout de biens
  └─ cloudinary-gallery.yml → Mise à jour des fiches
```

Pas de serveur applicatif : le site est 100 % statique.
