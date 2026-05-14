// importation du module express
const express = require('express');
// Création  d'un router express
const router = express.Router();
const verifyToken = require('../middleware/auth')
const verifyAdmin = require('../middleware/authAdmin')

const UserController = require('../controller/user.controller')
const UserControllerAdmin = require('../controller/userAdmin.controller')

// User controller
router.post('/signup', UserController.signUp)
router.post('/login', UserController.login)
router.post('/logout', UserController.logout)
router.get('/verify/', UserController.verifyUser)
router.get('/profession', UserController.getAllProfession)
router.get('/signup/verify/:token', UserController.verifySignUp)

router.use(verifyToken)

router.get('/getbyid/:id', UserController.getById)
router.patch('/update/:id', UserController.updateUser)
router.put('/desactivate/:id', UserController.desactivateUser)

router.use(verifyAdmin)

// Admin controller
router.get('/all/:id', UserControllerAdmin.getAllUser)
router.delete('/delete/:id', UserControllerAdmin.deleteUser)
router.put('/activate/:id', UserControllerAdmin.activateUser)
router.put('/suscriber/:id', UserControllerAdmin.suscriberUser)


module.exports = router;    