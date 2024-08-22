const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeControllers.js');
const usuariosController = require('../controllers/usuariosController.js');
const authController = require('../controllers/authController.js');
const adminController = require('../controllers/adminController.js');
const gruposController = require('../controllers/gruposController.js');

module.exports = function() {
    
    router.get('/', homeController.home);
    
    // Crear cuenta
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', usuariosController.crearNuevoUsuario);
    // Confirmar cuenta
    router.get('/confirmar-cuenta/:correo', usuariosController.confirmarCuenta);

    // Iniciar sesion
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);

    // Panel de administracion
    router.get('/administracion', 
        authController.usuarioAutenticado,
        adminController.panelAdministracion
    );

    // Nuevos grupos
    router.get('/nuevo-grupo',
        authController.usuarioAutenticado,
        gruposController.formsNuevoGrupo
    );
    router.post('/nuevo-grupo',
        authController.usuarioAutenticado,
        gruposController.crearGrupo
    );

    return router;    
}