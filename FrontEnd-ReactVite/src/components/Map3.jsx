const personas = [
    {
        nombre: "Ana",
        edad: 28,
        ciudad: "Madrid"
    },
    {
        nombre: "Carlos",
        edad: 35,
        ciudad: "Barcelona"
    },
    {
        nombre: "Lucía",
        edad: 22,
        ciudad: "Valencia"
    }
];

const HTML_personas = personas.map(persona => {
    return (
        <div key={persona.nombre}>
            <h2>{persona.nombre}</h2>
            <h2>{persona.edad}</h2>
        </div>
    )
})

function Map3() {
    return (
        <>
            <div>
                {HTML_personas}
            </div>
        </>
    )
}

export default Map3