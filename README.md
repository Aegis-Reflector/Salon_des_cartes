# Salon des cartes

## Description du projet

**Salon des cartes** est un site web de vente de cartes Pokémon destiné aux joueurs et aux collectionneurs.

Le site permet aux utilisateurs de consulter un catalogue de cartes Pokémon, de rechercher des produits, d’afficher les détails d’une carte, d’ajouter des articles à leur panier et d’effectuer une commande.

Le projet contient aussi une section administrateur permettant la gestion des produits et certaines données du site.

> Certaines parties du projet ont été réalisées avec l’aide d’une intelligence artificielle.

---

## Fonctionnalités principales

- Consultation du catalogue de cartes Pokémon
- Recherche de cartes
- Affichage des détails d’un produit
- Inscription d’un utilisateur
- Connexion et déconnexion
- Gestion du panier
- Modification du profil utilisateur
- Gestion des paramètres utilisateur
- Gestion de la sécurité du compte
- Page d’aide et support
- Page administrateur

---

## Technologies utilisées

### Frontend

- React
- TypeScript
- Vite
- React Router
- Bootstrap
- React Bootstrap
- Bootstrap Icons
- TCGdex SDK

### Backend

- Node.js
- Express
- TypeScript
- MongoDB
- Docker
- bcrypt
- JSON Web Token
- cookie-parser
- dotenv
- CORS

---

## Installation du projet

### 1. Cloner le projet

Ouvrir un terminal Git Bash, puis exécuter :

```bash
git clone https://github.com/Aegis-Reflector/Application-Web-Transactionelles-CartiFans123-Gr07.git
```

Entrer ensuite dans le dossier du projet :

```bash
cd Application-Web-Transactionelles-CartiFans123-Gr07
```

---

## Installation du backend

### 2. Aller dans le dossier du serveur

```bash
cd Prototype/serveurMongo
```

### 3. Installer les dépendances du backend

```bash
npm install
```

Cette commande installe automatiquement les dépendances indiquées dans le fichier `package.json`.

Principales dépendances backend utilisées :

```txt
bcrypt
cookie-parser
cors
dotenv
express
jsonwebtoken
mongodb
```

Principales dépendances de développement backend :

```txt
typescript
tsx
@types/node
@types/express
@types/cors
@types/bcrypt
@types/jsonwebtoken
@types/cookie-parser
```

---

## Installation du frontend

### 4. Aller dans le dossier frontend

À partir de la racine du projet :

```bash
cd Prototype/Prototype
```

### 5. Installer les dépendances du frontend

```bash
npm install
```

Cette commande installe automatiquement les dépendances indiquées dans le fichier `package.json`.

Principales dépendances frontend utilisées :

```txt
react
react-dom
react-router
react-router-dom
react-bootstrap
bootstrap
bootstrap-icons
@tcgdex/sdk
```

Principales dépendances de développement frontend :

```txt
vite
typescript
@vitejs/plugin-react
eslint
@eslint/js
eslint-plugin-react-hooks
eslint-plugin-react-refresh
globals
typescript-eslint
@types/react
@types/react-dom
@types/node
```

---

## Configuration de la base de données

### 6. Démarrer MongoDB avec Docker

Ouvrir Docker et démarrer le conteneur MongoDB utilisé par le projet.

Si aucun conteneur MongoDB n’existe, il est possible d’en créer un avec la commande suivante :

```bash
docker run --name mongodb -p 27017:27017 -d mongo
```

### 7. Vérifier que MongoDB fonctionne

```bash
docker ps
```

Le conteneur MongoDB devrait apparaître dans la liste des conteneurs actifs.

---

## Démarrage du projet

### 8. Démarrer le serveur backend

Dans un terminal, aller dans le dossier du backend :

```bash
cd Prototype/serveurMongo
```

Puis exécuter :

```bash
npm run dev
```

Le serveur backend sera accessible à l’adresse suivante :

```txt
http://localhost:4000
```

---

### 9. Démarrer le frontend

Dans un autre terminal, aller dans le dossier frontend :

```bash
cd Prototype/Prototype
```

Puis exécuter :

```bash
npm run dev
```

Le site web sera accessible à l’adresse suivante :

```txt
http://localhost:5173
```

---

## Création d’un compte utilisateur

