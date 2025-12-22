function obtenerDatos(callback) {
  setTimeout(() => {
    const datos = { nombre: "Anderson" };
    callback(null, datos);
    // Primer argumento: error (null si no hay respuesta)
    // Segundo argumento: resultado
  }, 2000); // Simula 2 segundos de espera
}

obtenerDatos((error, datos) => {
  if (error) {
    console.error("Error: ", error);
  } else {
    console.log("Datos recibidos: ", datos);
  }
});
