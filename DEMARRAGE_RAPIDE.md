# 🚀 Démarrage Rapide

## Pour ajouter vos appartements en 3 étapes

### Méthode 1 : Formulaire HTML (Recommandé pour débuter)

1. **Ouvrez** `ajouter_appartement.html` dans votre navigateur
2. **Remplissez** le formulaire avec les informations de votre appartement
3. **Copiez** le JSON généré et ajoutez-le dans `biens.json`

### Méthode 2 : Script Python (Pour automatiser)

```bash
python3 ajouter_appartement.py
```

Le script vous guide pas à pas et met à jour automatiquement `biens.json`.

### Méthode 3 : Canva Bulk Create (Pour plusieurs biens)

1. Créez votre template Canva avec des variables dynamiques
2. Utilisez `template_canva_bulk_create.csv` comme base
3. Générez vos fiches avec Canva Bulk Create
4. Récupérez les URLs et ajoutez les biens

## 📖 Documentation complète

Consultez **[GUIDE_AJOUT_APPARTEMENTS.md](GUIDE_AJOUT_APPARTEMENTS.md)** pour :
- Instructions détaillées pour chaque méthode
- Bonnes pratiques
- Exemples concrets
- FAQ

## 🎨 Connexion avec Canva

Chaque appartement contient un champ `brochureUrl` qui pointe vers votre fiche Canva :

```json
{
  "reference": "VT-1001",
  "brochureUrl": "https://www.canva.com/design/VOTRE-ID/view"
}
```

Le bouton "Dossier complet Canva →" sur le site ouvrira automatiquement cette fiche.

## ✅ Workflow recommandé

1. Créez vos fiches Canva et publiez-les
2. Utilisez le formulaire HTML ou le script Python pour générer le JSON
3. Ajoutez le JSON dans `biens.json`
4. Testez localement : `python3 -m http.server 4173`
5. Poussez sur GitHub : le site se met à jour automatiquement !

```bash
git add biens.json
git commit -m "Ajout de nouveaux appartements"
git push
```

---

**Besoin d'aide ?** Consultez le [guide complet](GUIDE_AJOUT_APPARTEMENTS.md) 📚
