import React from 'react'
import { useState } from "react";

function UseState() {

  //let numero = 10;


  /* Creamos una variable de tipo useState 
  Este tipo de variable tiene dos argumentos
  el primero es el nombre de la variable y el segundo es, 
  por así decirlo es la funcion para modificar a esta variable
  que ahora es reactiva*/
  const [numero, setNumero] = useState(0);

  //ahora ¿Comó le hacemos para cambiar el valor de la variable?
  /*Cuando usamos useState (es decir, variables reactivas)
  tenemos una regla INQUEBRANTABLE. Y es que cada vez que 
  querramos modificar el valor de nuestra variable tenemos que usar
  la funcion para variar su valor (es decir, setNumber)*/
  const sumaUno = () => {
    //numero++;
    setNumero(numero + 1);
  }

  return (
    <>
      {/*El problema de no usar useState 
      es que si la variable cambia de valor, este 
      cambio no se vera reflejado en el navegador
      
      por lo tanto tenemos que darle "reactividad"*/}
      <div>
        <h1 onClick={sumaUno}>Numero: {numero}</h1>
      </div>
    </>
  )
}

export default UseState