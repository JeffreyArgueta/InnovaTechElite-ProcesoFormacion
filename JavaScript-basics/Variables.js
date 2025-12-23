/*VAR Y LET*/
function test() {
  var noviaLet = 1;
  if (true) {
    let noviaLet = 2; //cuando nosotros colocamos una variable con el mismo nombre re-declarar              //re asignando.
  }
  console.log(noviaLet);
}

test();

/*CONST*/
const variable = 19;
variable = 11; //Re-asignar
//const variable = 19 -> Re-declarar
console.log(variable);

/*VAR Y LET*/
function test() {
  var noviaLet = 1;
  if (true) {
    const noviaLet = 2; //cuando nosotros colocamos una variable con el mismo nombre re-declarar              //re asignando.
  }
  console.log(noviaLet);
}
