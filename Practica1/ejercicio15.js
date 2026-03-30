function cargarConfig(callback) {
    setTimeout(() => {
        callback("Configuración cargada");
    }, 1500);
}

function cargarConfigPromesa() {
    return new Promise(resolve => {
        cargarConfig(resolve);
    });
}

cargarConfigPromesa().then(console.log);
