const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeControllers.js');
const usuariosController = require('../controllers/usuariosController.js');

module.exports = function() {
    
    router.get('/', homeController.home);
    
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);

    return router;    
}