# Projet Node.js --- Environnement reproductible

## 1. Présentation

Mettre en place un environnement de développement
professionnel, reproductible et facilement déployable pour une
application Node.js.



L'infrastructure repose sur **Docker Compose** et comprend :

-   une application Node.js ;
-   une base de données **PostgreSQL** ;
-   un système de cache **Redis** ;
-   le schéma initial de la table `tasks` ;
-   un système de configuration par variables d'environnement ;
-   des outils de qualité de code : linter et formatter ;
-   une documentation permettant de reproduire l'environnement.

------------------------------------------------------------------------

## 2. Technologies utilisées

  Technologie                     Utilisation
  ------------------------------- --------------------------------------------
  Node.js                         Environnement d'exécution de l'application
  npm                             Gestion des dépendances
  Git                             Gestion de versions
  GitHub                          Hébergement du dépôt distant
  Docker                          Conteneurisation
  Docker Compose                  Orchestration de PostgreSQL et Redis
  PostgreSQL                      Base de données relationnelle
  Redis                           Cache
  ESLint / outil de lint          Analyse de la qualité du code
  Prettier / outil de formatage   Formatage du code

> Les outils de lint et de formatage doivent correspondre à ceux
> réellement configurés dans `package.json`.

------------------------------------------------------------------------

## 3. Prérequis

Avant de commencer, installer :

-   Node.js ;
-   npm ;
-   Git ;
-   Docker Desktop.

Vérifier les installations :

``` bash
node --version
npm --version
git --version
docker --version
docker compose version
```

------------------------------------------------------------------------

## 4. Récupération du projet

Cloner le dépôt :

``` bash
git clone https://github.com/fathia09/taskflow-starter.git
```

Entrer dans le dossier :

``` bash
cd taskflow-starter
```

------------------------------------------------------------------------

## 5. Installation des dépendances

Installer les dépendances définies dans `package.json` :

``` bash
npm install
```

Cette commande utilise également `package-lock.json` afin de reproduire
les versions des dépendances utilisées par le projet.

Le dossier `node_modules/` est généré automatiquement et ne doit pas
être versionné.

------------------------------------------------------------------------

## 6. Configuration de l'environnement

La configuration de l'application est externalisée dans des variables
d'environnement.

### Créer le fichier `.env`

À la racine du projet, créer un fichier :

``` text
.env
```
------------------------------------------------------------------------

## 7. Organisation du projet

La structure générale du projet est la suivante :

``` text
.
├── src/
│   └── ...
├── .env
├── .env.example
├── .gitignore
├── docker-compose.yml
├── init.sql
├── package.json
├── package-lock.json
└── README.md
```

### Rôle des principaux fichiers

-   `src/` : code source de l'application ;
-   `package.json` : dépendances et scripts npm ;
-   `package-lock.json` : versions verrouillées des dépendances ;
-   `.env` : configuration locale ;
-   `.env.example` : modèle de configuration ;
-   `.gitignore` : fichiers exclus du dépôt Git ;
-   `docker-compose.yml` : définition de l'infrastructure Docker ;
-   `init.sql` : initialisation du schéma PostgreSQL ;
-   `README.md` : documentation du projet.

------------------------------------------------------------------------

## 8. Infrastructure avec Docker Compose

PostgreSQL et Redis sont exécutés avec Docker Compose.

Démarrer l'infrastructure :

``` bash
docker compose up -d
```

Vérifier l'état des services :

``` bash
docker compose ps
```

Les deux services attendus sont :

``` text
postgres
redis
```

------------------------------------------------------------------------

## 9. PostgreSQL

PostgreSQL est utilisé comme base de données relationnelle de
l'application.

Configuration utilisée par défaut :

``` text
Hôte : localhost
Port : 5432
Base : tasks
Utilisateur : postgres
```

Le mot de passe est défini dans la configuration Docker Compose et/ou
dans les variables d'environnement selon l'architecture du projet.

### Connexion à PostgreSQL

Pour accéder directement à la base :

``` bash
docker exec -it tasks-postgres psql -U postgres -d tasks
```

Lister les tables :

``` sql
\dt
```

Afficher la structure de la table `tasks` :

``` sql
\d tasks
```

Quitter PostgreSQL :

``` sql
\q
```

------------------------------------------------------------------------

