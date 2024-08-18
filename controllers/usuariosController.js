const Usuarios = require('../models/Usuarios.js');
const  validator = require('express-validator');

exports.formCrearCuenta = (req, res) => {
    res.render('crear-cuenta', {
        nombrePagina: 'Crea tu cuenta'
    })
};

exports.crearNuevoUsuario = async (req, res) => {
    // Validaciones express-validator
    await validator.check('repetir').notEmpty().withMessage('El campo confirmar no puede ir vacío').run(req);
    await validator.check('repetir').equals(req.body.password).withMessage('El password no coincide').run(req);

    // Leer los errores de express-validator
    const erroresExpress = validator.validationResult(req);

    if (!erroresExpress.isEmpty()) {
        const errExpress = erroresExpress.array().map(err => err.msg);
        req.flash('error', errExpress);
        return res.redirect('/crear-cuenta');
    }

    try {
        // Extraer los datos
        const { email } = req.body;

        // Verificar que el usuario no esté duplicado
        const existeUsuario = await Usuarios.findOne({ where: { email } });
        if (existeUsuario) {
            req.flash('error', 'El usuario ya está registrado');
            return res.redirect('/crear-cuenta');
        }

        // Crear nuevo usuario
        await Usuarios.create(req.body);

        // Si no hay errores
        req.flash('exito', 'Registro con éxito, confirma el email que te hemos enviado');
        res.redirect('/iniciar-sesion');
    } catch (error) {
        // Errores de Sequelize
        const erroresSequelize = error.errors.map(err => err.message);
        req.flash('error', erroresSequelize);
        res.redirect('/crear-cuenta');
    }
};


exports.formIniciarSesion = async(req, res) => {
    res.render('iniciar-sesion', {
        nombrePagina: 'Iniciar sesion'
    })
}