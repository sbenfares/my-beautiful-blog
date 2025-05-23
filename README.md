# My Beautiful App - Exercice d'évaluation technique

Ce projet est une application de blog intentionnellement problématique.
Le but est d'identifier les éléments problématiques de l'application, de les lister dans des issues et de proposer des correctifs ou des axes d'améliorations les concernants.

## Prérequis

- Node.js
- PostgreSQL
- Yarn

## Instructions pour les candidats

1. **Forker le repository Github**
   - N'ouvrez pas d'issues dans le repo d'origine
   - N'ouvrez pas de PRs dans le repo d'origine

2. **Cloner le dépôt**
   ```bash
   git clone <url-du-repo>
   cd my-beautiful-app
   ```

3. **Analyser le code**
   - Prenez le temps d'examiner la structure du projet
   - Identifiez les différents composants et leur fonctionnement

4. **Corriger l'issue**
   - Il y a [une issue ouverte](https://github.com/gary-van-woerkens/my-beautiful-blog/issues/1) concernant un bug d'authentification
   - Proposez une ou plusieurs PRs afin que l'application fonctionne correctement

5. **Ouvrir des issues**
   - Recherchez les problèmes de conception, de sécurité et de performance
   - Créez des issues GitHub pour chaque problème identifié
   - Priorisez les problèmes graves (sécurité, performance critique)
   - Vous pouvez proposer des solutions ou des pistes d'amélioration

6. **Limitation de temps**
   - Ne passez pas plus d'une heure sur cet exercice
   - L'objectif est d'évaluer votre capacité à identifier rapidement les problèmes critiques

## Installation et configuration
### ENV
   - Ajouter ici un topo sur l'utilisation d'env.local / env.docker
    
1. Installer les dépendances
   ```bash
   yarn install
   ```

2. Démarrer la base de données PostgreSQL via Docker Compose
   ```bash
   docker compose up -d
   ```
   Cela lancera automatiquement un container PostgreSQL avec la configuration nécessaire (base "blog", utilisateur "postgres", mot de passe "postgres").

3. Lancer le serveur de développement
   ```bash
   yarn dev
   ```

4. Ouvrir [http://localhost:3000](http://localhost:3000) avec votre navigateur

## Structure du projet

L'application utilise l'architecture App Router de Next.js :

- `/src/app/` - Pages et composants frontend
- `/src/app/api/` - API Routes (backend)
- `/src/lib/` - Bibliothèques et utilitaires
- `/src/types/` - Définitions de types TypeScript

