// Importacion
// Leer variables de entorno
require('dotenv').config();
const express = require('express');
const path = require('path');

const { dbConnection } = require('./database/config');

// CORS
const cors = require('cors');
const res = require('express/lib/response');


// Crear el servidor de express
const app = express();

// Configurar CORS
// Use es conocido como un midleware, son conocidos mas como una funcion que se va a ejecutar siempre para todas las lineas que siguen hacia abajo
// Cada vez que se haga una peticion va a pasar por aca y va a tener configurado la parte del CORS
app.use(cors());

// Carpeta publica
// Para poder acceder al index.html
app.use(express.static('public'));

// Lectura y parseo del body
// esto debe de ir antes de las rutas por que debe de realizarlo primero
app.use(express.json());

// Base de datos
// User: mean_user
// Contra: bmaDiZi8XvExZeUG
dbConnection();

// Leer variables de entorno
// console.log(process.env);


// Rutas
// Middleware

// Usuarios
// Cualquier peticion que pase por el /api/usuarios sera respondida por el router que estoy exportando por defecto aqui require('./routes/usuarios')
app.use('/api/usuarios', require('./routes/usuarios'));

// Login
// Cualquier peticion que pase por el /api/login sera respondida por el router que estoy exportando por defecto aqui require('./routes/auth')
app.use('/api/login', require('./routes/auth'));

// Hospitales
// Cualquier peticion que pase por el /api/hospitales sera respondida por el router que estoy exportando por defecto aqui require('./routes/hospitales')
app.use('/api/hospitales', require('./routes/hospitales'));

// Medicos
// Cualquier peticion que pase por el /api/medicos sera respondida por el router que estoy exportando por defecto aqui require('./routes/medicos')
app.use('/api/medicos', require('./routes/medicos'));

// Busquedas
// Cualquier peticion que pase por el /api/todo sera respondida por el router que estoy exportando por defecto aqui require('./routes/busquedas')
app.use('/api/todo', require('./routes/busquedas'));

// Subir archivos
// Cualquier peticion que pase por el /api/uploads sera respondida por el router que estoy exportando por defecto aqui require('./routes/uploads')
app.use('/api/upload', require('./routes/uploads'));

// Lo ultimo, si es cualquier otra ruta hara lo siguiente
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
});


// levantar el servidor
app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto' + ' ' + 3000);
});

/* Middlewares: Son funciones que se ejecutan antes de llegar a otras, tambien verifican que la informacion venga como nosotros esperamos */