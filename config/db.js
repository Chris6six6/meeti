const Sequelize = require('sequelize');
require('dotenv').config({ path: 'variables.env' });

module.exports = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false, // Opcional: Desactivar el logging en consola si no lo necesitas
    dialectOptions: {
        ssl: {
            require: true, // Si tu base de datos requiere SSL
            rejectUnauthorized: false // Asegúrate de que SSL no falle debido a un certificado autofirmado
        }
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});
