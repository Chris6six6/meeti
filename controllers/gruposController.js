const Categorias = require('../models/Categorias.js');
const Grupos = require('../models/Grupos.js');

exports.formsNuevoGrupo = async(req, res) => {
    const categorias = await Categorias.findAll();

    res.render('nuevo-grupo', {
        nombrePagina: 'Crea un nuevo grupo',
        categorias
    })
}

// Almacena los grupos en la BD
exports.crearGrupo = async (req, res) => {

    const grupo = req.body;

    // Relaciona usuarioId
    grupo.usuarioId = req.user.id;  

    try {
        // almacenar en la bD
        await Grupos.create(grupo);
        req.flash('exito', 'Se ha creado el Grupo Correctamente');
        res.redirect('/administracion');
    } catch (error) {
        // extraer el message de los errores
        const erroresSequelize = error.errors.map(err => err.message);
        req.flash('error', erroresSequelize);
        res.redirect('/nuevo-grupo');
    }
}