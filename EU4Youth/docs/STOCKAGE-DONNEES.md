# EU4Youth CMS — Où sont stockées les données ?

## Réponse courte

**Il n’y a pas de base MySQL/PostgreSQL pour le CMS local.** Tout est enregistré dans un **fichier JSON** sur le serveur, plus un dossier **uploads** pour les images.

C’est adapté au développement et aux petites équipes. Pour la production à grande échelle, une migration vers une vraie base de données reste possible.

---

## Fichier principal : `backend/data/store.json`

C’est le **cœur du CMS**. Chaque enregistrement (sauvegarde, formulaire, publication) met à jour ce fichier.

| Donnée | Clé dans store.json | Exemple |
|--------|---------------------|---------|
| Pages et blocs (contenu du site) | `content.pages`, `content.sections`, `content.blocks` | Accueil, À propos, Contact… |
| Actualités, publications, agenda… | `news`, `publications`, `events`, `opportunities`, `stories`, `videos`, `initiatives` | Fiches catalogue avec statut |
| Six projets | `projects` | Jeun'ESS, GO4Youth… |
| Glossaire | `glossary` | Catégories et définitions |
| Menu du site | `siteNav` | Liens FR / EN / AR |
| Traductions interface | `translations` | Libellés du site |
| Formulaires reçus | `inbox` | Contact + newsletter |
| Comptes CMS | `users` | admin, éditeur, contributeur |
| Historique des actions | `auditLog` | Qui a modifié quoi (500 dernières entrées) |
| Paramètres | `settings` | URL site public, cookies, langues |
| Sessions connexion | `sessions` | Tokens de login |

---

## Images uploadées

Dossier : `backend/uploads/`

Quand un éditeur choisit « Parcourir » pour une image, le fichier est enregistré ici et l’URL est stockée dans la fiche ou le bloc concerné.

---

## Historique d’édition (audit log)

- **Où :** `store.json` → clé `auditLog`
- **Limite :** 500 entrées (les plus récentes en premier)
- **Contenu :** date, utilisateur, action (création, modification, validation, menu…), libellé de la fiche
- **Interface :** menu **Historique** dans le CMS (`/activite`)

Ce n’est **pas** une sauvegarde complète du contenu à chaque version — c’est un **journal d’activité**. Pour restaurer une ancienne version, il faudrait une fonction « versions » (non incluse aujourd’hui).

---

## Formulaires (contact / newsletter)

- **Réception :** le site public envoie vers l’API → entrée ajoutée dans `inbox`
- **Lecture :** menu **Formulaires** dans le CMS
- **Champs :** e-mail, sujet, message, date, lu / non lu, archive

---

## Workflow de publication (catalogues)

Statuts possibles sur les fiches :

| Statut | Signification |
|--------|----------------|
| `draft` | Brouillon — invisible sur le site public |
| `pending_review` | Soumis à validation — en attente éditeur |
| `published` | Publié — visible sur le site |

Les contributeurs ne peuvent pas publier directement : leur demande passe par **À valider** (`/validation`).

---

## Sauvegarde recommandée

1. Copier régulièrement `backend/data/store.json`
2. Copier le dossier `backend/uploads/`
3. En production : automatiser une sauvegarde quotidienne de ces deux éléments

Commande locale (exemple) :

```powershell
Copy-Item "EU4Youth\backend\data\store.json" "EU4Youth\backend\data\backups\store-$(Get-Date -Format yyyy-MM-dd).json"
```

---

## Migration future vers une base de données

Si le programme grandit, on peut remplacer `store.mjs` par PostgreSQL/MySQL **sans changer l’interface du CMS** — seule la couche backend change. Les formulaires, l’historique et les catalogues migreraient vers des tables dédiées.
