module.exports = function(app, swig,gestorBD) {
    app.post('/comentarios/:cancion_id', function(req, res) {
            if ( req.session.usuario == null){
                res.redirect("/tienda");
                return;
            }
            let comentario = {
                texto : req.body.texto,
                cancion_id :gestorBD.mongo.ObjectID(req.params.cancion_id),
                autor: req.session.usuario
            }
            // Conectarse
            gestorBD.insertarComentario(comentario, function(id){
                if (comentario.cancion_id == null) {
                    res.send("Error al insertar comentario");
                } else {
                    if (comentario.texto == null) {
                        res.send("Error, no hay texto");
                    } else {
                        res.send("Agregado id: " + id);
                    }
                }
             });
     });
};