const path = require("path")

module.exports = {
    entry: {
        mapa: './public/js/app.js',  
        asistencia: './public/js/asistencia.js'
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, "./public/dist")
    }
}