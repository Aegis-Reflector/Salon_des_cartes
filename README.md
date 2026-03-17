> Written with [StackEdit](https://stackedit.io/).

# Salon des cartes

## Description du projet

Salon des cartes est un site web de vente de cartes Pokémon destiné aux joueurs et aux collectionneurs. Le site propose un large inventaire de cartes authentiques, neuves ou usagées.

Les utilisateurs peuvent parcourir les cartes disponibles, consulter les produits et ajouter des articles à leur panier afin d’effectuer un achat.

Le site offre une navigation claire et des outils permettant aux clients de trouver facilement les cartes et les boîtes qu’ils recherchent.

_Certaines parties du projet ont été générées avec l’aide d’une intelligence artificielle._

---

# Installation du projet

**1. Cloner le projet**

git bash  
git clone https://github.com/Aegis-Reflector/Application-Web-Transactionelles-CartiFans123-Gr07.git

**2. Installer les packages nécessaires**

### Backend (serveur)

cd Application-Web-Transactionelles-CartiFans123-Gr07\Protoype\serveur

Exécutez les commandes suivantes dans le terminal:
npm install express mysql2 cors dotenv  
npm install --save-dev typescript tsx @types/node @types/express @types/cors

### Frontend (`Prototype`)

cd ../ # revenir au dossier frontend si nécessaire  
cd Application-Web-Transactionelles-CartiFans123-Gr07\Protoype\Protoype

Exécutez les commandes suivantes dans le terminal :
npm install react react-dom react-router-dom
npm install --save-dev typescript @types/react @types/react-dom @types/node vite @vitejs/plugin-react eslint @eslint/js eslint-plugin-react-hooks eslint-plugin-react-refresh globals

**3. Configurer la base de données**

    3.1.  Ouvrir **Docker** et démarrer le serveur **MySQL**.

    3.2.  Ouvrir le terminal du serveur MySQL

    3.3.  Exécuter les scripts suivants(Copier tout le texte et paste dans le terminal ) :

**Script de création des tables:**
Application-Web-Transactionelles-CartiFans123-Gr07/BD/Script_creation_table_version3.txt
**Script de insertion des tables:**
Application-Web-Transactionelles-CartiFans123-Gr07/BD/Script_insertion_version2.txt

Ces scripts permettent :

- de créer les tables nécessaires
- d’ajouter les données initiales

**4. Démarrer le serveur backend**

    4.1.  Ouvrir un terminal dans le dossier :

cd Application-Web-Transactionelles-CartiFans123-Gr07\Protoype\serveur

    4.2.  Exécuter la commande :

    **npm run dev**
    4.3.  Le serveur sera accessible à l’adresse : http://localhost:4000

**5. Démarrer le site web (frontend)**

    5.1.  Ouvrir un autre terminal dans le dossier :
cd  Application-Web-Transactionelles-CartiFans123-Gr07\Protoype\Protoype

    5.2.  Exécuter la commande :
    **npm run dev**

    5.3.  Le site sera accessible à l’adresse : http://localhost:5173/Accueil



**Pour accéder à la page admin **

1. Naviguer vers la page de connexion

2. Saisir les identifiants suivants:

- Courriel: admin@pokemon.com
- Mot de passe: admin123

3. Cliquer sur le bouton connexion



# Auteurs

– Équipe CartiFans
Allens-William Lapeine , Emmanuel Jean Rigaud Desmornes et Jordan Ly
Projet réalisé dans le cadre du cours Applications Web transactionnelles.
