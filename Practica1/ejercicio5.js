function esPalindromo(cadena){

    let invertida = cadena.split("").reverse().join("")
    return cadena === invertida

}

let band = esPalindromo("oruro")
console.log(band) // true

let band2 = esPalindromo("hola")
console.log(band2) // false