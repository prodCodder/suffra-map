# Changelog

## feature/elections-and-map-management
### Fix
 - Add a visible json for all departements readable by API

## branch refacto/test_fix_and_improve_user_features_and_middlewares
### Fix
 - Failles de sécurité corrigées :
   Middleware :
     - authAdmin était appelé non pas via les fonctions de express mais directement dans le controller, sans arrêter l'execution de la fonction dans le cas où l'utilisateur connecté n'est pas admin, faisant continuer l'execution de la fonction même après le 403 retourné.
   register : 
     - Pas de mention explicite des champs quand on créer un user et possibilité de mettre isVerified à true pour contourner la vérification par mail, voir de se créer un compte avec le role qu'on veut.
     - retourne le mot de passe hashé au client après création de l'utilisateur (ex: admin...).
   login :
     - Ne vérifie par le isVerified, donc encore possible de contourner la vérif par mail.
     - Retourne des codes et messages différents selon la raison de l'échec de login, donnant des indices aux éventuels hackers qui essayent d'accéder à un compte.
 - Fix de minLenght au lieu de minLength dans le user schema, et regex manquante sur email.
 - Amélioration globale des middlewares et de leur appel pour la partie user.
 - Front : Fix de certaines erreurs dans l'inscriptions, connexion, affichage du profil une fois connecté
### Change
 - La route /api/users/profession se base sur un JSON accessible et présent dans le repo

## branch refacto/dockerize-and-fix - 2026-05-07
### Add
 - Dockerisation of project, to allow easily run it
 - Create following containers in docker-compose :
   - proxy-server : API server
   - client : ReactJS / vite application
   - mongodb : The mongodb database

### Change
 - .gitignore to :
   - remove package-lock.json, to memorize same version of packages until we manually change versions
   - add mongodb/data to not push mongodb databases
 - Improve mongodb connection to use authentication
 - Rename env variables to be more explicit, and add needed env variables for mongodb connection

### Fix
 - Upgrade axios package to improve security

### Tested successfuly
 - All container correctly launching with docker compose
 - Connection between proxy-server and mongodb
 - Connection between client and proxy-server