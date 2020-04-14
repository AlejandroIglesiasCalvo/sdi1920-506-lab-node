
    function agregarCancion( ) {
        $.ajax({
            url: URLbase + "/cancion",
            type: "POST",
            data: {
                nombre : $("#agregar-nombre").val(),
                genero : $("#agregar-genero").val(),
                precio : $("#agregar-precio").val()
            },
            dataType: 'json',
            headers: { "token": token },
            success: function(respuesta) {
                console.log(respuesta); // <-- Prueba
                $( "#contenedor-principal" ).load( "widget-canciones.html");

            },
            error : function (error){
                $( "#contenedor-principal" ).load("widget-login.html");
            }
        });
    }

    window.history.pushState("", "", "/cliente.html?w=canciones");
    var canciones;

    function cargarCanciones(){
        $.ajax({
            url: URLbase + "/cancion",
            type: "GET",
            data: { },
            dataType: 'json',
            headers: { "token": token },
            success: function(respuesta) {
                canciones = respuesta;
                actualizarTabla(canciones);
            },
            error : function (error){
                $( "#contenedor-principal" ).load("widget-login.html");
            }
        });
    }
    function actualizarTabla(cancionesMostrar){
        $( "#tablaCuerpo" ).empty(); // Vaciar la tabla
        for (i = 0; i < cancionesMostrar.length; i++) {
            $( "#tablaCuerpo" ).append(
                "<tr id="+cancionesMostrar[i]._id+">"+
                "<td>"+cancionesMostrar[i].nombre+"</td>" +
                "<td>"+cancionesMostrar[i].genero+"</td>" +
                "<td>"+cancionesMostrar[i].precio+"</td>" +
                "<td>"+
                "<a onclick=detalles('"+cancionesMostrar[i]._id+"')>Detalles</a><br>"+
                "<a onclick=eliminar('"+cancionesMostrar[i]._id+"')>Eliminar</a>"+
                "</td>"+
                "</tr>" );
            // Mucho cuidado con las comillas del eliminarCancion
            //la id tiene que ir entre comillas ' '
        }
    }
    cargarCanciones();
    function eliminar( _id ) {
        $.ajax({
            url: URLbase + "/cancion/"+_id,
            type: "DELETE",
            data: { },
            dataType: 'json',
            headers: { "token": token },
            success: function(respuesta) {
                console.log("Eliminada: "+_id);
                $( "#"+_id ).remove(); // eliminar el <tr> de la canción
            },
            error : function (error){
                $( "#contenedor-principal" ).load("widget-login.html");
            }
        });
    }
    function widgetAgregar() {
        $( "#contenedor-principal" ).load( "widget-agregar.html");
    }
    $('#filtro-nombre').on('input',function(e){
        var cancionesFiltradas = [];
        var nombreFiltro = $("#filtro-nombre").val();

        for (i = 0; i < canciones.length; i++) {
            if (canciones[i].nombre.indexOf(nombreFiltro) != -1 ){
                cancionesFiltradas.push(canciones[i]);
            }
        }
        actualizarTabla(cancionesFiltradas);
    });
    var precioDsc = true;

    function ordenarPorPrecio(){
        if (precioDsc){
            canciones.sort(function(a, b) {
                return parseFloat(a.precio) - parseFloat(b.precio);
            });
        } else {
            canciones.sort(function(a, b) {
                return parseFloat(b.precio) - parseFloat(a.precio);
            });
        }
        actualizarTabla(canciones);
        precioDsc = !precioDsc; //invertir
        actualizarTabla(canciones);
    }
    var abajo=false;
    function ordenarPorNombre(){
        if(abajo){
            canciones.sort(function(a, b) {
                if(a.nombre > b.nombre ) return 1;
                if(a.nombre < b.nombre ) return -1;
                return 0;
            });
        }else{
            canciones.sort(function(a, b) {
                if(a.nombre < b.nombre ) return 1;
                if(a.nombre > b.nombre ) return -1;
                return 0;
            });
        }

        actualizarTabla(canciones);
        abajo = !abajo; //invertir
        actualizarTabla(canciones);
    }
    var ascendente=false;
    function ordenarPorGenero(){
        if(ascendente){
            canciones.sort(function(a, b) {
                if(a.genero > b.genero ) return 1;
                if(a.genero < b.genero ) return -1;
                return 0;
            });
        }else{
            canciones.sort(function(a, b) {
                if(a.genero < b.genero ) return 1;
                if(a.genero > b.genero ) return -1;
                return 0;
            });
        }

        actualizarTabla(canciones);
        ascendente = !ascendente; //invertir
        actualizarTabla(canciones);
    }
    function liggin(){
    $.ajax({
        url : URLbase + "/cancion/" + idCancionSeleccionada ,
        type : "GET",
        data : {},
        dataType : 'json',
        headers : {
            "token" : token
        },
        success : function(cancion) {
            $("#detalles-nombre").val(cancion.nombre);
            $("#detalles-genero").val(cancion.genero);
            $("#detalles-precio").val(cancion.precio);
        },
        error : function(error) {
            $( "#contenedor-principal" ).load("widget-login.html");
        }
    });
    window.history.pushState("", "", "/cliente.html?w=login");
    }
    $("#boton-login").click(function(){
        $.ajax({
            url: URLbase + "/autenticar",
            type: "POST",
            data: {
                email : $("#email").val(),
                password : $("#password").val()
            },
            dataType: 'json',
            success: function(respuesta) {
                console.log(respuesta.token); // <- Prueba
                token = respuesta.token;
                Cookies.set('token', respuesta.token);
                $( "#contenedor-principal" ).load( "widget-canciones.html");
            },
            error : function (error){
                Cookies.remove('token');
                $("#widget-login" )
                    .prepend("<div class='alert alert-danger'>Usuario no encontrado</div>");
            }
        });
    });

