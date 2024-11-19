const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

//Permi de s'inscrire et de se connecter  
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;