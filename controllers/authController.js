const passport = require('passport');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/administracion',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son requeridos'
});

// Comprobarsi el usuario esta autenticado o no
exports.usuarioAutenticado = (req, res , next) => {
    // Si el usuario esta autenticado, adelante
    if(req.isAuthenticated() ) {
        return next();
    }

    // Si no esta autenticado
    return res.redirect('/iniciar-sesion');
}

// Cerrar sesión
exports.cerrarSesion = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err); // Si hay un error, pasa al siguiente middleware
        }
        req.flash('correcto', 'Cerraste sesión correctamente');
        res.redirect('/iniciar-sesion');
    });
};
