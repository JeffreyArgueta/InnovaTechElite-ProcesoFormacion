function obtenerDatos() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const datos = { nombre: "Anderson" };
      resolve(datos);
      // reject(new Error("Falló"));  para error
     }, 2000);
  });
}

obtenerDatos()
  .then(datos => {
    console.log("Datos recibidos: ", datos);
    // return ObtenerOtrosDatos(); // Puedes encadenar otra promise
  })
  .catch(error => {
    console.error("Error: ", error);
  })
  .finally(() => {
    console.log("Operacion finalizada");
  })
