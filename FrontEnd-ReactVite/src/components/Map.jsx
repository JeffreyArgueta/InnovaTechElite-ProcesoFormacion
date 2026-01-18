const peliculas = ["Star Wars", "Ready Player One", "El señor de los anillos"]

function map() {
    return (
        <>
            <div>
                <h3>lista de peliculas</h3>
                {/* ¿Cómo usamos map? */}

                {/* primero escribimos llaves {} y dentro de las llaves
                hacemos referencia a nuestra variable "peliculas" y al ser un
                array tiene el metodo map*/}

                {/* el metodo map, va ha necesitar un callback
                el cual va ha necesitar un primer argumento que puede tener
                cualquier nombre y este va hacer referencia a los 
                elementos del array*/}
                {peliculas.map(pelicula => {
                    return <p key={pelicula}>{pelicula}</p>
                })}

                {/* jaja se me olvidada las "key" estas son
                identificadores de listas */}
            </div>
        </>
    )
}

export default map