Pour utiliser les fonctionnalités liées au profil, au panier et aux paramètres, il faut créer un compte utilisateur.

### Étapes d’inscription

1. Ouvrir le site web à l’adresse suivante :

```txt
http://localhost:5173

2. Aller à la page d’inscription.
3. Remplir les champs obligatoires :

Nom d’utilisateur
Numéro de téléphone
Courriel
Mot de passe
Confirmation du mot de passe

__
## Accès administrateur

Pour accéder à la page administrateur :

1. Aller à la page de connexion.
2. Creer un compte avec le courriel suivant :

```txt
Courriel : admin1@pokemon.com


3. Cliquer sur le bouton **Connexion**.

L’utilisateur administrateur sera redirigé vers la page administrateur.

---

## Structure générale du projet

```txt
Application-Web-Transactionelles-CartiFans123-Gr07
│
├── Prototype
│   │
│   ├── serveurMongo
│   │   ├── node_modules
│   │   ├── src
│   │   │   ├── Controller
│   │   │   │   ├── commandesController.ts
│   │   │   │   ├── produitController.ts
│   │   │   │   └── utilisateurController.ts
│   │   │   │
│   │   │   ├── db
│   │   │   ├── interfaces
│   │   │   ├── middleware
│   │   │   ├── models
│   │   │   ├── routes
│   │   │   │   ├── panierRoute.ts
│   │   │   │   ├── testRoute.ts
│   │   │   │   └── userRoutes.ts
│   │   │   │
│   │   │   ├── types
│   │   │   │   └── express.d.ts
│   │   │   │
│   │   │   └── server.ts
│   │   │
│   │   ├── .env
│   │   ├── .gitignore
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── README.md
│   │   └── tsconfig.json
│   │
│   └── Prototype
│       ├── .vite
│       ├── node_modules
│       ├── public
│       ├── src
│       │   ├── assets
│       │   ├── components
│       │   ├── gif
│       │   ├── images
│       │   ├── Pages
│       │   ├── utils
│       │   ├── App.css
│       │   ├── index.css
│       │   └── main.tsx
│       │
│       ├── .gitignore
│       ├── api.ts
│       ├── eslint.config.js
│       ├── index.html
│       ├── package-lock.json
│       ├── package.json
│       ├── README.md
│       ├── tsconfig.app.json
│       ├── tsconfig.json
│       ├── tsconfig.node.json
│       └── vite.config.ts
│
├── package-lock.json
├── package.json
└── .gitignore
```

---

## Routes principales

### Authentification

```txt
POST /auth/signUp
POST /auth/signIn
POST /auth/logout
```

### Utilisateur

```txt
GET /test/me
PATCH /test/updateProfil
PATCH /test/changePassword
PATCH /test/updateSecurite
PATCH /test/updateSettings
```

### Panier

```txt
GET /test/getPanier
DELETE /test/deletePanier
```

---

## Notes importantes

- Le backend doit être démarré avant d’utiliser les fonctionnalités nécessitant une connexion.
- MongoDB doit être actif dans Docker.
- Les cookies sont utilisés pour maintenir la session utilisateur.
- Les mots de passe sont hachés avec bcrypt avant d’être enregistrés dans la base de données.
- Certaines routes sont protégées avec un système d’authentification JWT.
- Le frontend fonctionne avec Vite sur le port `5173`.
- Le backend fonctionne sur le port `4000`.

---

## Problèmes fréquents

### Le frontend ne se connecte pas au backend

Vérifier que le serveur backend est bien démarré :

```txt
http://localhost:4000
```

### Les données utilisateur ne se chargent pas

Vérifier que :

- le backend est démarré;
- MongoDB est actif dans Docker;
- l’utilisateur est connecté;
- les cookies sont acceptés par le navigateur.

### Le panier ne se vide pas

Vérifier que la route suivante existe dans le backend :

```txt
DELETE /test/deletePanier
```

### Les changements du profil ne sont pas sauvegardés

Vérifier que la route suivante existe dans le backend :

```txt
PATCH /test/updateProfil
```

---

## Auteurs

Projet réalisé par l’équipe **CartiFans123** :

- Emmanuel Jean Rigaud Desmornes
- Jordan Ly

Projet réalisé dans le cadre du cours **Applications Web transactionnelles**.
