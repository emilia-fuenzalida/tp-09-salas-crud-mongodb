# TP09 – Salas: API REST y CRUD con MongoDB

## 1. Descripción del proyecto

Este trabajo práctico continúa el desarrollo realizado en TP08, incorporando las operaciones CRUD completas a la API REST para la gestión de reservas de salas, utilizando MongoDB Atlas y Mongoose como sistema de persistencia.

El objetivo principal es permitir crear, consultar, reemplazar, actualizar parcialmente y eliminar reservas mediante solicitudes HTTP, manteniendo la integración con la aplicación web desarrollada anteriormente.

Tanto la interfaz web como la API REST utilizan el mismo servicio de reservas y trabajan sobre una única base de datos MongoDB, garantizando la persistencia de la información.

Las operaciones implementadas son:

- **Create:** creación de nuevas reservas mediante POST.
- **Read:** consulta de todas las reservas o de una reserva específica mediante GET.
- **Update:** reemplazo completo mediante PUT y actualización parcial mediante PATCH.
- **Delete:** eliminación física de una reserva mediante DELETE.

## 2. Tecnologías utilizadas

| Tecnología | Versión |
|---|---|
| Node.js | v24.19.0 |
| npm | 11.17.0 |
| Express | ^5.2.1 |
| Mongoose | ^9.11.3 |
| EJS | ^6.0.1 |
| express-ejs-layouts | ^2.5.1 |
| Morgan | ^1.12.1 |
| Prettier | ^3.9.10 |
| ESLint | ^10.13.0 |

Las versiones de las dependencias corresponden a los rangos declarados en `package.json`.

## 3. Preparación de MongoDB Atlas

Para utilizar la base de datos se configuró un clúster en MongoDB Atlas.

Los pasos de preparación fueron:

1. Crear una cuenta y un proyecto en MongoDB Atlas.
2. Crear un clúster para almacenar las reservas.
3. Crear un usuario de base de datos con sus credenciales.
4. Configurar el acceso de red mediante Network Access, autorizando la dirección IP correspondiente.
5. Obtener la cadena de conexión desde la opción Connect de Atlas.
6. Configurar la variable `MONGODB_URI` en el archivo `.env`.

La aplicación utiliza la siguiente base de datos:

- **Base de datos:** `reservas_salas_u9`
- **Colección:** `reservas`

La conexión se realiza mediante Mongoose y se centraliza en `src/config/base-datos.js`.

### Configuración DNS

Durante la configuración inicial de MongoDB Atlas se presentaron inconvenientes de resolución DNS. Por este motivo, se conserva el ajuste utilizado en TP07:

```js
dns.setServers(["8.8.8.8", "1.1.1.1"]);
```

Se utilizan los servidores DNS públicos de Google y Cloudflare.

## 4. Configuración del entorno

El proyecto utiliza variables de entorno para evitar incluir información sensible directamente en el código.

