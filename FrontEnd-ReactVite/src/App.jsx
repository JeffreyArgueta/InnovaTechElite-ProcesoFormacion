import './App.css'
import { useState } from "react";
import UseState from './components/UseState'
import Map from './components/Map'
import Map2 from './components/Map2'
import Map3 from './components/Map3'
import Hijo from './components/Props'
import Hijo2 from './components/Props2'
import CompHermano from './components/CompHermano'
import UseEffect from './components/useEffect'
import FechApi from './components/FechApi'


function App() {
  // const [displayName, setDisplayName] = useState("");
  // const login = (name) => {
  //   setDisplayName(name);
  // }

  const [mostrarHijo, setMostrarHijo] = useState(true)

  return (
    <>
      <div>
        {/* <UseState></UseState> */}
        {/* <Map></Map> */}
        {/* <Map2></Map2> */}
        {/* <Map3></Map3>  */}
        {/* <Hijo mensaje={text} persona={persona}></Hijo> */}
        {/* <h2>hola: {displayName}</h2>
        <Hijo2 login={login} userName={displayName}> </Hijo2>
        <CompHermano userName={displayName}></CompHermano> */}
        {/* <button onClick={()=> setMostrarHijo(!mostrarHijo)}>mostrar hijo</button>
        {mostrarHijo && <UseEffect></UseEffect>} */}

        <FechApi></FechApi>
      </div>
    </>
  )
}

export default App
