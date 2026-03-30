function mayorMenor(arr){

    let mayor = Math.max(...arr)
    let menor = Math.min(...arr)

    return { mayor, menor }
}

let obj3 = mayorMenor([3,1,5,4,2])
console.log(obj3)