Se debe crear un archivo `.env` a partir de `.env.example` y completar los valores correspondientes:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://USUARIO:CONTRASENA@CLUSTER.mongodb.net/?retryWrites=true&w=majority
```

Los valores de usuario, contraseña y clúster deben reemplazarse por los correspondientes a la configuración de MongoDB Atlas.

**Importante:** el archivo `.env` contiene credenciales y no debe subirse al repositorio. Se incluye `.env.example` como referencia, sin información sensible.

El archivo `src/config/entorno.js` centraliza la lectura de las variables de entorno y comprueba que el puerto sea un número entero entre 1 y 65535.

## 5. Instalación y ejecución

Para instalar las dependencias:

```bash
npm install
```

Para iniciar la aplicación:

```bash
npm start
```

La aplicación queda disponible en:

```text
http://localhost:3000
```

Para ejecutar las comprobaciones de formato y código:

```bash
npm run format
npm run check
```

El comando `npm run format` aplica Prettier sobre las carpetas `src` y `scripts`.

El comando `npm run check` ejecuta las comprobaciones de formato y ESLint.

Otros comandos disponibles:

| Comando | Función |
|---|---|
| `npm start` | Inicia la aplicación utilizando el archivo `.env`. |
| `npm run format` | Aplica el formato al código. |
| `npm run format:check` | Comprueba el formato sin modificar los archivos. |
| `npm run lint` | Ejecuta ESLint. |
| `npm run check` | Ejecuta las comprobaciones de formato y lint. |

## 6. Estructura del proyecto

La estructura principal del proyecto es la siguiente:

```text
tp-09-salas-crud-mongodb/
├── src/
│   ├── config/
│   │   ├── base-datos.js
│   │   └── entorno.js
│   ├── controladores/
│   │   ├── api-reservas.js
│   │   └── reservas.js
│   ├── middleware/
│   │   ├── errores.js
│   │   ├── reservas.js
│   │   ├── solicitudes.js
│   │   └── validar-api-reserva.js
│   ├── modelos/
│   │   └── reserva.js
│   ├── rutas/
│   │   ├── api-reservas.js
│   │   └── reservas.js
│   ├── servicios/
│   │   └── reservas.js
│   ├── app.js
│   └── index.js
├── views/
│   ├── layouts/
│   │   └── main.ejs
│   ├── reservas/
│   │   ├── detalle.ejs
│   │   ├── lista.ejs
│   │   └── nueva.ejs
│   ├── inicio.ejs
│   └── no-encontrado.ejs
├── scripts/
│   ├── comprobar-conexion.js
│   ├── crear-reservas.js
│   ├── listar-reservas.js
│   └── probar-validaciones.js
├── public/
│   └── estilos.css
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── eslint.config.js
└── README.md
```

El archivo `.env` se crea localmente y no debe incluirse en el repositorio. Tampoco se debe subir `node_modules`.

## 7. Arquitectura y funcionamiento

### 7.1. Inicio de la aplicación y conexión con MongoDB

El archivo `src/index.js` centraliza el inicio y cierre de la aplicación.

Antes de iniciar el servidor HTTP, se establece la conexión con MongoDB mediante `conectarBaseDatos()`. La aplicación comienza a escuchar solicitudes únicamente cuando la conexión se completa correctamente.

La conexión permanece activa durante la ejecución del servidor y se reutiliza para atender las solicitudes.

Ante una señal de finalización (`SIGINT` o `SIGTERM`), se cierra primero el servidor HTTP y luego la conexión con MongoDB.

Si ocurre un error durante el inicio, se informa el problema, se intenta cerrar la conexión y el proceso finaliza con un código de salida distinto de cero.

### 7.2. Configuración de la conexión

La conexión con MongoDB se centraliza en `src/config/base-datos.js`, utilizando Mongoose.

Antes de establecer la conexión, se verifica que `MONGODB_URI` esté definida y tenga un prefijo válido (`mongodb://` o `mongodb+srv://`).

La conexión utiliza la base de datos `reservas_salas_u9`.

Para finalizarla, se implementa `cerrarBaseDatos()`, que comprueba el estado de la conexión y ejecuta la desconexión mediante Mongoose.

### 7.3. Modelo de reservas

El modelo `Reserva`, ubicado en `src/modelos/reserva.js`, define la estructura de los documentos almacenados en la colección `reservas`.

Los campos definidos son:

| Campo | Tipo | Validaciones |
|---|---|---|
| `estudiante` | String | Obligatorio y elimina espacios al inicio y al final. |
| `email` | String | Obligatorio y debe contener `@`. |
| `sala` | String | Obligatorio y admite únicamente las salas permitidas. |
| `fecha` | String | Obligatorio y elimina espacios al inicio y al final. |
| `turno` | String | Obligatorio y admite Mañana, Tarde o Noche. |
| `personas` | Number | Obligatorio, entero entre 1 y 6. |
| `estado` | String | Admite `pendiente` o `confirmada`. |

El campo `estado` tiene como valor predeterminado `pendiente`.

### 7.4. Servicio de reservas y acceso a los datos

El archivo `src/servicios/reservas.js` centraliza las operaciones de acceso a las reservas mediante el modelo Mongoose `Reserva`.

Sus responsabilidades incluyen:

