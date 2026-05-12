# Changelog

## branch refacto/test_and_improve_user_middlewares
### Fix
 - Faille de sécurité :
   Le middleware authAdmin était appelé non pas via les fonctions de express mais directement dans le controller, sans arrêter l'execution de la fonction dans le cas où l'utilisateur connecté n'est pas admin, faisant continuer l'execution de la fonction même après le 403 retourné.
   -> Corrigé en appelant correctement le middleware
 - Amélioration globale des middlewares et de leur appel pour la partie user

## branch refacto/test-and-fix-essential-user-features - 2026-05-11
### Fix
 - Fix de failles de sécurité :
   register : 
     - Pas de mention explicite des champs quand on créer un user et possibilité de mettre isVerified à true pour contourner la vérification par mail
     - retourne le mot de passe hashé au client après création de l'utilisateur
   login :
     - Ne vérifie par le isVerified, donc encore possible de contourner la vérif par mail
     - Retourne des codes et messages différents selon la raison de l'échec de login, donnant des indices aux hacker qui essaye d'accéder à un compte
 - Fix de minLenght au lien de minLength dans schema, et regex manquante sur email
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