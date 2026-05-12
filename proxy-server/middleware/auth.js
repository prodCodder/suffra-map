const jwt = require('jsonwebtoken');
const ENV = require('../config/env');
const createError = require('./error');
const Users     = require('../models/user.model');

const verifyToken = (req, res, next) => {
    // Récupère le jeton toekn JWT à partir des cookies de la requête
    const token = req.cookies.access_token; 

    // Vérifier si il existe un token
    if(!token) return next(createError(401, 'Access denied !'))
    
    // Vérifier la validité du token
    jwt.verify(token, ENV.JWT_TOKEN, async (error, decodedToken) => {
        // Si une erreur se produit
        if (error) return next(createError(403, 'Token non valide !', error.message))

        const user = await Users.findById(decodedToken.id);
        if(!user) return next(createError(404, 'User not found'))

        // Si token valide :
        req.user = user
        next()
    })
}

module.exports = verifyToken