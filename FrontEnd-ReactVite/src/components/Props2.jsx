function Hijo2(props) {
    const click = () =>{
        props.login("Adrían");
    }

    return (
        <>
            <div>
                <h2>Este es el componente hijo</h2>
                <p>Nombre de usuario: {props.userName}</p>
                <button 
                    onClick={click}>
                    longin
                </button>
            </div>
        </>
    )
}
export default Hijo2