# Plan de test A → Z — EU4Youth CMS

**Objectif :** vérifier qu’un utilisateur **sans connaissance technique** peut utiliser le CMS sans problème.

**Environnement :**

| Service | URL | Commande |
|---------|-----|----------|
| API | http://localhost:8040 | `EU4Youth/tools/start-local.ps1` |
| Site public | http://localhost:3030 | (inclus dans start-local) |
| CMS | http://localhost:3040 | (inclus dans start-local) |

**Comptes de test :**

| Rôle | E-mail | Mot de passe |
|------|--------|--------------|
| Administrateur | `$EU4Y_ADMIN_EMAIL` | `$EU4Y_ADMIN_PASSWORD` |

---

## A. Démarrage et connexion

| # | Action | Résultat attendu | OK |
|---|--------|------------------|-----|
| A1 | Lancer `start-local.ps1` | 3 URLs affichées sans erreur | ☐ |
| A2 | Ouvrir http://localhost:3040 | Page de connexion CMS | ☐ |
| A3 | Se connecter avec le compte admin | Tableau de bord, nom affiché | ☐ |
| A4 | Rafraîchir (F5) | Reste connecté | ☐ |
| A5 | Déconnexion | Retour login | ☐ |

---

## B. Tableau de bord et aide

| # | Action | Résultat attendu | OK |
|---|--------|------------------|-----|
| B1 | Première connexion | Guide de démarrage (4 étapes) s’affiche | ☐ |
| B2 | Fermer le guide | Ne revient plus (sauf bouton « Guide de démarrage ») | ☐ |
| B3 | Bouton **Aide** | Panneau d’aide contextuelle | ☐ |
| B4 | Section « À traiter » | Liens cliquables (messages, brouillons, à valider) | ☐ |
| B5 | Raccourcis | Chaque carte mène à la bonne page | ☐ |

---

## C. Aperçu live (édition du site)

| # | Action | Résultat attendu | OK |
|---|--------|------------------|-----|
| C1 | Menu → **Aperçu live** | Site public dans le CMS, crayons orange | ☐ |
| C2 | Clic crayon sur un titre | Modification du texte FR | ☐ |
| C3 | Changer langue FR / EN / AR | Contenu bascule | ☐ |
| C4 | **Enregistrer** (ou Ctrl+S) | Toast « Contenu enregistré » | ☐ |
| C5 | Ouvrir http://localhost:3030 | Modification visible sur le site | ☐ |
| C6 | Toggle panneau (icône) | Liste pages masquée, **aperçu reste visible** | ☐ |
| C7 | Toggle **CMS** | Menu latéral masqué, éditeur plein écran | ☐ |
| C8 | Liste pages → Page d’accueil | Navigation vers une autre page | ☐ |
| C9 | Bouton **Aide** dans la barre | Conseils d’édition | ☐ |

---

## D. Paramètres du site (global)

| # | Action | Résultat attendu | OK |
|---|--------|------------------|-----|
| D1 | Contenu du site → **Paramètres du site** | Onglets En-tête, Pied, Cookies, Menu | ☐ |
| D2 | En-tête : changer un logo (Parcourir) | Aperçu mis à jour | ☐ |
| D3 | Menu : modifier libellé FR | Enregistrement auto | ☐ |
| D4 | Menu : glisser poignée ⋮⋮ | Ordre mis à jour | ☐ |
| D5 | Menu : choisir page dans liste | URL remplie sans taper | ☐ |
| D6 | Cookies : modifier texte bandeau | Aperçu cookie visible | ☐ |

---

## E. Catalogues — Actualités

| # | Action | Résultat attendu | OK |
|---|--------|------------------|-----|
| E1 | **Actualités** → Nouvelle fiche | Formulaire en français, pas de slug visible | ☐ |
| E2 | Remplir titre + résumé + image | Champs compréhensibles | ☐ |
| E3 | Enregistrer (brouillon) | Toast succès, statut Brouillon | ☐ |
| E4 | **Dupliquer** une fiche | Copie en brouillon « (copie) » | ☐ |
| E5 | **Soumettre à validation** | Confirmation, statut En validation | ☐ |
| E6 | **Aperçu sur le site** (si publié) | Ouvre la fiche sur :3030 | ☐ |
| E7 | Supprimer (avec confirmation) | Fiche retirée de la liste | ☐ |

---

## F. Workflow validation (éditeur / admin)

