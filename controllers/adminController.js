const Grupos = require('../models/Grupos');
const Usuarios = require('../models/Usuarios');

exports.panelAdministracion = async (req, res) => {
    const grupos = await Grupos.findAll({ where: { usuarioId: req.user.id } });

    res.render('administracion', {
        nombrePagina : 'Panel de Administracion',
        grupos
    })
}