- Obtener todas las reservas, permitiendo aplicar filtros.
- Buscar una reserva por su identificador.
- Contar los documentos almacenados.
- Crear nuevas reservas.
- Reemplazar una reserva completa.
- Actualizar parcialmente una reserva.
- Eliminar una reserva.
- Obtener la lista de salas permitidas.
- Convertir los documentos de MongoDB en objetos de respuesta.

La función `convertirReserva()` transforma el identificador interno `_id` de MongoDB en una propiedad `id` de tipo cadena, facilitando su representación en las respuestas JSON.

Este servicio es utilizado tanto por los controladores de la aplicación HTML como por los de la API REST. De esta manera, ambas interfaces trabajan sobre la misma fuente de datos, evitando mantener almacenamiento duplicado para las reservas.

Para las modificaciones se utilizan operaciones de Mongoose con validaciones habilitadas y sin permitir la creación automática de documentos inexistentes (`upsert: false`).

### 7.5. Controladores de la API

El controlador `src/controladores/api-reservas.js` gestiona las operaciones HTTP de la API.

Implementa las siguientes operaciones:

- `listarReservas`: obtiene todas las reservas y permite filtrar por sala.
- `obtenerReserva`: busca una reserva mediante su identificador.
- `crearReserva`: registra una nueva reserva.
- `reemplazarReserva`: reemplaza todos los datos de una reserva mediante PUT.
- `actualizarReserva`: modifica parcialmente los campos permitidos mediante PATCH.
- `eliminarReserva`: elimina físicamente una reserva mediante DELETE.

El controlador verifica el formato del identificador antes de realizar las consultas y diferencia entre identificadores inválidos y reservas inexistentes.

Las respuestas HTTP se adaptan al resultado de cada operación. Los errores inesperados se derivan al middleware centralizado mediante `next(error)`.

Al crear una reserva, devuelve el encabezado `Location` con la dirección del recurso generado y el contenido de la reserva en formato JSON.

### 7.6. Controladores de la aplicación web

Los controladores de la aplicación web utilizan el mismo módulo `src/servicios/reservas.js` para acceder a los datos.

La aplicación web presenta los resultados mediante vistas EJS, mientras que la API devuelve respuestas en formato JSON.

Las operaciones disponibles permiten listar reservas, mostrar el formulario de creación, consultar el detalle de una reserva y registrar nuevas reservas.

Cuando se crea una reserva desde el formulario HTML, se guarda en MongoDB y se redirige al listado de reservas.

### 7.7. Validación de solicitudes de la API

El archivo `src/middleware/validar-api-reserva.js` centraliza las validaciones de las operaciones POST, PUT y PATCH.

Para evitar la repetición de código, contiene funciones auxiliares como `validarPersonas()` y `validarCuerpo()`.

Las validaciones se organizan de la siguiente manera:

**POST – Creación de reservas**

- Comprueba que el cuerpo recibido sea un objeto JSON.
- Verifica que los seis campos originales estén presentes y tengan valores válidos.
- Comprueba el formato básico del correo electrónico.
- Valida las salas y los turnos permitidos.
- Comprueba que la cantidad de personas sea un entero entre 1 y 6.
- Construye `req.reservaValidada` únicamente con los campos autorizados.

El cliente no puede establecer directamente el estado ni el identificador de la reserva durante la creación. El estado se asigna automáticamente como `pendiente` mediante el modelo.

**PUT – Reemplazo completo**

- Exige los siete campos editables de la reserva.
- Comprueba que no se envíen campos desconocidos.
- Valida los campos de texto, sala, turno, correo electrónico, personas y estado.
- Construye `req.reservaValidada` con los datos autorizados.

Para reemplazar una reserva correctamente se deben enviar todos los campos requeridos.

**PATCH – Actualización parcial**

- Permite actualizar únicamente `personas` y `estado`.
- Exige que se envíe al menos uno de esos campos.
- Rechaza cualquier campo no autorizado.
- Valida los valores recibidos y construye `req.cambiosValidados`.

Las solicitudes que contienen datos inválidos reciben una respuesta `400 Bad Request`.

### 7.8. Validación de formularios HTML

El middleware `src/middleware/reservas.js` contiene las validaciones correspondientes al formulario HTML.

