const Usuarios = require('../models/Usuarios.js');
const  validator = require('express-validator');
const enviarEmail = require('../handlers/email.js');
const { body, validationResult } = require('express-validator');

const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');

const configuracionMulter = {
    limits : { fileSize : 100000 },
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, next) => {
            next(null, __dirname+'/../public/uploads/perfiles/');
        },
        filename : (req, file, next) => {
            const extension = file.mimetype.split('/')[1];
            next(null, `${shortid.generate()}.${extension}`);
        }
    }), 
    fileFilter(req, file, next) {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            //el formato es valido
            next(null, true);
        } else {
            // el formato no es valido
            next(new Error('Formato no válido'), false);
        }
    }
}

const upload = multer(configuracionMulter).single('imagen');

// sube imagen en el servidor
exports.subirImagen = (req, res, next) => {
    upload(req, res, function(error) {
        if(error) {
            if(error instanceof multer.MulterError) {
                if(error.code === 'LIMIT_FILE_SIZE') {
                    req.flash('error', 'El Archivo es muy grande')
                } else {
                    req.flash('error', error.message);
                }
            } else if(error.hasOwnProperty('message')) {
                req.flash('error', error.message);
            }
            res.redirect('back');
            return;
        } else {
            next();
        }
    })
}

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
        const usuario = req.body;

        // Verificar que el usuario no esté duplicado
        const existeUsuario = await Usuarios.findOne({ where: { email: usuario.email } });
        if (existeUsuario) {
            req.flash('error', 'El usuario ya está registrado');
            return res.redirect('/crear-cuenta');
        }

        // Crear nuevo usuario
        await Usuarios.create(req.body);

        // URL de confirmacion
        const url = `http://${req.headers.host}/confirmar-cuenta/${usuario.email}`;

        // Enviar email de confirmacion
        await enviarEmail.enviarEmail({
            usuario,
            url,
            subject: 'Confirma tu cuenta de Meeti',
            archivo: 'confirmar-cuenta'
        })

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

exports.confirmarCuenta = async(req, res, next) => {
    // Verificar que el usuario existe
    const usuario = await Usuarios.findOne({ where: { email: req.params.correo } });

    if(!usuario) {
        req.flash('error', 'No existe el usuario');
        res.redirect('/crear-cuenta');
        return next();
    }

    // Si el usuario existe confirmar y redireccionar
    usuario.activo = 1;
    await usuario.save();

    req.flash('exito', 'La cuenta se ha confirmado, ya puedes iniciar sesion');
    res.redirect('/iniciar-sesion');
}

exports.formIniciarSesion = async(req, res) => {
    res.render('iniciar-sesion', {
        nombrePagina: 'Iniciar sesion'
    })
}

// Muestra el formulario para editar el perfil
exports.formEditarPerfil = async (req, res) => {
    const usuario = await Usuarios.findByPk(req.user.id);

    res.render('editar-perfil', {
        nombrePagina : 'Editar Perfil',
        usuario
    })
}

// almacena en la Base de datos los cambios al perfil
exports.editarPerfil = [
    // Validar y sanitizar los campos
    body('nombre').trim().escape(),
    body('email').isEmail().normalizeEmail(),
    body('descripcion').optional().trim().escape(),

    async (req, res) => {
        // Manejo de errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Si hay errores, los manejas de alguna manera, por ejemplo, mostrar un mensaje
            req.flash('error', 'Hubo errores en los datos ingresados');
            return res.redirect('/administracion');
        }

        // Encontrar el usuario por el ID
        const usuario = await Usuarios.findByPk(req.user.id);

        // Leer datos del form
        const { nombre, descripcion, email } = req.body;

        // Asignar los valores sanitizados
        usuario.nombre = nombre;
        usuario.descripcion = descripcion;
        usuario.email = email;

        // Guardar en la BD
        await usuario.save();
        req.flash('exito', 'Cambios Guardados Correctamente');
        res.redirect('/administracion');
    }
];

// Muestra el formulario para modificar el password
exports.formCambiarPassword = (req, res) => {
    res.render('cambiar-password', {
        nombrePagina : 'Cambiar Password'
    })
}

// Revisa si el password anterior es correcto y lo modifica por uno nuevo

exports.cambiarPassword = async (req, res, next) => {
    const usuario = await Usuarios.findByPk(req.user.id);

    // verificar que el password anterior sea correcto
    if(!usuario.validarPassword(req.body.anterior)) {
        req.flash('error', 'El password actual es incorrecto');
        res.redirect('/cambiar-password');
        return next();
    }

    // si  el password es correcto, hashear el nuevo
    const hash = usuario.hashPassword(req.body.nuevo);

    // asignar el password al usuario
    usuario.password = hash;

    // guardar en la base de datos
    await usuario.save();

    // redireccionar
    //req.logout();
    req.flash('exito', 'Password Modificado Correctamente');
    res.redirect('/iniciar-sesion');
}

// Muestra el formulario para subir una imagen de perfil
exports.formSubirImagenPerfil = async (req, res) => {
    const usuario = await Usuarios.findByPk(req.user.id);

    // mostrar la vista
    res.render('imagen-perfil', {
        nombrePagina : 'Subir Imagen perfil',
        usuario
    });
}

// Guarda la imagen nueva, elimina la anterior ( si aplica ) y guarda el registro en la BD
exports.guardarImagenPerfil = async (req, res) => {
    const usuario = await Usuarios.findByPk(req.user.id);

    // Si hay imagen anterior, eliminarla
    if(req.file && usuario.imagen) {
        const imagenAnteriorPath = __dirname + `/../public/uploads/perfiles/${usuario.imagen}`;

        // eliminar archivo con filesystem
        fs.unlink(imagenAnteriorPath, (error) => {
            if(error) {
                console.log(error);
            }
            return;
        })
    }

    // almacenar la nueva imagen
    if(req.file) {
        usuario.imagen = req.file.filename;
    }

    // almacenar en la base de datos y redireccionar
    await usuario.save();
    req.flash('exito', 'Cambios Almacenados Correctamente');
    res.redirect('/administracion');
}
