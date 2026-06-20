# Cap. — Gestion de tâches PWA

App de gestion de tâches **single-file HTML**, stockage GitHub chiffré, installable comme PWA sur iPhone.

---

## Architecture

| Couche | Détail |
|---|---|
| UI | HTML + CSS + JS vanilla — zéro dépendance |
| Stockage | GitHub API (dépôt privé `cap-data`) |
| Chiffrement | AES-256-GCM, clé PBKDF2 200k itérations |
| PWA | Service Worker + manifest — installable iOS/Android |
| Offline | Fallback IndexedDB si GitHub inaccessible |

---

## Fichiers du dépôt `cap-data`

```
pro.md            — tâches Pro (chiffré)
perso.md          — tâches Perso (chiffré)
archive-pro.md    — tâches Pro terminées > 30 j (chiffré)
archive-perso.md  — tâches Perso terminées > 30 j (chiffré)
salt.b64          — sel PBKDF2 (non chiffré)
```

---

## Fichiers de l'app (GitHub Pages)

```
index.html        — app complète (tout-en-un)
manifest.json     — PWA manifest
sw.js             — service worker (cache shell, réseau-first pour l'API)
icon-192.png      — icône PWA 192×192
icon-512.png      — icône PWA 512×512
```

---

## Format Markdown des tâches

### Syntaxe de base

```markdown
- [ ] Tâche ouverte 📅2026-06-25
- [/] Tâche en cours 📅2026-06-24
- [x] Tâche terminée ✅2026-06-20
- [~] Tâche en attente 📅2026-07-01
```

### Statuts

| Char | Statut | Comportement |
|---|---|---|
| `[ ]` | Ouvert | Bloc de sa date (retard / aujourd'hui / demain…) |
| `[/]` | En cours | Même bloc, point orange |
| `[x]` | Terminé | Bloc "Terminées", archivé après 30 j |
| `[~]` | **En attente** | Bloc dédié "En attente" — exclu des retards et du badge |

### Qualificateurs

```markdown
- [~] Attendre réponse SFR #nego @Mehdi __ 📅2026-07-01
       |                   |      |     |   └─ date
       |                   |      |     └─ priorité basse
       |                   |      └─ personne (@)
       |                   └─ tag (#)
       └─ statut standby
```

| Syntaxe | Effet |
|---|---|
| `#mot` | Catégorie / tag (filtre disponible) |
| `@nom` | Personne concernée (filtre disponible) |
| `!` | Priorité haute |
| `__` ou `↓` | Priorité basse |
| `📅AAAA-MM-JJ` | Date d'échéance |
| `r:semaine` / `🔁lundi` | Récurrence |
| ligne indentée | Note libre de la tâche |

### Parents (type subject)

```markdown
- [ ] = Mon projet parent 📅2026-06-01 🏁2026-08-31 ^mon-projet
- [ ] Sous-tâche rattachée 📅2026-06-25 ^mon-projet
```

---

## Espaces Pro / Perso

Deux espaces distincts, bascule instantanée. Au démarrage, les deux espaces sont chargés **en parallèle** depuis GitHub — la première bascule est immédiate.

Palette accent : bleu `#2F4ED8` (Pro) / vert `#1A8A57` (Perso).

---

## IndexedDB (`cap-app`, version 2)

| Clé | Contenu |
|---|---|
| `gh_token` | Jeton GitHub fine-grained |
| `gh_repo` | Nom du dépôt de données |
| `gh_pass` | Phrase secrète (auto-login) |
| `cap_last_pro` | Dernier texte vu — fallback offline |
| `cap_last_perso` | Dernier texte vu — fallback offline |

> iOS peut purger IndexedDB après une longue inactivité → ressaisie jeton + phrase.

---

## Points de vigilance

- **Phrase secrète perdue = données irrécupérables.** Utiliser le bouton **⬇ Export** régulièrement.
- Le jeton GitHub fine-grained expire après 1 an — GitHub prévient par mail.
- Le service worker est versionné (`CACHE = "cap-v2"`) — incrémenter à chaque mise en production.
- L'icône `icon-192/512.png` est un carré bleu générique — à remplacer par une vraie icône Cap.

---

## Évolutions prévues

- Vraie icône PWA générée avec Canvas
- Notifications push (tâches en retard) via Web Push API
- Vue déléguée (`@personne` = tâches en attente de quelqu'un d'autre)
- Export PDF / impression liste du jour
- Bascule Supabase si besoin temps réel ou multi-utilisateurs
