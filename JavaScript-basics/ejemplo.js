//Ejemplo practico de funcion:
const escanearDui = (dui) => {
  if (isNaN(dui) || dui === '') { //isNaN es una herramienta de js q nos indica si lo que le pasamos es un numero
    //o un is not a number (isNaN)
    console.log('valores invalidos');
  } else if (dui.length === 8) { //lenght cuenta caracteres (comprueba q tenga 8 digitos exactos)
    console.log('su dui es perfectamente legible y valido');
  } else if (dui.length > 8) { //detalles en caso de que falten o sobren
    console.log('Excede los limites vuelva a intentarlo');
  } else {
    console.log('faltan valores vuelva a intentarlo');
  }
}

escanearDui("13456780");

function escanearDui(dui) {
  if (isNaN(dui) || dui === "") {
    console.log("valores inválidos");
  } else if (dui.length === 8) {
    console.log("su dui es perfectamente legible y válido");
  } else if (dui.length > 8) {
    console.log("Excede los límites, vuelva a intentarlo");
  } else {
    console.log("faltan valores, vuelva a intentarlo");
  }
}

escanearDui("13456780");
