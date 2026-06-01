
import createError from '../middleware/error.js';

// Model
import Users, { IERoles } from '../models/user.model.js';
import type { TAuthRequestHandler } from '../types.d.ts';

export const getAllUser: TAuthRequestHandler<{id: string}> = async(req, res, next) => {
    try {
        // Trouver si l'utilisateur existe 
        const user = await Users.findById(req.params.id);
        if(!user) return next(createError(404, 'User not found'))

        const result = await Users.find();
        if(result) res.status(200).json(result);
    } catch(error: any) {
        next(createError(500, error.message))
    }
}

export const activateUser: TAuthRequestHandler<{id: string}>= async (req, res, next) => {
    try {
        // Trouver si l'utilisateur existe 
        const user = await Users.findById(req.params.id);
        if(!user) return next(createError(404, 'User not found'))

        // Mettre à jour l'état activé de l'utilisateur
        await Users.findByIdAndUpdate(
            user.id, 
            {isActive: true}, 
            {new: true}
        );
        res.status(200).json("Compte de "+ user.username +" activé")
    } catch(error: any) {
        next(createError(500, error.message))
    }
}

export const suscriberUser: TAuthRequestHandler<{id: string}> = async (req, res, next) => {
    try {
        // Trouver si l'utilisateur existe 
        const user = await Users.findById(req.params.id);
        if(!user) return next(createError(404, 'User not found'))

        // Mettre à jour l'état activé de l'utilisateur
        await Users.findByIdAndUpdate(
            user.id, 
            {role: IERoles.subscriber}, 
            {isSuscriber: true, isActive: true}
        );
        res.status(200).json("Compte de "+ user.username +" activé")
    } catch(error: any) {
        next(createError(500, error.message))
    }
}

export const deleteUser: TAuthRequestHandler<{id: string}> = async (req, res, next) => {
    try {
        // Trouvez si l'utilisateur existe 
        const userReq = await Users.findById(req.params.id);
        if(!userReq) return next(createError(404, 'User not found'))
                
        // Supprimer l'utilisateur de la base de donnée
        const checkUser = await Users.findByIdAndDelete(req.params.id);
        if(checkUser) return res.status(200).json('User delete');

    } catch(error: any) {
        next(createError(500, error.message))        
    }
}