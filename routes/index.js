const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeControllers.js');
const usuariosController = require('../controllers/usuariosController.js');

module.exports = function() {
    
    router.get('/', homeController.home);
    
    // Crear cuenta
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', usuariosController.crearNuevoUsuario);

    // Iniciar sesion
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);

    return router;    
}