function obtenerSaludo() {
    return Promise.resolve("Hola Mundo");
}
//con promesas

obtenerSaludo().then(res => {
    console.log("Usando promesas:");
    console.log(res);
});
//con async/await

async function mostrar() {
    const res = await obtenerSaludo();
    console.log("Usando async/await:");
    console.log(res);
}

mostrar();
