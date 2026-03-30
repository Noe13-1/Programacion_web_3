//anidamiento de callbacks
function obtenerDatos(callback) {
    setTimeout(() => {
        callback("Datos listos");
    }, 1000);
}

// Uso con callback
obtenerDatos(res => {
    console.log(res);
});

//con anysnc/await
function obtenerDatosPromesa() {
    return new Promise(resolve => {
        obtenerDatos(resolve);
    });
}

// Usar async/await
async function procesar() {
    const res = await obtenerDatosPromesa();
    console.log(res);
}

procesar();

