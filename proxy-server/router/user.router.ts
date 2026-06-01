// importation du module express
import express from 'express';
// Création  d'un router express
const app = express.Router();
import verifyToken from '../middleware/auth.js';
import verifyAdmin from '../middleware/authAdmin.js';

import {signUp, login, logout, verifyUser, getAllProfession, verifySignUp, getById, updateUser, desactivateUser} from '../controller/user.controller.js';
import {getAllUser, deleteUser, activateUser, suscriberUser} from '../controller/userAdmin.controller.js';

// User controller
app.post('/signup', signUp)
app.post('/login', login)
app.post('/logout', logout)
app.get('/verify/', verifyUser)
app.get('/profession', getAllProfession)
app.get('/signup/verify/:token', verifySignUp)

app.use(verifyToken)

app.get('/getbyid/:id', getById)
app.patch('/update/:id', updateUser)
app.put('/desactivate/:id', desactivateUser)

app.use(verifyAdmin)

// Admin controller
app.get('/all/:id', getAllUser)
app.delete('/delete/:id', deleteUser)
app.put('/activate/:id', activateUser)
app.put('/suscriber/:id', suscriberUser)


export default app;