// importation du module express
import express from 'express';
// Création  d'un router express
const app = express.Router();
import verifyToken from '../middleware/auth';

import {
    getAllCandidats, 
    getAllNameElectionsConnected, 
    getAllNameElectionsMember, 
    getAllNameElectionsNoConnected, 
    getElectionByBv, 
    getResultElectionConnected, 
    getResultElectionMember, 
    getResultElectionNoConnected
} from '../controller/election.controller';

app.get('/candidats', getAllCandidats)
app.get('/allname/offline/', getAllNameElectionsNoConnected)
app.get('/allname/online/:id', verifyToken, getAllNameElectionsConnected)
app.get('/allname/member/:id', verifyToken, getAllNameElectionsMember)
app.get('/bureau/:slug/:bureauId', getElectionByBv)
app.get('/offline', getResultElectionNoConnected)
app.get('/online/:id', verifyToken, getResultElectionConnected)
app.get('/member/:slug/:id', verifyToken, getResultElectionMember)

export default app;