import { useState } from "react";
import { useEffect } from "react";

function FechApi() {
    const [usuarios, setUsuarios] = useState([]);

    const getUsuarios = async () => {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        const data = await response.json();
        setUsuarios(data);
    }

    useEffect(() => {
        getUsuarios();
    }, [])

    const HTMLusuarios = usuarios.map((usuario) => {
        return (

            <div key={usuario.id}>
                <h3>{usuario.name}</h3>
            </div>

        )
    })

    return (
        <>
            <h1>peticion a una api</h1>
            <p>______________</p>
            {HTMLusuarios}
        </>
    )
}

export default FechApi;