Comprueba los campos obligatorios, la sala, el turno, el correo electrónico y la cantidad de personas.

Si encuentra datos inválidos, devuelve el código `400` y vuelve a mostrar el formulario conservando los valores ingresados.

Si las validaciones son satisfactorias, construye `req.reservaValidada` con los datos autorizados y permite continuar con la creación de la reserva.

Además, `prepararAreaReservas` define la variable local `seccion`, utilizada por las vistas para identificar el área de reservas.

### 7.9. Rutas de la API y de la aplicación web

Las rutas de la API se encuentran centralizadas en `src/rutas/api-reservas.js`.

Se utiliza un enrutador de Express para definir los métodos GET, POST, PUT, PATCH y DELETE.

Cada operación está asociada a su controlador correspondiente. Las operaciones POST, PUT y PATCH incorporan los middlewares de validación antes de ejecutar el controlador.

Las rutas de la interfaz web se encuentran en `src/rutas/reservas.js`. Se utiliza otro router para organizar las operaciones de consulta, visualización y creación de reservas.

Todas las rutas web ejecutan previamente el middleware `prepararAreaReservas`.

### 7.10. Configuración general de Express

El archivo `src/app.js` centraliza la configuración de Express.

Define EJS como motor de vistas, configura los middlewares generales, habilita los archivos estáticos y procesa los cuerpos de solicitudes HTML y JSON.

También registra las rutas de la aplicación web, la API y el endpoint de estado.

Los middlewares generales incluyen:

- Morgan: registra las solicitudes HTTP.
- `identificarSolicitud`: genera un identificador secuencial para cada solicitud.
- `medirDuracion`: calcula el tiempo de procesamiento.
- `expressLayouts`: permite utilizar layouts EJS.
- `express.static`: permite servir archivos estáticos.
- `express.urlencoded`: procesa los datos enviados desde formularios.
- `express.json`: procesa los cuerpos de solicitudes JSON.

Finalmente, incorpora el manejo diferenciado de rutas inexistentes para la API y la aplicación web, junto con el middleware centralizado de errores.

### 7.11. Identificación y medición de solicitudes

El middleware `solicitudes.js` permite identificar y medir las solicitudes HTTP.

`identificarSolicitud` genera un identificador secuencial con el formato `BIB-0001` y lo almacena en `res.locals`.

Por su parte, `medirDuracion` calcula el tiempo de procesamiento de cada solicitud y registra en la terminal su identificador, método HTTP, URL, código de respuesta y duración en milisegundos.

Esto facilita el seguimiento y diagnóstico de las operaciones realizadas.

### 7.12. Manejo centralizado de errores

El middleware `manejarErrores()` centraliza el tratamiento de errores de la aplicación.

Diferencia las solicitudes de la API y de la interfaz web para proporcionar respuestas adecuadas a cada una.

Detecta errores de sintaxis en cuerpos JSON y devuelve el código HTTP `400`.

Para errores inesperados responde con el código `500`, utilizando JSON para la API y vistas EJS para la aplicación web.

También comprueba si los encabezados ya fueron enviados para evitar intentar responder nuevamente.

## 8. Endpoints disponibles

### 8.1. Aplicación web

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/` | Muestra la página de inicio. |
| GET | `/reservas` | Muestra el listado de reservas. |
| GET | `/reservas/nueva` | Muestra el formulario de creación. |
| GET | `/reservas/:id` | Muestra el detalle de una reserva. |
| POST | `/reservas` | Valida y registra una nueva reserva. |

### 8.2. API REST

| Método | Ruta | Descripción | Respuesta esperada |
|---|---|---|---|
| GET | `/api/reservas` | Lista todas las reservas. | 200 OK |
| GET | `/api/reservas?sala=Sala%20Norte` | Filtra reservas por sala. | 200 OK |
| GET | `/api/reservas/:id` | Consulta una reserva por identificador. | 200 OK, 400 o 404 |
| POST | `/api/reservas` | Crea una nueva reserva. | 201 Created o 400 |
| PUT | `/api/reservas/:id` | Reemplaza una reserva completa. | 200 OK, 400 o 404 |
| PATCH | `/api/reservas/:id` | Actualiza personas y/o estado. | 200 OK, 400 o 404 |
| DELETE | `/api/reservas/:id` | Elimina una reserva. | 204 No Content, 400 o 404 |

### 8.3. Estado del servicio

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/estado` | Informa el estado del servicio, la cantidad de reservas y el identificador de solicitud. |

