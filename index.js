const express = require('express');
const expressEjsLayouts = require('express-ejs-layouts');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport.js');
const router = require('./routes');

// Configuracion y modelos BD
const db = require('./config/db.js');
const { pass } = require('./config/email.js');
require('./models/Usuarios.js');
require('./models/Categorias.js');
require('./models/Grupos.js');
require('./models/Meeti.js');
require('./models/Comentarios.js');
db.sync().then(() => console.log('DB Conectada')).catch((error) => console.log(error))

// Variables de desarrollo
require('dotenv').config({path: 'variables.env'});

// Aplicacion principal
const app = express();

// Middleware para analizar cuerpos de solicitud en formato JSON
app.use(express.json());
// Middleware para analizar cuerpos de solicitud en formato 'application/x-www-form-urlencoded' - 'extended: true' permite estructuras de datos complejas
app.use(express.urlencoded({ extended: true }));

// Habilitar EJS como template engine
app.use(expressEjsLayouts);
app.set('view engine', 'ejs');

// Ubicacion vistas
app.set('views', path.join(__dirname, './views'));

// Archivos estaticos
app.use(express.static('public'));

// Habilitar cookie parser
app.use(cookieParser());

// Crea la sesion
app.use(session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false // Aquí la opción está correctamente escrita
}));

// Inicializar passport
app.use(passport.initialize());
app.use(passport.session());

// Agregar flash messages
app.use(flash());

//Middleware (log, flash messages, fecha actual)
app.use((req, res, next) => {
    res.locals.usuario = {...req.user} || null;
    res.locals.mensajes = req.flash();
    const fecha = new Date();
    res.locals.year = fecha.getFullYear();
    next();
})

// Routing
app.use('/', router());

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 5000;
app.listen(port, host, () => {
    console.log('El servidor esta funcionando en el puerto: ' + port);
})