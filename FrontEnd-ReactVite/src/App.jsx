import './App.css'

const peliculas = ["pelicula1", "pelicula2", "pelicula3"]

const htmlPeliculas = peliculas.map(pelicula => {
  return <p key={pelicula}>{pelicula}</p>
})

function App() {
  return (
    <>
      <div>
        <h1>renderizar listas</h1>

        {/* {peliculas.map(pelicula => {
          return <p key={pelicula}>{pelicula}</p>
        })} */}

        {htmlPeliculas}
      </div>
    </>
  )
}

export default App
