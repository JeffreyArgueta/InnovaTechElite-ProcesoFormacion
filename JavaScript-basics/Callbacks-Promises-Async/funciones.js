//FUNCION - Tipica
function sumar(a, b){
    console.log(a+b);
}
sumar(1,2);

//FUNCION - flecha
let sum = (a, b) => { console.log(a+b) };
sum(2,3);

//Ejemplo funcion flecha - ternario if:
const mayorEdad = (edad) => 
    edad >= 18 ? 'es mayor de edad': 'no es mayor de edad';
console.log(mayorEdad(19));