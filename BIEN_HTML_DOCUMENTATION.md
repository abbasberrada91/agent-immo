# Documentation - Page Fiche Bien (bien.html)

## Vue d'ensemble

La page `bien.html` est une page de détail de bien immobilier avec support d'un **mode API (Mode B)** et un **fallback automatique vers JSON local**.

## Caractéristiques principales

### 1. Double mode de chargement des données

#### Mode API (Mode B)
- Charge les données depuis l'API GitHub via `api.js` et `PropertyAPI`
- Badge "Mode API" affiché en haut à droite
- Utilisé en priorité si disponible

#### Mode Local (Fallback automatique)
- Charge les données depuis le fichier local `biens.json`
- Badge "Mode Local" affiché en haut à droite
- Activé automatiquement si le mode API échoue
- Garantit que le site fonctionne toujours, même sans accès API

### 2. Support de paramètres URL multiples

La page accepte deux formats de paramètres :
- **Nouveau format** : `bien.html?id=VT-4012`
- **Format compatible** : `bien.html?ref=VT-4012`

Cela permet une compatibilité avec l'ancienne page `detail.html`.

### 3. Interface utilisateur complète

#### Galerie photos
- Affichage d'une photo principale et jusqu'à 4 miniatures
- Indicateur du nombre total de photos
- Modal plein écran avec navigation (flèches, clavier)
- Support du clavier (Échap pour fermer, flèches pour naviguer)

#### Informations du bien
- Badge Transaction (Vente/Location)
- Référence du bien
- Titre et localisation
- Prix formaté (avec "par mois" pour les locations)
- Caractéristiques détaillées (surface, pièces, type, transaction)
- Liste des équipements avec icônes de validation

#### Actions
- Bouton "Contacter"
- Lien vers le dossier Canva (si disponible)
- Bouton retour vers la liste des biens

### 4. Gestion d'erreurs robuste

#### Erreur de bien non trouvé
- Message clair avec l'identifiant recherché
- Suggestions d'actions
- Lien de retour à l'accueil

#### Erreur de chargement
- Messages d'erreur spécifiques selon le type (réseau, JSON invalide, 404, etc.)
- Suggestions contextuelles selon l'erreur
- Interface cohérente avec le reste du site

## Architecture technique

### Dépendances
- `config.js` : Configuration de l'application
- `api.js` : Client API pour GitHub
- `drawer.js` : Menu mobile
- `styles.css` : Styles globaux
- `drawer.css` : Styles du menu mobile

### Stratégie de chargement

```javascript
1. Tentative de chargement via API GitHub (loadFromAPI)
   ├─ Succès → dataSource = 'api'
   └─ Échec → Fallback vers JSON local

2. Chargement depuis biens.json local (loadFromLocal)
   ├─ Succès → dataSource = 'local'
   └─ Échec → Affichage erreur utilisateur

3. Recherche du bien par identifiant
   ├─ Trouvé → Affichage du bien
   └─ Non trouvé → Message d'erreur avec suggestions
```

### Variables d'état
- `currentProperty` : Bien immobilier actuellement affiché
- `currentPhotoIndex` : Index de la photo dans le modal
- `photos` : Tableau des URLs de photos
- `dataSource` : Source des données ('api', 'local', ou 'unknown')

## Utilisation

### Intégration dans le site

Pour créer un lien vers une fiche bien :

```html
<!-- Avec le nouveau paramètre 'id' -->
<a href="bien.html?id=VT-4012">Voir ce bien</a>

<!-- Avec le paramètre compatible 'ref' -->
<a href="bien.html?ref=VT-4012">Voir ce bien</a>
```

### Depuis JavaScript

```javascript
// Redirection vers une fiche bien
window.location.href = `bien.html?id=${propertyReference}`;
```

## Compatibilité

### Navigateurs
- Chrome/Edge : ✅ Support complet
- Firefox : ✅ Support complet
- Safari : ✅ Support complet
- Mobile : ✅ Responsive design

### GitHub Pages
- ✅ Compatible avec déploiement statique
- ✅ Fonctionne sans backend
- ✅ Fallback automatique au JSON local

## Tests effectués

### ✅ Test de chargement
- [x] Chargement d'un bien à la vente (VT-4012)
- [x] Chargement d'un bien en location (LC-7124)
- [x] Gestion d'un identifiant invalide
- [x] Compatibilité avec paramètre `?ref=`

### ✅ Test des fonctionnalités
- [x] Galerie photos avec modal
- [x] Navigation au clavier dans le modal
- [x] Affichage correct du prix (vente vs location)
- [x] Badge de source de données (API/Local)
- [x] Liens et boutons fonctionnels

### ✅ Test du fallback
- [x] Fallback automatique de API vers Local
- [x] Messages d'erreur appropriés
- [x] Suggestions contextuelles

## Maintenance

### Ajouter un nouveau champ

Pour ajouter un nouveau champ au bien immobilier :

1. Ajouter le champ dans `biens.json`
2. Modifier la section appropriée dans `bien.html` (fonction `displayProperty`)
3. Ajouter le style CSS si nécessaire

### Modifier le style

Les styles sont définis dans la balise `<style>` de `bien.html`. Les classes principales :
- `.property-header` : En-tête du bien
- `.photo-gallery` : Galerie de photos
- `.details-section` : Section de détails
- `.price-card` : Carte de prix
- `.modal` : Modal des photos

## Différences avec detail.html

| Fonctionnalité | detail.html | bien.html |
|----------------|-------------|-----------|
| Paramètre URL | `?ref=` | `?id=` (+ `?ref=` compatible) |
| Mode API | ❌ Non | ✅ Oui avec fallback |
| Badge source données | ❌ Non | ✅ Oui |
| Chargement | JSON local uniquement | API puis fallback local |
| Gestion erreurs | Basique | Avancée avec suggestions |

## Notes importantes

1. **Ne pas supprimer detail.html** : Gardez-le pour compatibilité avec liens existants
2. **Fichier biens.json requis** : Le fichier doit exister à la racine pour le mode fallback
3. **API optionnelle** : Le site fonctionne même si l'API GitHub n'est pas accessible
4. **Cache désactivé** : Les requêtes utilisent `cache: 'no-cache'` pour garantir des données fraîches

## Sécurité

- ✅ Pas de code JavaScript dangereux (pas d'eval, pas d'innerHTML avec données utilisateur)
- ✅ Utilisation de méthodes DOM sécurisées pour éviter XSS
- ✅ Validation des structures de données
- ✅ Gestion sécurisée des erreurs sans exposer d'informations sensibles
