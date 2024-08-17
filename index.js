const express = require('express');
const expressEjsLayouts = require('express-ejs-layouts');
const path = require('path');
const router = require('./routes');
require('dotenv').config({path: 'variables.env'});

const app = express();

// Habilitar EJS como template engine
app.use(expressEjsLayouts);
app.set('view engine', 'ejs');

// Ubicacion vistas
app.set('views', path.join(__dirname, './views'));

// Archivos estaticos
app.use(express.static('public'));

//Middleware (log, flash messages, fecha actual)
app.use((req, res, next) => {
    const fecha = new Date();
    res.locals.year = fecha.getFullYear();
    next();
})

// Routing
app.use('/', router());

const port = process.env.PORT || 3000;
app.listen(process.env.PORT, () => {
    console.log('El servidor esta funcionando en el puerto: ' + port);
})