module.exports = function(app, swig) {
    app.get("/autores", function(req, res) {
        var autores = [ {
            "nombre" : "pedro",
            "grupo" : "AC/DC",
            "rol" : "Bateria"
        }, {
            "nombre" : "Alex",
            "grupo" : "AC/DC",
            "rol" : "Bajo"
        }, {
            "nombre" : "Fran",
            "grupo" : "AC/DC",
            "rol" : "Cantante"
        } ];
        var respuesta = swig.renderFile('views/autores.html', {
            vendedor : 'Tienda de canciones',
            autores : autores
        });
        res.send(respuesta);
    });
    app.get('/autores/agregar', function (req, res) {
        let respuesta = swig.renderFile('views/autores-agregar.html', {

        });
        res.send(respuesta);
    })
    app.post("/autores", function(req, res) {
        res.send("Autor agregado:"+req.body.nombre +"<br>"
            +" Grupo :" +req.body.grupo +"<br>"
            +" Rol: "+req.body.rol);
    });
};