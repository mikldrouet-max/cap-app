# Cap.

Application de gestion de tâches personnelle — fichier HTML unique, hébergé sur GitHub Pages.

## Fonctionnalités

- **Deux espaces** : Pro 💼 et Perso 🏠, fichiers séparés
- **Stockage GitHub** : données dans un dépôt privé `cap-data`
- **Chiffrement AES-256-GCM** : rien n'est lisible sur GitHub sans la phrase secrète
- **Progressive Web App** : installable sur iPhone via Safari → Partager → Sur l'écran d'accueil
- **Mode hors ligne** : lecture des dernières données connues sans réseau
- **Responsive** : adapté iPhone, tablette et desktop
- **Saisie rapide** : `#projet`, `@personne`, `!` priorité, `r:semaine` récurrence, dates en langage naturel
- **Vue Parents** : suivi de projets avec frise Gantt et sous-tâches
- **Thème clair / sombre**

## Architecture

```
GitHub
├── cap-app (PUBLIC)      → code de l'app, GitHub Pages
│   ├── index.html        → l'app complète (fichier unique)
│   ├── manifest.json     → déclaration PWA
│   ├── sw.js             → service worker (cache offline)
│   ├── icon-192.png      → icône app
│   └── icon-512.png      → icône splash
│
└── cap-data (PRIVÉ)      → données chiffrées
    ├── pro.md            → tâches Pro
    ├── perso.md          → tâches Perso
    ├── archive-pro.md    → tâches Pro terminées > 30 jours
    ├── archive-perso.md  → tâches Perso terminées > 30 jours
    └── salt.b64          → sel de chiffrement (non secret)
```

## Installation

### 1. Prérequis GitHub

- Dépôt **public** `cap-app` avec GitHub Pages activé (`Settings → Pages → main / root`)
- Dépôt **privé** `cap-data` avec les 5 fichiers vides créés
- Jeton d'accès fine-grained : `Settings → Developer settings → Fine-grained tokens`
  - Portée : dépôt `cap-data` uniquement
  - Permission : Contents → Read and write
  - Expiration : 1 an recommandé

### 2. Déployer l'app

Uploader les 5 fichiers de ce dépôt à la racine de `cap-app`.
L'app est disponible sur `https://TON_PSEUDO.github.io/cap-app`.

### 3. Premier lancement

1. Ouvrir l'URL dans Safari (iPhone) ou Chrome/Firefox (desktop)
2. Renseigner le nom du dépôt de données (`cap-data`)
3. Coller le jeton GitHub
4. Choisir une phrase secrète de chiffrement — **à noter en lieu sûr, irrécupérable**
5. Cliquer Se connecter

L'app mémorise le jeton et la phrase sur l'appareil. Pas de ressaisie sauf si le cache est vidé.

### 4. Installation iPhone (PWA)

Safari → ouvrir l'URL → icône Partager → **Sur l'écran d'accueil** → Ajouter.
L'app s'ouvre en plein écran, sans barre Safari.

## Syntaxe des tâches

```markdown
- [ ] Tâche simple
- [ ] ! Tâche haute priorité
- [ ] __ Tâche basse priorité
- [ ] Appeler @David sur #PNow 📅2026-07-15
- [ ] Revue hebdo r:lundi
- [/] Tâche en cours
- [x] Tâche terminée

= Mon projet parent 📅2026-06-01 🏁2026-09-30 ^mon-projet
- [ ] Sous-tâche ^mon-projet
```

## Sécurité

| Élément | Protection |
|---|---|
| Données sur GitHub | Dépôt privé + chiffrement AES-256-GCM |
| Jeton GitHub | Limité à `cap-data`, expiration 1 an |
| Phrase secrète perdue | Données irrécupérables — exporter en clair avant |
| Appareil perdu | Code appareil + jeton + phrase requis |

## Export de sauvegarde

Bouton **⬇ Export** dans le header → télécharge toutes les tâches en clair (`.txt`).
À conserver en lieu sûr, séparé de l'appareil.

## Renouvellement du jeton

Une fois par an, GitHub envoie un mail d'alerte.
Aller dans GitHub → Settings → Fine-grained tokens → Régénérer → Coller dans l'app via **⚙ GitHub**.
