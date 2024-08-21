exports.panelAdministracion = async (req, res) => {    
    res.render('administracion', {
        nombrePagina : 'Panel de Administracion'
    })
}