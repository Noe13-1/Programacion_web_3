function autenticar() {
    return Promise.resolve("Usuario autenticado");
}

function obtenerPerfil() {
    return Promise.resolve("Perfil de usuario obtenido");
}
autenticar()
    .then(res => {
        console.log(res); 
        return obtenerPerfil();
    })
    .then(res => {
        console.log(res); 
    });
