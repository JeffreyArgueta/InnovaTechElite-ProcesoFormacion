const peliculas = ["Star Wars", "Ready Player One", "El señor de los anillos"]

const HTML_Peliculas = peliculas.map(pelicula => {
    return <p key={pelicula}>{pelicula}</p>
})

function map2() {
    return (
        <>
            <div>
                <h3>lista de peliculas</h3>
                { HTML_Peliculas }
            </div>
        </>
    )
}

export default map2