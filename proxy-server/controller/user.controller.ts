import { TAuthRequestHandler } from '../types';
import { RequestHandler } from 'express';
import ENV from '../config/env';
import bcrypt from 'bcrypt';
import jwt, {JwtPayload} from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
const dirname = path.dirname(__filename);
import createError from '../middleware/error';
import {Error} from 'mongoose';

// Model
import Users, { IUser } from '../models/user.model';

export const signUp: RequestHandler = async (req, res, next) => {
    try {
        // Créer un mdp crypté à partir du password de la request
        const passwordHashed = await bcrypt.hash(req.body.password, 10);

        // Créer un user à partir du body de la request
        const user = await Users.create({
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: passwordHashed,
            dateOfBirth: req.body.dateOfBirth,
            profession: req.body.metier,
            city: req.body.city
        });

        const token = jwt.sign({ id: user._id}, ENV.JWT_TOKEN, { expiresIn: "5m"})

        // Envoie d'un mail de confirmation
        console.log("Tentative d'envoi de mail à :", user.email)
        console.log({token})
        // await sendEmail(user, token)

        res.status(200).json({
            message: 'user created',
            user: {...user._doc, password: undefined}
        })
    } catch(error: any) {
        if (error instanceof Error.ValidationError) {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ error: messages.join(', ') });
        }
        next(createError(500, error.message))
    }
}

export const verifyUser: TAuthRequestHandler = async (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json({ error: "Non authentifié" });

    try {
        const decoded: any = jwt.verify(token, ENV.JWT_TOKEN);
        res.status(200).json({ message: "Utilisateur connecté", userId: decoded.id });
    } catch (error: any) {
        next(createError(500, error.message))
    }
}

export const verifySignUp: RequestHandler = async (req, res, next) => {
    const token: string = <string>req.params.token;
    if (!token) return res.status(401).json({ error: "Token absent" });

    try {
        const decoded: JwtPayload = <JwtPayload>jwt.verify(token, ENV.JWT_TOKEN);
        const user = await Users.findByIdAndUpdate(decoded?.id, { isVerified: true }, { new: true });

        if (!user) {
            return res.status(404).json({ error: "Utilisateur introuvable" });
        }

        res.status(200).json({ 
            message: "Inscription vérifiée avec succès",
            userId: user._id,
            firstname: user.firstname
        });
    } catch (error: any) {
        next(createError(500, error.message))
    }
}

export const getById: TAuthRequestHandler<{id: string}> = async (req, res, next) => {
    try {
        // Vérifier si l'utilisateur existe
        const user = await Users.findById(req.params.id);
        if(!user) return next(createError(404, 'User not found'))
            
        // Vérifier si l'utilisateur est authentifié
        if( user._id.toString() !== req.body.user.id.toString()) return next(createError(403, 'Accès refusé'))
        
        // Mettre à jour l'utilisateur avec le body de la request
        const response = await Users.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.status(200).json(response)
    } catch(error: any) {
        next(createError(500, error.message))
    }
}

export const login: RequestHandler = async (req, res, next) => {
    try {
        // Vérifier si le mail de l'utilisateur existe
        const user = await Users.findOne({email: req.body.email});
        if(!user) return next(createError(401, "Login failed, please check email or password"));

        // Vérifier si le mdp correspond bien au mdp existant
        const comparePassword = await bcrypt.compare(req.body.password, user.password);
        if(!comparePassword) return next(createError(401, "Login failed, please check email or password"))

        if (!user.isVerified) return next(createError(401, "Please confirm your signup"))
        
        // Authentification réussi : 
        // Générer un token 
        const token = jwt.sign(
            {   id: user._id    },
            ENV.JWT_TOKEN,
            {   expiresIn: "24h"    }
        )

        // Déstructuration de l'user 
        // pour tout récupérer sauf le mdp
        const { password, ...others } = user._doc
        
        // On renvoie la res JSON en deux étapes : 
        // 1 - Ajout du token dans les cookies
        // 2 - Statut 200 - on renvoie l'user sans mdp
        res.cookie('access_token', token, { 
                httpOnly: true,
                maxAge: 24*60*60*1000, // 24 Heures
                secure: false,
                sameSite: 'lax',})
            .status(200).json({others})

    } catch(error: any) {
        next(createError(500, error.message))
    }
}

export const logout: TAuthRequestHandler = (req, res) => {
    res.clearCookie("access_token", {
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
    }).status(200).json({ message: "Déconnexion réussie" });
}

export const updateUser: TAuthRequestHandler<{id: string}> = async (req, res, next) => {
    try {
        // Vérifier si l'utilisateur existe
        const user = await Users.findById(req.params.id);
        if(!user) return next(createError(404, 'User not found'))
            
        // Vérifier si l'utilisateur est authentifié
        if( user._id.toString() !== req.body.user.id.toString()) return next(createError(403, 'Accès refusé'))
        
        // Mettre à jour l'utilisateur avec le body de la request
        const response = await Users.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.status(200).json(response)
    } catch(error: any) {
        next(createError(500, error.message))
    }
}

export const desactivateUser: TAuthRequestHandler<{id: string}> = async (req, res, next) => {
    try {
        // Trouver l'utilisateur connecté
        const userToken = await Users.findById(req.body.user.id);
        if(!userToken) return next(createError(404, 'User not found'))
            
        // Trouver si l'utilisateur existe 
        const user = await Users.findById(req.params.id);
        if(!user) return next(createError(404, 'User not found'))
        
        // Vérifier si l'utilisateur est authentifié
        // Ou si l'utilisateur est admin
        if( userToken._id.toString() !== user.id.toString() &&
            userToken.role === 'user') {
                return next(createError(403, 'Access denied'))
        }

        // Mettre à jour l'état activé de l'utilisateur
        const userDesactivated = await Users.findByIdAndUpdate(
            user.id, 
            {isActive: false}, 
            {new: true}
        );
        res.status(200).json({message:"User desactivated", userDesactivated})
    } catch(error: any) {
        next(createError(500, error.message))
    }
}

// Route pour charger les nuances politiques des candidats
export const getAllProfession: TAuthRequestHandler = async (req, res, next) => {
    const filepath = path.resolve(dirname, '../JSON_files/all_professions.json');
      
    if (!fs.existsSync(filepath)) {
    return res.status(404).json({ 
            error: `Fichier all_metiers.json introuvable.` 
        });
    }

    try {
        const raw = fs.readFileSync(filepath, 'utf-8');
        let data = Object.entries(JSON.parse(raw));
        res.json(Object.fromEntries(data));
    } catch (error: any) {
        next(createError(500, error.message))
    }
}