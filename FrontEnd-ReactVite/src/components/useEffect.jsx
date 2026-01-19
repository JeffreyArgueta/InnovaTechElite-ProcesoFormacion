import { useEffect } from "react";
import { useState } from "react";

function UseEffect() {


    //cuando se inicializa
    // useEffect(()=>{
    //     console.log("el hijo se ha inicializado")
    // })


    const [contador, setContador] = useState(0);
    //cuando se monta
    // useEffect(() => {
    //     console.log("el hijo se ha montado")
    // }, [])


    //cuando se actualiza
    // useEffect(() => {
    //     console.log("el hijo se ha actualizado")
    // }, [contador])


    //cuando se cuando se desmonta
    useEffect(() => {
        return ()=>{
            console.log("el componente se ha desmontado")
        }
    }, [])


    return (
        <>
            <div>
                <h2>Este es el hijo</h2>
                <h3>{contador}</h3>
                <button
                    onClick={() =>
                    setContador(contador + 1)}>+
                </button>
            </div>
        </>
    );
}

export default UseEffect;