Ejemplo ilustrativo de respuesta:

```json
{
  "servicio": "activo",
  "reservas": 1,
  "solicitudId": "BIB-0001"
}
```

El número de reservas y el identificador varían según el estado de la base de datos y las solicitudes realizadas.

## 9. Ejemplos de uso de la API

Las siguientes solicitudes pueden ejecutarse utilizando Postman.

### 9.1. Consultar todas las reservas

**Método:** GET

**URL:**

```text
http://localhost:3000/api/reservas
```

Devuelve un arreglo JSON con las reservas almacenadas.

**Respuesta esperada:** `200 OK`.

### 9.2. Filtrar por sala

**Método:** GET

**URL:**

```text
http://localhost:3000/api/reservas?sala=Sala%20Norte
```

Devuelve únicamente las reservas correspondientes a Sala Norte.

### 9.3. Consultar una reserva por ID

**Método:** GET

**URL:**

```text
http://localhost:3000/api/reservas/ID_DE_LA_RESERVA
```

El identificador debe tener 24 caracteres hexadecimales.

- Si el identificador tiene un formato incorrecto, devuelve `400 Bad Request`.
- Si tiene un formato válido pero no existe, devuelve `404 Not Found`.
- Si existe, devuelve `200 OK` con los datos de la reserva.

### 9.4. Crear una reserva (POST)

**Método:** POST

**URL:**

```text
http://localhost:3000/api/reservas
```

**Header requerido:**

```text
Content-Type: application/json
```

**Body (raw – JSON):**

```json
{
  "estudiante": "Estudiante de prueba",
  "email": "estudiante@email.com",
  "sala": "Sala Norte",
  "fecha": "2026-11-10",
  "turno": "Mañana",
  "personas": 2
}
```

**Respuesta esperada:**

- Código HTTP: `201 Created`.
- Encabezado `Location`: dirección de la reserva creada.
- Cuerpo: objeto JSON con los datos de la reserva y su identificador generado por MongoDB.

Ejemplo ilustrativo:

```json
{
  "id": "ID_GENERADO_POR_MONGODB",
  "estudiante": "Estudiante de prueba",
  "email": "estudiante@email.com",
  "sala": "Sala Norte",
  "fecha": "2026-11-10",
  "turno": "Mañana",
  "personas": 2,
  "estado": "pendiente"
}
```

El identificador real es generado automáticamente por MongoDB y el estado se establece en `pendiente`.

### 9.5. Reemplazar una reserva (PUT)

**Método:** PUT

**URL:**

```text
http://localhost:3000/api/reservas/ID_DE_LA_RESERVA
```

**Header requerido:**

```text
Content-Type: application/json
```

**Body (raw – JSON):**

```json
{
  "estudiante": "Estudiante actualizado",
  "email": "actualizado@email.com",
  "sala": "Sala Sur",
  "fecha": "2026-11-20",
  "turno": "Tarde",
  "personas": 5,
  "estado": "confirmada"
}
```

Para realizar un reemplazo completo deben enviarse los siete campos editables.

**Respuesta esperada:** `200 OK`, con el objeto de la reserva actualizado.

### 9.6. Actualizar parcialmente una reserva (PATCH)

**Método:** PATCH

**URL:**

```text
http://localhost:3000/api/reservas/ID_DE_LA_RESERVA
```

**Header requerido:**

```text
Content-Type: application/json
```

**Body de ejemplo para modificar la cantidad de personas:**

```json
{
  "personas": 4
}
```

**Body de ejemplo para modificar el estado:**

```json
{
  "estado": "confirmada"
}
```

También se pueden enviar ambos campos en una misma solicitud:

```json
{
  "personas": 3,
  "estado": "pendiente"
}
```

