function obtenerDatos() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ nombre: "Anderson" });
    }, 2000);
  });
}

async function procesar() {
  try {
    const datos = await obtenerDatos();
    console.log("Datos recibidos: ", datos);
  } catch (error) {
    console.error("Error: ", error);
  } finally {
    console.log("Operación finalizada");
  }
}

procesar();
