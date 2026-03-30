function obtenerSaludo() {
    return new Promise(resolve => {
        setTimeout(() => resolve("Hola Mundo"), 1000);
    });
}

function usarCallback(callback) {
    obtenerSaludo()
        .then(res => callback(res));
}

usarCallback(function(mensaje) {
    console.log(mensaje); 
});
