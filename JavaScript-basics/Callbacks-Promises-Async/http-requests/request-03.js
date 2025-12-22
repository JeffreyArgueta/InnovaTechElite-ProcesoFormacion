// Peticiones secuenciales (una depende de la otra)

async function obtenerPostsDeUsuario(userId) {
  try {
    // 1. Obtener usuario
    const usuarioResp = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
    const usuario = await usuarioResp.json();

    // 2. Usar el ID del usuario para obtener sus posts
    const postsResp = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
    const posts = await postsResp.json();

    console.log(`Posts de ${usuario.name}:`);
    posts.slice(0, 5).forEach(post => {
      console.log(`- ${post.title}`);
    });

  } catch (error) {
    console.error("Error:", error);
  }
}

obtenerPostsDeUsuario(1);
