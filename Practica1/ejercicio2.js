function invertirCadena(texto){
    return texto.split("").reverse().join("")
}

let cad = invertirCadena("abcd")
console.log(cad)