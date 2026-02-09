# 📝 Comment utiliser le formulaire d'ajout d'appartements

## 🔗 Accéder au formulaire

### Méthode 1 : En ligne (recommandé)

**Cliquez sur ce lien :**
**[https://abbasberrada91.github.io/agent-immo/ajouter_appartement.html](https://abbasberrada91.github.io/agent-immo/ajouter_appartement.html)**

> Si vous avez configuré le domaine personnalisé, utilisez :  
> [https://www.henrimartinimmobilier.fr/ajouter_appartement.html](https://www.henrimartinimmobilier.fr/ajouter_appartement.html)

### Méthode 2 : Local

Ouvrez le fichier `ajouter_appartement.html` directement depuis votre ordinateur en double-cliquant dessus.

---

## ✏️ Remplir le formulaire

Le formulaire vous demande :

1. **Référence** : Unique (ex: VT-1001 pour vente, LC-2001 pour location)
2. **Transaction** : Vente ou Location
3. **Type de bien** : Appartement, Maison, Villa, etc.
4. **Titre** : Court et descriptif (ex: "Appartement moderne")
5. **Ville** : Paris, Lyon, etc.
6. **Quartier** : 16e, Marais, Centre, etc.
7. **Surface** : En m² (ex: 85)
8. **Nombre de pièces** : (ex: 3)
9. **Prix** : En euros - prix total pour vente ou loyer mensuel pour location
10. **Caractéristiques** : Séparées par des virgules (ex: "Balcon, Parking, Rénové")
11. **URL de l'image** : Lien vers une photo (Unsplash, votre hébergeur, etc.)
12. **Description de l'image** : Pour l'accessibilité
13. **URL Fiche Canva** : Lien vers votre fiche Canva publiée

---

## 📋 Copier le JSON généré

Après avoir cliqué sur "✨ Générer le JSON" :

1. Le JSON s'affiche en bas de la page
2. Cliquez sur "📋 Copier le JSON"
3. Le JSON est copié dans votre presse-papiers

---

## 🔄 Ajouter dans biens.json

1. Ouvrez le fichier `biens.json`
2. Trouvez le tableau `"properties": [`
3. Ajoutez une virgule après le dernier bien
4. Collez le JSON copié
5. Sauvegardez le fichier

### Exemple :

```json
{
  "properties": [
    {
      "reference": "VT-4012",
      ...
    },
    {
      "reference": "LC-7124",
      ...
    },
    <--- ICI, ajoutez une virgule
    <--- Puis collez votre nouveau JSON
    {
      "reference": "VT-1001",
      "transaction": "vente",
      ...
    }
  ]
}
```

---

## 🚀 Déployer

Une fois `biens.json` mis à jour :

```bash
git add biens.json
git commit -m "Ajout d'un nouvel appartement"
git push
```

Le site se mettra à jour automatiquement via GitHub Actions ! 🎉

---

## ❓ Questions fréquentes

### Le lien ne fonctionne pas ?

- Vérifiez que vous êtes sur la branche `main` ou `work` (le site se déploie depuis ces branches)
- Utilisez la méthode locale en ouvrant `ajouter_appartement.html` directement
- Ou utilisez le script Python : `python3 ajouter_appartement.py`

### Comment trouver des images ?

- **Unsplash** : [https://unsplash.com/](https://unsplash.com/) - Photos gratuites
- **Vos propres photos** : Uploadez-les sur un hébergeur (imgur, cloudinary, etc.)
- **Depuis Canva** : Exportez l'image de votre fiche

### Comment créer une fiche Canva ?

1. Créez un design sur Canva.com
2. Publiez-le avec partage public
3. Copiez l'URL (ex: `https://www.canva.com/design/DAFxxx/view`)
4. Collez cette URL dans le champ "URL Fiche Canva"

---

**🎯 Besoin d'aide ? Consultez le [GUIDE_AJOUT_APPARTEMENTS.md](GUIDE_AJOUT_APPARTEMENTS.md) pour plus de détails.**
