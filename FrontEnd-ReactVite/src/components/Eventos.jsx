import React from 'react'

function Eventos() {

  const diAlgo = () => {
    console.log("hola que tal")
  }
  return (
    <div onClick={diAlgo}>Eventos</div>
  )
}

export default Eventos