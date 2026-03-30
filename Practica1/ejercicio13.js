//anidamiento de promesas
function verificarConexion() {
    return Promise.resolve("Conexión estable");
}

function descargarAjustes() {
    return Promise.resolve("Ajustes descargados");
}

verificarConexion().then(con => {
    console.log(con);
    
    descargarAjustes().then(ajustes => {
        console.log(ajustes);

    });
});

//con async/await
async function configurarApp() {

    const con = await verificarConexion();
    console.log(con);

    const ajustes = await descargarAjustes();
    console.log(ajustes);

}

configurarApp();


