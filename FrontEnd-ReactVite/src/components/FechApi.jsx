import { useState } from "react";
import { useEffect } from "react";
import '../Styles/FechApi.css'

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

            <div key={usuario.id} className="FechApiContenedordenombres">
                <h3 className="FechApiUsuarios">{usuario.name}</h3>
            </div>

        )
    })

    return (
        <>
            <h1 className="FechApititulo">peticion a una api</h1>
            {HTMLusuarios}
        </>
    )
}

export default FechApi;