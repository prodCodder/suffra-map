// importation du module express
import express, {Response, NextFunction} from 'express';
import { TAuthRequestHandler } from '../types';
// Création  d'un router express
const app = express.Router();
import verifyToken from '../middleware/auth';
import contactLimiter from '../middleware/limit';
import { body, validationResult } from "express-validator";

import { postContact } from '../controller/contact.controller';

app.post(
    '/message/:id', 
    verifyToken, 
    contactLimiter, 
    [
        body("titre").trim().notEmpty().withMessage("Titre requis."),
        body("objet").trim().notEmpty().withMessage("Objet requis."),
        body("message").trim().isLength({ min: 10 }).withMessage("Message trop court."),
    ],
    <TAuthRequestHandler>((req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
        }
        next();
    }),
    postContact)

export default app;