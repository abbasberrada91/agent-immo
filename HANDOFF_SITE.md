# HANDOFF — site canonique henrimartinimmobilier.com (2026-07-10)

> À lire par toute session (Claude ou humain) qui travaille sur ce repo.
> Décision prise par le propriétaire (A. Berrada), sans ambiguïté.

## Ce qui a changé

Deux versions du site coexistaient dans ce repo et se marchaient dessus :

- 🅰️ une version « catalogue » : `nos-biens.html` + `biens.json` (18 **fausses** annonces
  de démo — villas Cannes, maisons Bordeaux, etc.), + un système `login/admin/ajout`
  (`admin_properties.html`, `ajouter_appartement.html`, `START.html`, `login.html`…),
  + les dossiers `agence/`, `ventes/`, `services/`, `conciergerie.html`, `blog.html`,
  + une montagne de docs `*.md`/`*.txt`.
- 🅱️ la version réelle : `index.html` + `location.html`.

**La version 🅰️ a été entièrement supprimée.** Elle publiait de fausses annonces sur le
site public d'une vraie agence — inacceptable.

## Le site canonique = 2 fichiers

- `index.html` — accueil (autonome, CSS inline).
- `location.html` — locations off-market, **en direct** de `https://loffmarketimmo.com/api/public/locations`.

C'est tout. Rien d'autre ne doit être servi publiquement.

## Règles pour la suite (ne pas ré-introduire l'ancien)

1. **Aucune fausse annonce.** Pas de `biens.json` de démo. Toute liste de biens tire ses
   données du **backend** (`/api/public/...`).
2. **Pas de système login/admin dans ce repo vitrine.** L'ajout/gestion des biens se fait
   côté pige-backend / outils admin, pas ici.
3. Si tu recrées une page « Nos biens à la vente », branche-la sur une **vraie** source
   backend et respecte la charte visuelle d'`index.html` (sobre, serif, doré/crème).
4. **Une seule session à la fois** modifie ce repo, pour éviter la divergence qui a causé
   ce nettoyage.

## Récupération

Tout l'ancien contenu reste dans l'historique git (commit juste avant ce nettoyage).
`git log` + `git checkout <sha>^ -- <fichier>` pour restaurer un fichier précis si besoin.
