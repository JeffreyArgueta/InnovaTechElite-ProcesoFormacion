// Peticiones HTTP con fetch (el más común)

async function obtenerUsuario(id) {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const usuario = await response.json();
    return usuario;
  } catch (error) {
    console.error("No se pudo obtener el usuario: ", error.message);
    return null;
  }
}

async function mostrarUsuario() {
  const usuario = await obtenerUsuario(1);
  if (usuario) {
    console.log(`Nombre: ${usuario.name}`);
    console.log(`Email: ${usuario.email}`);
    console.log(`Ciudad: ${usuario.city}`);
  }
}

mostrarUsuario();
