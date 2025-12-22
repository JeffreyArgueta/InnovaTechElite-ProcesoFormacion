// Múltiples peticiones en paralelo (Mejor rendimiento)

/*
 * Cuando necesitas o quieres esperar varias promesas al mismo tiempo
 * (No una después de la otra)
 *
 * Ventaja: Las 3 peticiones se lanzan al mismo tiempo ->
 *          mucho más rápido que hacerlas secuencialmente
 */

async function obtenerDatosDashboard() {
  try {
    const [usuarios, posts, albums] = await Promise.all([
      fetch('https://jsonplaceholder.typicode.com/users').then(r => r.json()),
      fetch('https://jsonplaceholder.typicode.com/posts').then(r => r.json()),
      fetch('https://jsonplaceholder.typicode.com/albums').then(r => r.json())
    ]);

    console.log(`Usuarios: ${usuarios.length}`);
    console.log(`Posts: ${posts.length}`);
    console.log(`Álbumes: ${albums.length}`);

    // Ejemplo: mostrar los títulos de los primeros 3 posts
    posts.slice(0, 3).forEach(post => {
      console.log(`- ${post.title}`);
    });;

  } catch (error) {
    console.error("Error cargando el dashboard: ", error.message);
  }
}

obtenerDatosDashboard();
