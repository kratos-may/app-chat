var socket = io();

var params = new URLSearchParams(window.location.search);
if(!params.has("nombre")|| !params.has("sala")){
    alert("El nombre y sala son necesarios para poder accesar");
    window.location = "index.html"
}
var usuario = {
    nombre: params.get("nombre"),
    sala: params.get("sala")
};
socket.on('connect', function() {
    console.log('Conectado al servidor');
    socket.emit("entrarChat",usuario,function(resp){
        console.log("usuarios conectados", resp)
    });
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
/*socket.emit('enviarMensaje', {
    usuario: 'Fernando',
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
});*/

// Escuchar información
socket.on('crearMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);

});
//escuchar cuado un usuario entra y sale de un chat
socket.on('listaPersonas', function(personas) {
    console.log(personas);
});
// mensajes privados
socket.on("mensajePrivado", function(mensaje){
    console.log("mensaje privado", mensaje)
})