| # | Action | Résultat attendu | OK |
|---|--------|------------------|-----|
| F1 | Menu → **À valider** | Liste des fiches `pending_review` | ☐ |
| F2 | **Valider et publier** | Confirmation puis toast, fiche disparaît de la queue | ☐ |
| F3 | Site public | Fiche visible sur /actualites | ☐ |
| F4 | **Historique** | Entrée « Fiche publiée (validation) » | ☐ |
| F5 | Publier avec EN/AR manquants | Avertissement avant confirmation | ☐ |

---

## G. Autres catalogues (échantillon)

Répéter E1–E3 sur au moins **une** fiche de chaque :

| Catalogue | Chemin public | OK |
|-----------|---------------|-----|
| Publications | /publications | ☐ |
| Agenda | /agenda | ☐ |
| Opportunités | /opportunites | ☐ |
| Initiatives | /carte | ☐ |
| Youth Stories | /stories | ☐ |
| Vidéothèque | Lien YouTube parsé | ☐ |

---

## H. Six projets

| # | Action | Résultat attendu | OK |
|---|--------|------------------|-----|
| H1 | Ouvrir un projet (ex. Jeun'ESS) | Éditeur FR/EN/AR | ☐ |
| H2 | Modifier accroche, enregistrer | Toast succès | ☐ |
| H3 | Site /projets/jeuness | Changement visible | ☐ |

---

## I. Formulaires (inbox)

| # | Action | Résultat attendu | OK |
|---|--------|------------------|-----|
| I1 | Site public → formulaire contact | Message reçu | ☐ |
| I2 | CMS → **Formulaires** | Carte lisible (pas de JSON brut) | ☐ |
| I3 | Marquer lu / archiver | Compteur dashboard mis à jour | ☐ |

---

## J. Traductions et glossaire

| # | Action | Résultat attendu | OK |
|---|--------|------------------|-----|
| J1 | **Traductions** | Libellés humains, pas clés techniques | ☐ |
| J2 | Modifier un libellé FR | Enregistré | ☐ |
| J3 | **Glossaire** | Édition par catégories | ☐ |
| J4 | Mode JSON (admin) | Masqué pour non-admin | ☐ |

---

## K. Utilisateurs et rôles

| # | Action | Résultat attendu | OK |
|---|--------|------------------|-----|
| K1 | **Équipe** → créer contributeur | Compte créé, projet assigné | ☐ |
| K2 | Connexion contributeur | Voit uniquement son projet (catalogues) | ☐ |
| K3 | Contributeur tente **Publier** | Devient « Soumettre à validation » | ☐ |
| K4 | **Rôles** : désactiver catalogues | Menu catalogues masqué pour ce rôle | ☐ |

---

## L. Historique et données

| # | Action | Résultat attendu | OK |
|---|--------|------------------|-----|
| L1 | **Historique** après plusieurs actions | Entrées datées avec nom utilisateur | ☐ |
| L2 | Filtre « Catalogues » | Seules actions catalogue | ☐ |
| L3 | Vérifier `backend/data/store.json` | Fichier existe et grossit après saves | ☐ |
| L4 | Vérifier `backend/uploads/` | Images uploadées présentes | ☐ |

---

## M. Permissions et sécurité (base)

| # | Action | Résultat attendu | OK |
|---|--------|------------------|-----|
| M1 | URL /equipe sans droit users | Redirection dashboard | ☐ |
| M2 | API sans token | 401 / refus | ☐ |
| M3 | Mot de passe &lt; 8 caractères (nouveau user) | Message d’erreur clair | ☐ |

---

## N. Build et non-régression

| # | Commande | Résultat attendu | OK |
|---|----------|------------------|-----|
| N1 | `cd EU4Youth/frontend && npm run build` | Build OK sans erreur TS | ☐ |
| N2 | `node --check EU4Youth/backend/src/server.mjs` | Pas d’erreur syntaxe | ☐ |

---

## O. Checklist « prêt pour les éditeurs »

- [ ] Guide de démarrage testé avec une personne non technique
- [ ] Aucun champ « slug » ou JSON visible pour les rôles standard
- [ ] Workflow brouillon → validation → publication testé de bout en bout
- [ ] Sauvegarde `store.json` + `uploads/` planifiée
- [ ] Comptes réels créés (pas seulement admin demo)
- [ ] Hard refresh (Ctrl+F5) documenté après déploiement CSS

---

## Rapport de test (modèle)

```
Date :
Testeur :
Version / commit :

Résumé : ___ / ___ tests OK

Bloquants :
-

Mineurs :
-

Notes :
-
```
