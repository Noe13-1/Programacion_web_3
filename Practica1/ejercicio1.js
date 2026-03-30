function contarVocales(texto){

    let resultado = {a:0,e:0,i:0,o:0,u:0}

    texto = texto.toLowerCase()

    for(let letra of texto){
        if(resultado.hasOwnProperty(letra)){
            resultado[letra]++
        }
    }

    return resultado
}

let obj = contarVocales("euforia")
console.log(obj)