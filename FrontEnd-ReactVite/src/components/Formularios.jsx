import { useState } from "react";

function Formularios() {

    const [user, setUser] = useState({
        usermane: "",
        password: ""
    })

    const EnviarFormulario = (e)=>{
        e.preventDefault();
        console.log(user);
        console.log("el formulario se envio");
    }

    const userNameInput = (e) => {
        //console.log(e.target.value);
        setUser({...user, usermane: e.target.value})
    }

    const userPasswordInput = (e) => {
        //console.log(e.target.value);
        setUser({...user, password: e.target.value})
    }

    return (
        <>
            <div>
                <h1>Formularios</h1>
            </div>

            <form onSubmit={EnviarFormulario}>

                <label
                    htmlFor="usermane">
                    Usuario:
                </label>
                <input
                    type="text"
                    id="usermane"
                    onChange={userNameInput}
                    value={user.usermane}
                />

                <br></br>

                <label
                    htmlFor="password">
                    Contraseña:
                </label>
                <input
                    type="password"
                    id="password"
                    onChange={userPasswordInput}
                    value={user.password}
                />

                <br></br>

                <button>Enviar</button>

            </form>

            <button onClick={()=> setUser({ usermane: "", password: "" })}>logout</button>
        </>
    )
}

export default Formularios;