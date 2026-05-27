// importation du module express
import express from 'express';
// Création  d'un router express
const app = express.Router();

import {getAllDepartement, getMapByDepartement} from '../controller/map.controller';

app.get('/getbydepartement', getMapByDepartement)
app.get('/alldepartement', getAllDepartement)

export default app;