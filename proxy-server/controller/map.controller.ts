import { RequestHandler } from 'express';
import createError from '../middleware/error';
import fs from 'fs';

export const getMapByDepartement: RequestHandler = async (req, res, next) => {
    const { departement } = req.query;
      if (!departement)  return res.status(400).json({ error: 'Département requis' });
      
      const filepath = `./parse/geojson/departement_${departement}.geojson`;
      if (!fs.existsSync(filepath))  return res.status(404).json({ error: `Fichier ${departement} introuvable.` });
    
      try {
        const raw = fs.readFileSync(filepath, 'utf-8');
        const geojson = JSON.parse(raw);
        res.json(geojson);
    
      } catch (error: any) {
        next(createError(500, error.message))
      }
}

export const getAllDepartement: RequestHandler = async (req, res, next) => {
    const filepath = `./parse/json/all_departement.json`;
    if (!fs.existsSync(filepath))  return res.status(404).json({ error: `Fichier de tous les départements introuvable.` });
    
    try {
        const raw = fs.readFileSync(filepath, 'utf-8');
        const data = JSON.parse(raw); 
        res.json(data);
    } catch (error: any) {
        next(createError(500, error.message))
    }
}

