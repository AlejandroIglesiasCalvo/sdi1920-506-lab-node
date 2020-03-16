//Modulos
let express = require('express');
let app = express();
// Variables
app.set('port', 8081);
app.get('/usuarios', function(req, res){
    console.log("Depurar aqui");
    res.sed('ver usurios');
});
app.get('/canciones', function(req, res){
    res.sed('ver usurios');
});
// lanzar el servidor
app.listen(app.get('port'), function() {
    console.log("Servidor activo");
})