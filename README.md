# grh-contrat-frontend

Frontend React pour le module M4 — **Gestion des Contrats** du système GRH.

## Stack technique

- **React 18** + **Vite 5**
- **Lucide-react** pour les icônes
- CSS pur (pas de framework UI)
- Appels REST vers le backend Spring Boot

---

## Pré-requis

- Node.js ≥ 18
- Backend `GestionPaie` lancé sur **http://localhost:3004**

---

## Installation

```bash
npm install
npm run dev
```

L'application sera disponible sur **http://localhost:5173**

---

## Endpoints backend utilisés

| Méthode | Endpoint                   | Description                          |
|---------|----------------------------|--------------------------------------|
| GET     | `/contrats`                | Lister tous les contrats             |
| POST    | `/contrats`                | Créer un contrat (statut : BROUILLON)|
| PUT     | `/contrats/{id}/activer`   | Activer un contrat (→ EN_COURS)      |

---

## Règles métier implémentées

| Règle       | Description                                             |
|-------------|----------------------------------------------------------|
| RG-M4-01    | L'activation clôture automatiquement l'ancien EN_COURS  |
| RG-M4-02    | La date de fin est obligatoire pour CDD et Stage         |
| RG-M4-04    | Seuls les contrats BROUILLON peuvent être activés        |

---

## Structure du projet

```
grh-contrat-frontend/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── api/
    │   └── contratApi.js       # Couche d'accès à l'API REST
    └── components/
        ├── ContratForm.jsx     # Modal de création de contrat
        ├── ConfirmModal.jsx    # Dialog de confirmation d'activation
        └── Toast.jsx           # Système de notifications
```

---

## Fonctionnalités

- 📋 **Liste des contrats** avec tableau complet
- 📊 **Statistiques** : total, brouillons, en cours, clôturés
- ➕ **Création** via un formulaire modal avec validation
- ✅ **Activation** avec dialog de confirmation (RG-M4-01)
- 🔍 **Recherche + filtres** par statut et type de contrat
- 🟢 **Indicateur de connexion** au backend
- 🔔 **Notifications toast** pour chaque action