Solo se permite modificar `personas` y `estado`.

**Respuesta esperada:** `200 OK`, con el objeto actualizado y los demás datos de la reserva conservados.

### 9.7. Eliminar una reserva (DELETE)

**Método:** DELETE

**URL:**

```text
http://localhost:3000/api/reservas/ID_DE_LA_RESERVA
```

No requiere Body.

**Respuesta esperada:** `204 No Content`.

La eliminación es física: el documento se elimina de la colección de MongoDB.

Si se intenta eliminar nuevamente el mismo identificador, la API devuelve `404 Not Found`.

## 10. Pruebas realizadas

Las pruebas se realizaron utilizando Postman y el servidor local conectado a MongoDB Atlas.

### 10.1. Matriz de resultados

| Prueba | Resultado obtenido | Estado |
|---|---|---|
| `npm run format` | Se ejecutó correctamente. | Correcto |
| `npm run check` | Se ejecutó correctamente. | Correcto |
| Inicio del servidor | La aplicación inició y conectó con MongoDB. | Correcto |
| POST con datos válidos | Creó una reserva y devolvió 201. | Correcto |
| POST sin enviar estado | Asignó automáticamente `pendiente`. | Correcto |
| GET `/api/reservas` | Devolvió las reservas almacenadas con 200. | Correcto |
| GET por ID existente | Devolvió el objeto solicitado con 200. | Correcto |
| GET por ID inexistente | Devolvió 404. | Correcto |
| PUT con datos válidos | Reemplazó la reserva y devolvió 200. | Correcto |
| PATCH de personas | Actualizó la cantidad de personas y devolvió 200. | Correcto |
| PATCH de estado | Actualizó el estado y devolvió 200. | Correcto |
| PATCH con personas fuera de rango | Rechazó la solicitud con 400. | Correcto |
| PATCH con personas decimales | Rechazó la solicitud con 400. | Correcto |
| PATCH con estado inválido | Rechazó la solicitud con 400. | Correcto |
| PATCH con campo no permitido | Rechazó la solicitud con 400. | Correcto |
| PATCH con cuerpo vacío | Rechazó la solicitud con 400. | Correcto |
| PUT con correo inválido | Rechazó la solicitud con 400. | Correcto |
| PUT con campos incompletos | Rechazó la solicitud con 400. | Correcto |
| DELETE de una reserva existente | Eliminó el documento y devolvió 204. | Correcto |
| GET después de eliminar | Devolvió 404. | Correcto |
| DELETE de una reserva ya eliminada | Devolvió 404. | Correcto |
| Reinicio del servidor | Los datos y modificaciones permanecieron almacenados. | Correcto |
| GET `/estado` | Informó la cantidad de documentos existentes. | Correcto |

### 10.2. Prueba de persistencia

Se comprobó que las reservas y sus modificaciones no se pierden al detener y volver a iniciar el servidor.

Para realizar esta comprobación:

1. Se creó una nueva reserva mediante POST.
2. Se modificó la cantidad de personas mediante PATCH.
3. Se detuvo el servidor.
4. Se volvió a iniciar la aplicación.
5. Se realizó una consulta GET utilizando el identificador de la reserva.

La API devolvió `200 OK` y conservó los datos actualizados, incluyendo la cantidad de personas modificada.

Esto demuestra que la información se almacena de manera persistente en MongoDB y no depende de la memoria del servidor.

### 10.3. Comprobación del encabezado Location

El controlador de la API implementa la devolución del encabezado `Location` al crear una reserva.

Para documentar la prueba completa desde Postman se debe comprobar:

1. Ejecutar un POST válido.
2. Verificar la respuesta `201 Created`.
3. Revisar los encabezados de la respuesta y localizar `Location`.
4. Utilizar esa dirección para realizar un GET.
5. Comprobar que se recupera la misma reserva creada.

### 10.4. Comprobación del endpoint de estado

Se realizó una consulta a:

```text
http://localhost:3000/estado
```

El endpoint informó correctamente la cantidad de reservas almacenadas en MongoDB.

Después de las pruebas de eliminación y persistencia, se comprobó que la cantidad reflejada correspondía a los documentos que permanecían en la colección.

