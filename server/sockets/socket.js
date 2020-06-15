const { io } = require('../server');
const {Usuarios} = require("../classes/usuarios");
const usuarios = new Usuarios();
const {crearMensaje} = require("../utilidades/utilidades");

io.on('connection', (client) => {

    client.on("entrarChat",(data,callback) =>{
        if(!data.nombre || !data.sala){
            return callback({
                error: true,
                mensaje: "EL NOMBRE/SALA ES NECESARIO"
            });
        }
        client.join(data.sala);
        let personas = usuarios.agregarPersona(client.id, data.nombre,data.sala);
        client.broadcast.to(data.sala).emit("listaPersonas",usuarios.getPersonasPorSalas(data.sala));
        client.broadcast.to(data.sala).emit("crearMensaje",crearMensaje("administrador",`${data.nombre} se unio a la sala`));
        callback(personas);
    });

    client.on("crearMensaje",(data,callback)=>{
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit("crearMensaje", mensaje);
        callback(mensaje);
    });

    client.on("disconnect",()=>{
        let personaBorrada = usuarios.borrarPersona(client.id);
        client.broadcast.to(personaBorrada.sala).emit("crearMensaje",crearMensaje("administrador",`${personaBorrada.nombre} salio`));
        client.broadcast.to(personaBorrada.sala).emit("listaPersonas",usuarios.getPersonasPorSalas(personaBorrada.sala));
    })
    //mensajes oprivados
    client.on("mensajePrivado", data =>{

        let persona = usuarios.getPersona(client.id);
        client.broadcast.to(data.para).emit("mensajePrivado", crearMensaje(persona.nombre, data.mensaje));
    })
});