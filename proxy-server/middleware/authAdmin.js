const createError = require('./error');

const verifyAdmin = async (req, res, next) => {
    // Vérifier si l'utilisateur est connecté
    if(!req.user) return next(createError(401, 'Authentification requise'))

    // Vérifier si l'utilisateur est admin
    if (!["admin","superAdmin"].includes(req.user.role)) {
        return next(createError(403, 'Access denied'))
    }

    next();
}

module.exports = verifyAdmin