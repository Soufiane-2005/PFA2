# Plateforme d'Apprentissage Adaptatif - PFA

## 📋 Description du projet

Cette plateforme d'apprentissage adaptatif offre une expérience éducative personnalisée grâce à des technologies d'intelligence artificielle. Le système comprend une interface frontend moderne et une API backend robuste, complétée par des agents IA spécialisés pour le profilage des apprenants et la génération de quiz.

**Architecture** : Frontend • Backend API • Base de données MySQL • Agents IA (repository séparé)

---

## ⚙️ Prérequis techniques

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (version 16 ou supérieure) - [Télécharger ici](https://nodejs.org/)
- **MySQL Server** - [Télécharger ici](https://dev.mysql.com/downloads/mysql/)
- **MySQL Workbench** (recommandé) - [Télécharger ici](https://dev.mysql.com/downloads/workbench/)
- **Compte Google Cloud** (pour l'API Gemini et Google Drive)

---

## 🚀 Installation et configuration

### 1. Configuration de l'environnement

Créez un fichier `.env` dans le dossier `backend/` :

```env
# Base de données MySQL
host=votre_host_mysql
dbName=learning_adaptatif
port=3306
user=votre_utilisateur_mysql
password=votre_mot_de_passe_mysql

# Sécurité
secret_key=votre_cle_secrete_jwt

# API Google
api_key=votre_cle_api_gemini
FOLDER_ID=id_de_votre_dossier_google_drive
```

### 2. Configuration Google Cloud

1. Placez le fichier `apiKey.json` (obtenu depuis Google Cloud Console) dans le dossier `backend/`
2. Activez les API Gemini et Google Drive dans votre projet Google Cloud

### 3. Installation des dépendances

**Backend :**
```bash
cd backend
npm install
```

**Frontend :**
```bash
cd frontend
npm install
```

---

## 🗃️ Configuration de la base de données

### Importation de la base de données

1. **Préparation** :
   - Démarrez votre serveur MySQL
   - Ouvrez MySQL Workbench

2. **Création de la base** :
   ```sql
   CREATE DATABASE learning_adaptatif;
   ```

3. **Importation des données** :
   - Dans MySQL Workbench : `Server` → `Data Import`
   - Sélectionnez : `Import from Self-Contained File`
   - Choisissez le fichier `database/learning_adaptatif_structure.sql`
   - Base de données cible : `learning_adaptatif`
   - Cliquez sur `Start Import`

4. **Vérification** :
   ```sql
   USE learning_adaptatif;
   SHOW TABLES;
   ```

---

## 🤖 Agents IA (Repository séparé)

Pour le fonctionnement complet des fonctionnalités IA :

```bash
# Clonez le repository des agents IA
git clone [lien-du-repository-AIagent]
cd AIagent

# Placez-le au même niveau que votre projet principal
# Structure recommandée :
# 📁 mon-projet/
#   ├── 📁 frontend/
#   ├── 📁 backend/
```

---

## 🎯 Démarrage de l'application

### 1. Démarrage du backend
```bash
cd backend
npx nodemon server.js
# ou
npm start
```

### 2. Démarrage du frontend
```bash
cd frontend
npm start
# ou
npm run dev
```

### 3. Accès à la plateforme
Ouvrez votre navigateur et rendez-vous sur : **http://localhost:3000**

---

## 🔧 Résolution des problèmes courants

### ❌ Problèmes de connexion à la base de données
- Vérifiez que MySQL Server est en cours d'exécution
- Confirmez les identifiants dans le fichier `.env`
- Assurez-vous que la base de données `learning_adaptatif` existe

### ❌ Fonctionnalités IA non disponibles
- Vérifiez la présence du fichier `apiKey.json` dans `backend/`
- Confirmez que le dossier `AIagent` est accessible
- Vérifiez que les agents IA sont démarrés

### ❌ Erreurs d'importation de la base de données
- Vérifiez que le fichier SQL n'est pas corrompu
- Assurez-vous d'avoir les droits nécessaires sur MySQL
- Vérifiez la compatibilité des versions MySQL

---

## 📁 Structure du projet

```
learning_adaptatif/
├── 📁 backend/          # API et logique métier
├── 📁 frontend/         # Interface utilisateur
├── 📁 database/         # Fichiers de base de données
```

---

## 🆘 Support

Si vous rencontrez des difficultés :

1. Consultez les logs dans la console pour identifier l'erreur
2. Vérifiez que tous les prérequis sont installés
3. Confirmez que tous les services nécessaires sont en cours d'exécution

---

**Note** : Certaines fonctionnalités avancées (profilage intelligent, génération de quiz adaptatifs) nécessitent que les agents IA soient opérationnels et correctement configurés.