//ARRAYS
let arreglos = []; //arreglo vacio
let arreglos1 = [0, true, "hola"];

//ARRAYS - metodo forEach
arreglos1.forEach(n => console.log(n));

//ARRAYS - metodo map
let arreglos2 = [60, 80, 120];
let arregloNuevo = arreglos2.map(n => n * 2);
console.log(arregloNuevo);

//los arreglos son mutable con las constantes
//lo unico inmutable es la referencia no su contenido