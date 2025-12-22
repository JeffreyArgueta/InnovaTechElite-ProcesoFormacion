# 1. Callbacks

## ¿Cómo funcionan?
Un **callback** es una función que se pasa como argumento a otra función y se ejecuta una vez que la operación asíncrona ha terminado.
La función principal no espera el resultado; en su lugar, "llama de vuelta" (callback) a la función proporcionada cuando está lista.
Esto permite que el código continúe ejecutándose sin bloquearse.

## ¿Por qué surgieron?
Los callbacks surgieron en los inicios de **JavaScript** (alrededor de los años 90) para manejar eventos asíncronos en entornos como navegadores web, donde no se podía esperar sincrónicamente por respuestas (por ejemplo, de un servidor).

Antes, lenguajes como **C** o **Java** usaban hilos para paralelismo, pero JavaScript optó por un modelo de **eventos no bloqueante** para mantener la interfaz *responsive*.

# 2. Promises

## ¿Cómo funcionan?
Una **Promise** es un objeto que representa el eventual resultado (o fracaso) de una operación asíncrona.
Puede estar en uno de tres estados: **pendiente (pending)**, **resuelta (fulfilled)** o **rechazada (rejected)**.

Usas métodos como:
- `.then()` → para manejar el éxito
- `.catch()` → para manejar errores
- `.finally()` → para limpieza

Las promises permiten **encadenar operaciones de forma lineal**.

## ¿Por qué surgieron?
Las promises se introdujeron en **ES6 (2015)** para resolver el *"callback hell"*.
Con callbacks anidados, el código se volvía piramidal y difícil de mantener, especialmente en aplicaciones complejas como **Node.js**.

Las promises ofrecen una forma más **estructurada**, con mejor manejo de errores que se **propagan automáticamente**.

# 3. Async/Await

## ¿Cómo funcionan?
**async/await** es una *syntactic sugar* sobre **promises**.
- Marcas una función como `async` para que pueda usar `await` dentro de ella.
- `await` pausa la ejecución de la función hasta que la promise se resuelva o rechace, pero **sin bloquear el hilo principal**.
- Los errores se manejan con `try/catch`.

## ¿Por qué surgieron?
Introducido en **ES8 (2017)**, `async/await` surgió para hacer el código asíncrono aún más **legible**, como si fuera síncrono.

Aunque las promises mejoraron los callbacks, encadenar muchas `.then()` seguía siendo **verboso**.
`async/await` simplifica esto, especialmente en **flujos complejos**, reduciendo *boilerplate* y haciendo el código más **intuitivo** para desarrolladores de lenguajes síncronos.

# Conclusión

- **Callbacks**: Básicos pero propensos a anidamiento.
- **Promises**: Mejoran la estructura y manejo de errores.
- **Async/Await**: Hacen el código más limpio y natural.

En la práctica, usa **async/await** para nuevo código, pero entiende los tres ya que **coexisten en librerías**.
