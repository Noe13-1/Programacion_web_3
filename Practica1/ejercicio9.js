function miPromesa(){

    return new Promise((resolve, reject) => {

        setTimeout(() => {
            resolve("Operación realizada con éxito")
        }, 3000)

    })

}

miPromesa()
.then(resultado => {
    console.log(resultado)
})
.catch(error => {
    console.log(error)
})