## 10. Schéma initial de `tasks`

Le fichier `init.sql` permet d'initialiser la base de données lors de la
création du conteneur PostgreSQL.

Exemple de schéma initial :

``` sql
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

> Le schéma ci-dessus doit correspondre au modèle réellement utilisé par
> l'application. Si l'application fournie possède déjà une définition
> précise de `tasks`, celle-ci doit être conservée.

Le fichier est monté dans le conteneur PostgreSQL grâce à Docker Compose
:

``` yaml
volumes:
  - ./init.sql:/docker-entrypoint-initdb.d/init.sql
```

------------------------------------------------------------------------

## 11. Redis

Redis est utilisé comme système de cache.

Configuration par défaut :

``` text
Hôte : localhost
Port : 6379
```

Tester Redis :

``` bash
docker exec -it tasks-redis redis-cli
```

Puis :

``` text
PING
```

La réponse attendue est :

``` text
PONG
```

Quitter Redis :

``` text
exit
```

------------------------------------------------------------------------

## 12. Lancer l'application

Les scripts disponibles dans le projet peuvent être affichés avec :

``` bash
npm run
```

Selon la configuration du projet, l'application peut être lancée avec :

``` bash
npm start
```

ou :

``` bash
npm run dev
```

> Utiliser le script réellement défini dans `package.json`.

------------------------------------------------------------------------

## 13. Linter

Le linter permet de détecter automatiquement certaines erreurs et
mauvaises pratiques dans le code.

Afficher les scripts disponibles :

``` bash
npm run
```

Si le projet possède un script `lint` :

``` bash
npm run lint
```

Le linter doit être exécuté avant de valider les modifications
importantes du projet.

------------------------------------------------------------------------

## 14. Formatter

Le formatter permet de conserver une mise en forme homogène du code.

Si le projet possède un script `format` :

``` bash
npm run format
```

Selon la configuration du projet, un script de vérification peut
également être disponible :

``` bash
npm run format:check
```

------------------------------------------------------------------------

## 15. Tests

Si des tests sont configurés dans le projet, ils peuvent être exécutés
avec :

``` bash
npm test
```

Pour connaître les commandes réellement disponibles :

``` bash
npm run
```

------------------------------------------------------------------------

## 16. Arrêter l'infrastructure

Pour arrêter les conteneurs :

``` bash
docker compose down
```

Cette commande arrête et supprime les conteneurs, mais conserve les
données stockées dans les volumes nommés.

Pour supprimer également les volumes :

``` bash
docker compose down -v
```

> Attention : cette dernière commande peut supprimer les données
> PostgreSQL stockées dans le volume Docker.

------------------------------------------------------------------------

## 17. Vérifier les logs

Afficher les logs de tous les services :

``` bash
docker compose logs
```

Afficher uniquement les logs PostgreSQL :

``` bash
docker compose logs postgres
```

Afficher uniquement les logs Redis :

``` bash
docker compose logs redis
```

Suivre les logs en temps réel :

``` bash
docker compose logs -f
```

------------------------------------------------------------------------

## 18. Reproduire complètement l'environnement

Un nouveau développeur peut reproduire l'environnement avec les étapes
suivantes.

### 1. Cloner le projet

``` bash
git clone <URL_DU_REPOSITORY>
cd <NOM_DU_PROJET>
```

### 2. Installer les dépendances

``` bash
npm install
```

### 3. Créer la configuration locale

Copier `.env.example` vers `.env`.

Sous PowerShell :

``` powershell
Copy-Item .env.example .env
```

Sous Linux/macOS :

``` bash
cp .env.example .env
```

Puis adapter les valeurs si nécessaire.

### 4. Démarrer PostgreSQL et Redis

``` bash
docker compose up -d
```

### 5. Vérifier les services

``` bash
docker compose ps
```

### 6. Lancer l'application

Utiliser le script défini dans `package.json`, par exemple :

``` bash
npm run dev
```

L'environnement est alors prêt à être utilisé.

------------------------------------------------------------------------

## 19. Gestion de version

Le projet utilise Git pour suivre les modifications.

Vérifier l'état du dépôt :

``` bash
git status
```

Ajouter les modifications :

``` bash
git add .
```

Créer un commit :

``` bash
git commit -m "description de la modification"
```

Envoyer les modifications sur GitHub :

``` bash
git push
```

Exemples de messages de commit :

``` text
chore: initialize repository
chore: configure linting and formatting
chore: externalize configuration
chore: add postgres and redis infrastructure
feat: add tasks database schema
docs: add project documentation
```

------------------------------------------------------------------------

## 20. Sécurité et bonnes pratiques

Les informations sensibles ne doivent pas être stockées directement dans
le code source.

Le fichier `.env` est donc exclu du dépôt grâce au `.gitignore`.

À ne pas publier :

-   mots de passe ;
-   clés API ;
-   tokens ;
-   secrets ;
-   fichiers `.env` contenant des données sensibles.

Le fichier `.env.example` permet de documenter les variables nécessaires
sans exposer les valeurs confidentielles.

------------------------------------------------------------------------

## 21. Dépannage

### PostgreSQL ne démarre pas

Afficher les logs :

``` bash
docker compose logs postgres
```

Vérifier que le port `5432` n'est pas déjà utilisé.

### Redis ne démarre pas

Afficher les logs :

``` bash
docker compose logs redis
```

Vérifier que le port `6379` n'est pas déjà utilisé.

### Les conteneurs ne sont pas visibles

Exécuter :

``` bash
docker compose ps
```

Puis :

``` bash
docker compose up -d
```

### L'application ne se connecte pas à PostgreSQL

Vérifier les variables :

``` env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=tasks
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
```

Si Node.js tourne directement sur la machine, `localhost` est
généralement utilisé.

Si Node.js est lui-même dans Docker Compose, le nom du service Docker
doit généralement être utilisé :

``` env
POSTGRES_HOST=postgres
REDIS_HOST=redis
```

### L'application ne se connecte pas à Redis

Vérifier :

``` env
REDIS_HOST=localhost
REDIS_PORT=6379
```

et vérifier que Redis fonctionne :

``` bash
docker compose ps
```

------------------------------------------------------------------------

## 22. Objectif de reproductibilité

L'infrastructure du projet est décrite sous forme de fichiers
versionnés.

Les principaux éléments permettant de reproduire l'environnement sont :

``` text
package.json
package-lock.json
.env.example
docker-compose.yml
init.sql
README.md
```

Ainsi, l'installation de l'environnement ne dépend pas uniquement de la
configuration de la machine du développeur.

Le projet peut être récupéré et reconstruit à partir de sa configuration
versionnée.

------------------------------------------------------------------------

## 23. Checklist finale

Avant de considérer le TP comme terminé, vérifier les points suivants :

-   [ ] Le dépôt Git est initialisé.
-   [ ] Le dépôt GitHub existe.
-   [ ] `.gitignore` est configuré.
-   [ ] `node_modules/` n'est pas envoyé sur GitHub.
-   [ ] `.env` n'est pas envoyé sur GitHub.
-   [ ] `.env.example` est présent.
-   [ ] `package.json` et `package-lock.json` sont versionnés.
-   [ ] Le linter est configuré.
-   [ ] Le formatter est configuré.
-   [ ] La configuration est externalisée.
-   [ ] `docker-compose.yml` est présent.
-   [ ] PostgreSQL démarre correctement.
-   [ ] Redis démarre correctement.
-   [ ] La base `tasks` est créée.
-   [ ] La table `tasks` est créée.
-   [ ] Le schéma de `tasks` correspond à l'application.
-   [ ] Les services peuvent être arrêtés et redémarrés.
-   [ ] L'application Node.js peut communiquer avec PostgreSQL.
-   [ ] L'application Node.js peut communiquer avec Redis.
-   [ ] Le README permet à une autre personne de reproduire
    l'environnement.
-   [ ] Les modifications sont commit et poussées sur GitHub.

------------------------------------------------------------------------

## 24. Conclusion

Ce projet met en place un environnement de développement reproductible
pour une application Node.js.

L'utilisation de Git, des variables d'environnement, du linter, du
formatter et de Docker Compose permet de standardiser le développement.

PostgreSQL et Redis sont exécutés dans des conteneurs Docker, tandis que
`init.sql` permet d'initialiser le schéma de la base de données.

L'ensemble de la configuration nécessaire à la reproduction de
l'environnement est documenté et versionné dans le dépôt Git.
