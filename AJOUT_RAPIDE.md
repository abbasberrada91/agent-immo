# 🚀 AJOUTER DES BIENS - DÉMARRAGE RAPIDE

## ✨ MÉTHODE LA PLUS SIMPLE

### 1. Ouvrez le formulaire

**Double-cliquez sur ce fichier :**
```
START.html
```

### 2. Remplissez le formulaire

- Référence : VT-xxxx (vente) ou LC-xxxx (location)
- Type : Appartement, Maison, Villa, etc.
- Informations : Ville, quartier, surface, pièces, prix
- Caractéristiques : Balcon, Parking, etc.
- Image : URL d'une photo (Unsplash.com gratuit)
- Canva : URL de votre fiche Canva

### 3. Générez le JSON

Cliquez sur **"✨ Générer le JSON"**

### 4. Ajoutez dans biens.json

1. Ouvrez `biens.json`
2. Trouvez le dernier bien (actuellement VT-2001)
3. Ajoutez une **virgule** après `}`
4. **Collez** votre JSON
5. **Sauvegardez**

### 5. Testez localement

```bash
python3 -m http.server 8080
```

Ouvrez http://localhost:8080

### 6. Déployez

```bash
git add biens.json
git commit -m "Ajout de nouveaux biens"
git push
```

---

## 📖 GUIDE COMPLET

Pour plus de détails, consultez :
**[COMMENT_AJOUTER_BIENS.md](COMMENT_AJOUTER_BIENS.md)**

---

## ✅ EXEMPLE

Un bien a déjà été ajouté pour vous montrer :
- **VT-2001** - Appartement lumineux à Paris Marais
- 90 m² - 3 pièces - 780 000 €

Le site affiche maintenant **17 biens** ! 🎉

---

**C'est tout ! Suivez ces 6 étapes simples.**
