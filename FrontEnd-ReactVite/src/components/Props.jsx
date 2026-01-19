function Hijo(props) {

  const {mensaje, persona} = props;

  return (
    <>
      <div>comunicacion de padre a hijo</div>
      <div>este es el hijo</div>
      <p>{mensaje}</p>
      <p>{persona.genero}</p>
    </>
  )
}
export default Hijo