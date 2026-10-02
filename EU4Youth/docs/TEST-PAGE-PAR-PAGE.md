# Test page par page — EU4Youth CMS

**À faire ensemble** : ouvrez http://localhost:3040 (connecté avec le compte admin) et cochez chaque page.

**Données API vérifiées le 2026-09-01** — toutes les routes répondent ✅

---

## PARTIE 1 — CMS (back-office)

### Page 1 — Tableau de bord
**URL :** http://localhost:3040/dashboard

| À vérifier sur votre écran | OK |
|----------------------------|-----|
| Titre « Bonjour Super » | ☐ |
| Section « À traiter » (messages, brouillons) | ☐ |
| Bouton **Guide de démarrage** | ☐ |
| Bouton **Aide** → panneau conseils | ☐ |
| Grille de raccourcis (12 cartes) | ☐ |

**Données :** 30 pages, 2 messages inbox, 2 brouillons catalogue

---

### Page 2 — Aperçu live
**URL :** http://localhost:3040/live-editor

| À vérifier | OK |
|------------|-----|
| Site public dans le cadre central | ☐ |
| Crayons **orange** sur les textes | ☐ |
| Liste des pages à gauche (31 pages) | ☐ |
| Boutons FR / EN / AR | ☐ |
| Toggle **Masquer liste** → aperçu reste visible | ☐ |
| Toggle **CMS** → plein écran | ☐ |
| Bouton **Enregistrer** (grisé si rien à sauver) | ☐ |

**Action ensemble :** cliquez un crayon orange, modifiez un mot, Ctrl+S, vérifiez le toast.

---

### Page 3 — Contenu du site
**URL :** http://localhost:3040/pages

| À vérifier | OK |
|------------|-----|
| Liste **31 pages** groupées (Système, Public, Programme…) | ☐ |
| **Paramètres du site** en haut (Système) | ☐ |
| Clic Page d'accueil → 8 zones / composants | ☐ |
| Aperçu instantané à droite | ☐ |
| Boutons Bureau / Tablette / Mobile | ☐ |

---

### Page 3b — Paramètres du site (sous-page)
**URL :** http://localhost:3040/pages?page=global

| Onglet | À vérifier | OK |
|--------|------------|-----|
| **En-tête** | 4 cartes logo/drapeaux/icônes + Parcourir | ☐ |
| **Pied de page** | Liens et textes FR/EN/AR | ☐ |
| **Cookies** | Texte bandeau + boutons Accepter/Refuser | ☐ |
| **Menu du site** | Poignées ⋮⋮, 19 liens, FR/EN/AR, liste pages | ☐ |

---

### Page 4 — Traductions
**URL :** http://localhost:3040/traductions

| À vérifier | OK |
|------------|-----|
| **37 libellés** en français (pas de clés techniques) | ☐ |
| Colonnes FR / EN / AR + bouton Sauver | ☐ |
| Filtre recherche | ☐ |
| « Compléter EN / AR depuis le français » | ☐ |

---

### Page 5 — Six projets
**URL :** http://localhost:3040/projets

| À vérifier | OK |
|------------|-----|
| **6 cartes** : Jeun'ESS, GO4Youth, SWAFY, IRADA4YOUTH, Maghroum'IN, Fe3il.a | ☐ |
| Badge **PUBLIÉ** sur chaque carte | ☐ |
| Onglets Français / English / العربية | ☐ |
| Clic une carte → éditeur détaillé | ☐ |

---

### Page 6 — Actualités
**URL :** http://localhost:3040/actualites

| À vérifier | OK |
|------------|-----|
| **11 fiches** listées | ☐ |
| Bouton **+ Nouvelle fiche** | ☐ |
| Colonnes : Titre, Type, Date, Projet, **Statut** | ☐ |
| Badges PUBLIÉ (vert) / BROUILLON (orange) | ☐ |
| Actions : Aperçu, Modifier, **Dupliquer**, Supprimer | ☐ |
| Éditeur : pas de champ « slug » visible | ☐ |

---

### Page 7 — Publications
**URL :** http://localhost:3040/publications

| À vérifier | OK |
|------------|-----|
| Liste des fiches (**13** en base) | ☐ |
| Nouvelle fiche + formulaire FR | ☐ |
| Site public : http://localhost:3030/publications | ☐ |

---

### Page 8 — Agenda
**URL :** http://localhost:3040/agenda

| À vérifier | OK |
|------------|-----|
| Liste événements (**29** en base) | ☐ |
| Dates et lieux compréhensibles | ☐ |
| Site public : http://localhost:3030/agenda | ☐ |

---

### Page 9 — Initiatives / carte
**URL :** http://localhost:3040/initiatives

| À vérifier | OK |
|------------|-----|
| Liste fiches territoire (**707** en base) | ☐ |
| Champs gouvernorat / GPS | ☐ |
| Site public : http://localhost:3030/carte | ☐ |

---

### Page 10 — Youth Stories
**URL :** http://localhost:3040/stories

