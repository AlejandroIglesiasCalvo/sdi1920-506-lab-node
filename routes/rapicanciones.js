module.exports = function(app, gestorBD) {

    app.get("/api/cancion", function(req, res) {
        gestorBD.obtenerCanciones( {} , function(canciones) {
            if (canciones == null) {
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send( JSON.stringify(canciones) );
            }
        });
    });

    app.get('/cancion/:id', function (req, res) {
        var criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)};
        gestorBD.obtenerCanciones(criterio, function (canciones) {
            if (canciones == null) {
                res.send(respuesta);
            } else {
                var configuracion = {
                    url: "https://api.exchangeratesapi.io/latest?base=EUR",
                    method: "get",
                    headers: {
                        "token": "ejemplo",
                    }
                }
                var rest = app.get("rest");
                rest(configuracion, function (error, response, body) {
                    console.log("cod: " + response.statusCode + " Cuerpo :" + body);
                    var objetoRespuesta = JSON.parse(body);
                    var cambioUSD = objetoRespuesta.rates.USD;
                    // nuevo campo "usd"
                    canciones[0].usd = cambioUSD * canciones[0].precio;
                    var respuesta = swig.renderFile('views/bcancion.html',
                        {
                            cancion: canciones[0]
                        });
                    res.send(respuesta);
                })
            }
        })
    });
    app.delete("/api/cancion/:id", function(req, res) {
        var criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id)}
        let mostrar = false;
        gestorBD.obtenerCanciones(
            {"_id": gestorBD.mongo.ObjectID(req.params.id)}, function (canciones) {
                if (req.session.usuario && canciones[0].autor == req.session.usuario) {
                    gestorBD.eliminarCancion(criterio,function(canciones){
                        if ( canciones == null ){
                            res.status(500);
                            res.json({
                                error : "se ha producido un error"
                            })
                        } else {
                            res.status(200);
                            res.send( JSON.stringify(canciones) );
                        }
                    });
                }else{
                    res.send("Usuario no valido");
                }
            })

    });
    app.post("/api/cancion", function(req, res) {
        var cancion = {
            nombre : req.body.nombre,
            genero : req.body.genero,
            precio : req.body.precio,
        }
        if(req.body.nombre==null||req.body.nombre.length<5 ||req.body.nombre>25 ){
            res.send("Nombre no valido");
        }else{
            if(req.body.genero==null||req.body.nombre.genero<5 ||req.body.genero>25){
                res.send("Genero no valido");
            }else{
                if(req.body.precio<=0){
                    res.send("Precio no valido");
                }else{
                    gestorBD.insertarCancion(cancion, function(id){
                        if (id == null) {
                            res.status(500);
                            res.json({
                                error : "se ha producido un error"
                            })
                        } else {
                            res.status(201);
                            res.json({
                                mensaje : "canción insertarda",
                                _id : id
                            })
                        }
                    });
                }
            }
        }
    });
    app.put("/api/cancion/:id", function(req, res) {

        var criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id) };
        let mostrar = false;
        var cancion = {}; // Solo los atributos a modificar
        if ( req.body.nombre != null)
            cancion.nombre = req.body.nombre;
        if ( req.body.genero != null)
            cancion.genero = req.body.genero;
        if ( req.body.precio != null)
            cancion.precio = req.body.precio;
        gestorBD.obtenerCanciones(
            {"_id": gestorBD.mongo.ObjectID(req.params.id)}, function (canciones) {
                if (req.session.usuario && canciones[0].autor == req.session.usuario) {
                    gestorBD.modificarCancion(criterio, cancion, function(result) {
                        if (result == null || mostrar==false) {
                            res.status(500);
                            res.json({
                                error : "se ha producido un error"
                            })
                        } else {
                            res.status(200);
                            res.json({
                                mensaje : "canción modificada",
                                _id : req.params.id
                            })
                        }
                    });
                }else{
                    res.send("Usuario no valido");
                }
            })

    });

    app.post("/api/autenticar/", function(req, res) {
        var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        var criterio = {
            email : req.body.email,
            password : seguro
        }

        gestorBD.obtenerUsuarios(criterio, function(usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                res.status(401); // Unauthorized
                res.json({
                    autenticado : false
                })
            } else {
                var token = app.get('jwt').sign(
                    {usuario: criterio.email , tiempo: Date.now()/1000},
                    "secreto");
                res.status(200);
                res.json({
                    autenticado : true,
                    token : token
                })
            }

        });
    });
}