### 10.5. Comprobación de solicitudes rechazadas

Se realizaron solicitudes PUT y PATCH con datos inválidos para verificar que las validaciones impidieran ejecutar modificaciones incorrectas.

Las solicitudes rechazadas devolvieron `400 Bad Request`, mientras que las operaciones válidas actualizaron los documentos correctamente.

## 11. Validaciones y limitaciones

El sistema implementa validaciones tanto en el formulario HTML como en la API REST.

Entre ellas se encuentran:

- Campos obligatorios.
- Validación básica del correo electrónico.
- Salas permitidas.
- Turnos permitidos.
- Estados permitidos: `pendiente` y `confirmada`.
- Cantidad de personas entre 1 y 6.
- Cantidad de personas expresada como número entero.
- Identificadores MongoDB con formato válido.
- Rechazo de campos adicionales no autorizados.
- Validación de los siete campos requeridos para PUT.
- Restricción de PATCH a los campos `personas` y `estado`.
- Rechazo de cuerpos JSON inválidos o vacíos cuando corresponde.

Sin embargo, existen algunas limitaciones:

- El correo electrónico solamente comprueba que contenga el carácter `@`; no realiza una validación completa de su formato.
- La fecha se almacena como texto y no se comprueba que corresponda a una fecha real o a un formato específico.
- No se implementa una comprobación de disponibilidad de las salas para evitar reservas superpuestas.
- No se implementa una prevención de reservas duplicadas.
- El campo `estado` admite `pendiente` y `confirmada`, pero no se implementa un flujo de aprobación o confirmación de reservas.
- La API no incorpora autenticación ni autorización de usuarios.

## 12. Comparación entre TP08 y TP09

| Aspecto | TP08 | TP09 |
|---|---|---|
| Base de datos | MongoDB Atlas. | MongoDB Atlas. |
| Persistencia | La aplicación web y la API utilizan MongoDB. | Se mantiene la persistencia mediante MongoDB. |
| Acceso a los datos | Servicio centralizado de reservas. | Se amplía el servicio con las operaciones CRUD completas. |
| Interfaz web | Aplicación de reservas con Express y EJS. | Se mantiene la aplicación web y su integración con MongoDB. |
| API REST | Permite consultar, filtrar y crear reservas. | Incorpora GET, POST, PUT, PATCH y DELETE. |
| Identificadores | Consulta mediante identificadores MongoDB. | Se validan los identificadores y se diferencian los recursos inexistentes. |
| Actualización | No se contaba con reemplazo completo ni actualización parcial. | Se implementan PUT y PATCH. |
| Eliminación | No se contaba con eliminación física mediante API. | Se implementa DELETE sobre documentos de MongoDB. |
| Validaciones | Validaciones para creación y consulta. | Se amplían las validaciones para creación, reemplazo y actualización parcial. |
| Persistencia | Los datos permanecen almacenados en MongoDB. | Se comprueba también la persistencia de las modificaciones y eliminaciones. |

## 13. Conclusión

En este trabajo práctico se amplió la aplicación de reservas desarrollada en TP08, incorporando las operaciones CRUD completas a la API REST mediante MongoDB Atlas y Mongoose.

Se implementaron las operaciones de creación, consulta, reemplazo, actualización parcial y eliminación de reservas, manteniendo una arquitectura organizada mediante controladores, servicios, modelos, rutas y middlewares.

También se ampliaron las validaciones para garantizar que las solicitudes recibidas cumplan con las condiciones establecidas, evitando modificaciones con datos incorrectos o campos no autorizados.

Las pruebas realizadas con Postman permitieron comprobar el funcionamiento de las operaciones CRUD, los códigos de respuesta HTTP, el rechazo de solicitudes inválidas y la persistencia de los datos después de reiniciar el servidor.

Finalmente, se mantuvo la integración con la aplicación web desarrollada anteriormente, utilizando un servicio compartido para acceder a la misma base de datos.

De esta manera, el proyecto evoluciona desde una API que permitía principalmente crear y consultar reservas hacia una API REST con operaciones CRUD completas y persistencia en MongoDB.
