function separarNumeros(arr){

    let pares = []
    let impares = []

    for(let num of arr){
        if(num % 2 === 0){
            pares.push(num)
        }else{
            impares.push(num)
        }
    }

    return {pares, impares}
}

let obj2 = separarNumeros([1,2,3,4,5])
console.log(obj2)