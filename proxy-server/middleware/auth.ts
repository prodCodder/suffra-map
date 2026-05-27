import { RequestHandler } from 'express';
import jwt, {VerifyCallback, VerifyErrors, JwtPayload} from 'jsonwebtoken';
import ENV from '../config/env';
import createError from './error';
import Users from '../models/user.model';

const verifyToken: RequestHandler = (req, res, next) => {
    // Récupère le jeton toekn JWT à partir des cookies de la requête
    const token = req.cookies.access_token; 

    // Vérifier si il existe un token
    if(!token) return next(createError(401, 'Access denied !'))
    
    // Vérifier la validité du token
    jwt.verify(token, ENV.JWT_TOKEN, <VerifyCallback>(async (error: VerifyErrors, decodedToken: JwtPayload) => {
        // Si une erreur se produit
        if (error || decodedToken?.id === undefined) {
            console.log(`[${new Date().toISOString()}]: Invalid token ! -> \n${JSON.stringify({error, decodedToken}, null, "\t")}`)
            return next(createError(403, 'Token non valide !'));
        }

        const user = await Users.findById(decodedToken.id);
        if(!user) return next(createError(404, 'User not found'));

        // Si token valide :
        req.body = {...(req.body ?? {}), user}
        next()
    }))
}

export default verifyToken