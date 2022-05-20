// Importacion
// Leer variables de entorno
require('dotenv').config();
const express = require('express');

const { dbConnection } = require('./database/config');

// CORS
const cors = require('cors');


// Crear el servidor de express
const app = express();

// Configurar CORS
// Use es conocido como un midleware, son conocidos mas como una funcion que se va a ejecutar siempre para todas las lineas que siguen hacia abajo
// Cada vez que se haga una peticion va a pasar por aca y va a tener configurado la parte del CORS
app.use(cors());

// Base de datos
// User: mean_user
// Contra: bmaDiZi8XvExZeUG
dbConnection();

// Leer variables de entorno
// console.log(process.env);


// Rutas
app.get('/', (req, res) => {
    // resp.status para poner un codigo
    res.status(400).json({
        ok: true,
        msg: 'Hola Mundo'
    });
})


// levantar el servidor
app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto' + ' ' + 3000);
});