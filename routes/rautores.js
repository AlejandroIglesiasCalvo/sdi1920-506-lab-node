module.exports = function (app, swig) {
    var roles = [{
        "rol": "cantante"
    }, {
        "rol": "bateria"
    }, {
        "rol": "guitarrista"
    }, {
        "rol": "bajista"
    }, {
        "rol": "teclista"
    }];
    var autores = [{
        "nombre": "pedro",
        "grupo": "AC/DC",
        "rol": "Bateria"
    }, {
        "nombre": "Alex",
        "grupo": "AC/DC",
        "rol": "Bajo"
    }, {
        "nombre": "Fran",
        "grupo": "AC/DC",
        "rol": "Cantante"
    }];
    app.get("/autores", function (req, res) {
        var respuesta = swig.renderFile('views/autores.html', {
            vendedor: 'Tienda de canciones',
            autores: autores
        });
        res.send(respuesta);
    });
    app.get('/autores/agregar', function (req, res) {
        let respuesta = swig.renderFile('views/autores-agregar.html', {
            vendedor: 'Tienda de canciones',
            roles: roles
        });
        res.send(respuesta);
    })
    app.get('/autores/filtrar/:id', function (req, res) {
        let respuestaAutores= autores.filter(a => a.rol == req.params.id);
        let respuesta = swig.renderFile('views/autores.html', {
            vendedor: 'Tienda de canciones',
            autores: respuestaAutores
        });
        res.send(respuesta);
    });
    app.post("/autores", function (req, res) {
        res.send("Autor agregado:" + req.body.nombre + "<br>"
            + " Grupo :" + req.body.grupo + "<br>"
            + " Rol: " + req.body.rol);
    });
};