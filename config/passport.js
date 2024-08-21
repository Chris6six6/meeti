const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuarios = require('../models/Usuarios.js');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
async(email, password, done) => {
    const usuario = await Usuarios.findOne({ where: {email, activo: 1} });
    if(!usuario) return done(null, false, {
        message: 'Usuario no registrado'
    });

    // El usuario existente, vamos a verificarlo
    const verificarPass = usuario.validarPassword(password);
    if(!verificarPass) return next(null, false, {
        message: 'Password incorrecto'
    });

    // Usuario existe y el passwors es correcto
    return done(null, usuario);
}));

passport.serializeUser(function(usuario, cb) {
    cb(null, usuario);
});

passport.deserializeUser(function(usuario, cb) {
    cb(null, usuario);
});

module.exports = passport;