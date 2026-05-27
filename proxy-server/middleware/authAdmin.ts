import { TAuthRequestHandler } from '../types';
import { IERoles } from '../models/user.model';

import createError from './error';

const verifyAdmin: TAuthRequestHandler = async (req, res, next) => {
    // Vérifier si l'utilisateur est connecté
    if(!req.body.user) return next(createError(401, 'Authentification requise'))

    // Vérifier si l'utilisateur est admin
    if (![IERoles.admin, IERoles.superAdmin].includes(req.body.user.role)) {
        return next(createError(403, 'Access denied'))
    }

    next();
}

export default verifyAdmin;