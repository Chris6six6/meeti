const Sequelize = require('sequelize');
const db = require('../config/db.js');
const bcrypt = require('bcrypt-nodejs');
const { toDefaultValue } = require('sequelize/lib/utils');
const { Hooks } = require('sequelize/lib/hooks');

const Usuarios = db.define('usuarios', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: Sequelize.STRING(60),
    imagen: Sequelize.STRING(60),
    email: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: {
            args: true,
            msg: 'El usuario ya está registrado'
        },
        validate: {
            isEmail: { msg: 'Agrega un email válido' },
        }
    },
    password: {
        type: Sequelize.STRING(60),
        validate: {
            notEmpty: {
                msg: 'El password no puede ir vacio'
            }
        }
    },
    activo: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    tokenPassword: Sequelize.STRING,
    expiraToken: Sequelize.DATE
}, {
    hooks: {
        beforeCreate(usuario) {
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10), null);
        }
    }
});

// Metodo para comparar los password
Usuarios.prototype.validarPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = Usuarios;