const Meeti = require('../../models/Meeti');
const Grupos = require('../../models/Grupos');
const Usuarios = require('../../models/Usuarios');
const Categorias = require('../../models/Categorias');
const Comentarios = require('../../models/Comentarios');
const moment = require('moment');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.mostrarMeeti = async (req, res) => {
    const meeti = await Meeti.findOne({
        where: {
            slug: req.params.slug
        },
        include: [
            {
                model: Usuarios,  // Incluir el usuario que creó el Meeti
                attributes: ['id', 'nombre', 'imagen']
            },
            {
                model: Grupos  // Incluir el grupo asociado
            }
        ]
    });

    // Si no existe
    if (!meeti) {
        return res.redirect('/');
    }

    // Consultar meetis cercanos (esto lo tienes comentado, descoméntalo si es necesario)
    //const ubicacion = Sequelize.literal(`ST_GeomFromText( 'POINT( ${meeti.ubicacion.coordinates[0]} ${meeti.ubicacion.coordinates[1]} )' )`);
    //const distancia = Sequelize.fn('ST_Distance_Sphere', Sequelize.col('ubicacion'), ubicacion);
    const cercanos = await Meeti.findAll({
        //order: distancia,
        //where: Sequelize.where(distancia, { [Op.lte]: 1000 }),
        limit: 3,
        include: [
            {
                model: Grupos
            },
            {
                model: Usuarios,
                attributes: ['id', 'nombre', 'imagen']
            }
        ]
    });

    // Consultar los comentarios del meeti
    const comentarios = await Comentarios.findAll({
        where: { meetiId: meeti.id },
        include: [
            {
                model: Usuarios,
                attributes: ['id', 'nombre', 'imagen']
            }
        ]
    });

    // Pasar el resultado a la vista
    res.render('mostrar-meeti', {
        nombrePagina: meeti.titulo,
        meeti,
        comentarios,
        cercanos,
        moment
    });
};



// Confirma o cancela si el usuario asistirá al meeti
exports.confirmarAsistencia = async (req, res) => {

    console.log(req.body);

    const { accion } = req.body;

    if(accion === 'confirmar') {
        // agregar el usuario
        Meeti.update(
            {'interesados' :  Sequelize.fn('array_append', Sequelize.col('interesados'), req.user.id  ) },
            {'where' : { 'slug' : req.params.slug }}
        );
        // mensaje
         res.send('Has confirmado tu asistencia');
    } else {
        // cancelar la asistencia
        Meeti.update(
            {'interesados' :  Sequelize.fn('array_remove', Sequelize.col('interesados'), req.user.id  ) },
            {'where' : { 'slug' : req.params.slug }}
        );
        // mensaje
         res.send('Has Cancelado tu asistencia');
    }
}

// muestra el listado de asistentes
exports.mostrarAsistentes = async (req, res) => {
    const meeti = await Meeti.findOne({
                                    where: { slug : req.params.slug },
                                    attributes: ['interesados']
    });

    // extraer interesados
    const { interesados } = meeti;

    const asistentes = await Usuarios.findAll({
        attributes: ['nombre', 'imagen'],
        where : { id : interesados }
    });

    // crear la vista y pasar datos
    res.render('asistentes-meeti', {
        nombrePagina : 'Listado Asistentes Meeti',
        asistentes
    })
}


// Muestra los meetis agrupados por categoria

exports.mostrarCategoria = async (req, res, next) => {
    const categoria = await Categorias.findOne({ 
                                    attributes: ['id', 'nombre'],
                                    where: { slug : req.params.categoria}
    });
    const meetis = await Meeti.findAll({
                                    order: [
                                        ['fecha', 'ASC'], 
                                        ['hora', 'ASC']
                                    ],
                                    include: [
                                        {
                                            model: Grupos,
                                            where : { categoriaId : categoria.id}
                                        }, 
                                        {
                                            model : Usuarios
                                        }
                                    ]
    });

    res.render('categoria', {
        nombrePagina : `Categoria: ${categoria.nombre}`,
        meetis,
        moment
    })

    console.log(categoria.id);
}