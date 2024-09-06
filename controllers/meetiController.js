const Grupos = require('../models/Grupos');
const Meeti = require('../models/Meeti');
const { body } = require('express-validator');

exports.formNuevoMeeti = async (req, res) => {
    const grupos = await Grupos.findAll({ where: { usuarioId: req.user.id } });

    res.render('nuevo-meeti', {
        nombrePagina : 'Crear nuevo meeti',
        grupos
    })
}

exports.crearMeeti = async (req, res) => {
    // Obtener los datos
    const meeti = req.body;

    // Asignar el usuario
    meeti.usuarioId = req.user.id;

    // almacena la ubicación con un point
    const point = { type : 'Point', coordinates : [ parseFloat(req.body.lat), parseFloat(req.body.lng) ] };
    meeti.ubicacion = point;

    // cupo opcional
    if(req.body.cupo === '') {
        meeti.cupo = 0;
    }

    // Almacenar en la BD
    try {
        await Meeti.create(meeti);
        req.flash('exito', 'Se ha creado en el meeti correctamente');
        res.redirect('/administracion');
    } catch (error) {
        // Extraer el message de los errores
        const erroresSequelize = error.errors.map(err => err.message);
        req.flash('error', erroresSequelize);
        res.redirect('/nuevo-meeti');
    }
}

// sanitiza los meeti
exports.sanitizarMeeti = [
    body('titulo').trim().escape(),
    body('invitado').trim().escape(),
    body('cupo').toInt(),
    body('fecha').trim().escape(),
    body('hora').trim().escape(),
    body('direccion').trim().escape(),
    body('ciudad').trim().escape(),
    body('estado').trim().escape(),
    body('pais').trim().escape(),
    body('lat').toFloat(),
    body('lng').toFloat(),

    
    (req, res, next) => {
        // Puedes manejar errores de validación si es necesario
        next();
    }
];