| À vérifier | OK |
|------------|-----|
| Page charge (0 fiches — normal si vide) | ☐ |
| Bouton Nouvelle fiche disponible | ☐ |
| Site public : http://localhost:3030/stories | ☐ |

---

### Page 11 — Vidéothèque
**URL :** http://localhost:3040/videos

| À vérifier | OK |
|------------|-----|
| Page charge (0 vidéos — normal si vide) | ☐ |
| Champ lien YouTube dans l'éditeur | ☐ |

---

### Page 12 — Opportunités
**URL :** http://localhost:3040/opportunites

| À vérifier | OK |
|------------|-----|
| **2 fiches** en base | ☐ |
| Site public : http://localhost:3030/opportunites | ☐ |

---

### Page 13 — Glossaire
**URL :** http://localhost:3040/glossaire

| À vérifier | OK |
|------------|-----|
| **12 entrées** par catégories | ☐ |
| Édition FR / EN / AR | ☐ |
| Site public : http://localhost:3030/glossaire | ☐ |

---

### Page 14 — Formulaires
**URL :** http://localhost:3040/inbox

| À vérifier | OK |
|------------|-----|
| Filtres : Tous / Contact / Newsletter / Archivés | ☐ |
| Messages en **cartes lisibles** (pas JSON) | ☐ |
| Bouton **Tout marquer lu** | ☐ |
| **2 messages** en base (vérifiez onglet Archivés si vide) | ☐ |

---

### Page 15 — À valider
**URL :** http://localhost:3040/validation

| À vérifier | OK |
|------------|-----|
| Liste vide = « tout est à jour » OU fiches en attente | ☐ |
| Boutons **Ouvrir / Aperçu / Valider et publier** | ☐ |
| Badge rouge dans le menu quand file non vide | ☐ |

**Test workflow :** Actualités → Nouvelle fiche → Soumettre à validation → revenir ici.

---

### Page 16 — Historique
**URL :** http://localhost:3040/activite

| À vérifier | OK |
|------------|-----|
| **47 entrées** datées | ☐ |
| Nom utilisateur (Super Admin, etc.) | ☐ |
| Filtre : Catalogues / Menu / Contenu / Utilisateurs | ☐ |
| Entrée « Fiche publiée (validation) » visible | ☐ |

---

### Page 17 — Équipe (Utilisateurs)
**URL :** http://localhost:3040/equipe

| À vérifier | OK |
|------------|-----|
| Liste des comptes | ☐ |
| Bouton créer utilisateur | ☐ |
| Rôles : administrateur, éditeur, contributeur | ☐ |

---

### Page 18 — Rôles et permissions
**URL :** http://localhost:3040/roles

| À vérifier | OK |
|------------|-----|
| **4 rôles** listés | ☐ |
| Cases à cocher : contenu, catalogues, utilisateurs… | ☐ |
| Modifications sauvegardées | ☐ |

---

### Page 19 — Cookies & légal
**URL :** http://localhost:3040/legal

| À vérifier | OK |
|------------|-----|
| Paramètres bandeau cookies | ☐ |
| Textes légaux éditables | ☐ |

---

## PARTIE 2 — Site public (vérification)

Ouvrez http://localhost:3030 dans un autre onglet :

| Page | URL | OK |
|------|-----|-----|
| Accueil | / | ☐ |
| Contact | /contact | ☐ |
| Actualités | /actualites | ☐ |
| Publications | /publications | ☐ |
| Agenda | /agenda | ☐ |
| Opportunités | /opportunites | ☐ |
| Carte | /carte | ☐ |
| Projets | /projets | ☐ |
| Fiche Jeun'ESS | /projets/jeuness | ☐ |
| Glossaire | /glossaire | ☐ |

**Test formulaire :** sur /contact, envoyez un message → vérifiez dans CMS **Formulaires**.

---

## PARTIE 3 — Parcours complet (15 min)

1. ☐ Dashboard → Aperçu live → modifier un titre → Enregistrer
2. ☐ Paramètres du site → Menu → glisser un lien
3. ☐ Actualités → Nouvelle fiche → Brouillon → Soumettre à validation
4. ☐ À valider → Valider et publier
5. ☐ Site public → voir la fiche sur /actualites
6. ☐ Historique → voir l'entrée
7. ☐ Formulaires → lire un message contact

---

## Résultat session auto (2026-09-01)

| Zone | Pages testées | Statut |
|------|---------------|--------|
| CMS navigation | 19/19 | ✅ Toutes chargent |
| API données | 19/19 endpoints | ✅ |
| Site public | 10/10 URLs | ✅ HTTP 200 |
| Workflow validation | bout en bout | ✅ Visuel OK |
| Live editor toggles | C6, C7 | ✅ |

**Score estimé : 98–100 %** — il reste le clic crayon live (manuel) et le test contributeur.

---

*Cochez les cases au fur et à mesure. Dites-moi le numéro de page si quelque chose ne correspond pas à votre écran.*
