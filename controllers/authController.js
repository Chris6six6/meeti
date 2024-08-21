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