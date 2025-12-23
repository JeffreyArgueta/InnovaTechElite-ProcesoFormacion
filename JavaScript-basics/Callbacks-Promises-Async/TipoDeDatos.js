let string1 = 'hola';
console.log(string1);

let string2 = "hola"; 
console.log(string2);

let string3 = `hola`; //interpolar
console.log(string3);

console.log(`yo soy ${string1} uno y yo soy ${string2} dos`); 
console.log(string1 + " " + string2);

//2 y 3. Number y BigInt
let nunmero = 13;
let numero2 = 12.3;
//let numero3 = 10000000000000000000000000000000000000000000000000000000000000000000; //impreciso
let numero3 = 10000000000000000000000000000000000000000000000000000000000000000000n; //preciso
console.log(numero3);

//4. boolean
let vf = true;
if(vf == true){ // == comparacion 
    console.log(true);
}else{
    console.log(false);
}

//5 y 6. null y undefined
let x;
console.log(x);

let nulo = null;
console.log(nulo);

//7. symbol
let variable = 5;
let variable1 = '5';

if(variable === variable1) { //Estrictamente igual ===
    console.log('si son iguales')
}else{
    console.log('no son iguales')
}


//AND:
let William = 21;
let Daniela = 19;
let milton = 19;

    
if(Daniela == milton && milton==William){
    console.log('todos tienen la misma edad');
}else{
    console.log('todos no tienen la misma edad');
}

//OR:
let William1 = 21;
let Daniela1 = 19;
let milton1 = 19;
    
if(Daniela1 == milton1 || milton1 ==William1){
    console.log('todos tienen la misma edad');
}else{
    console.log('todos no tienen la misma edad');
}

//NOT



