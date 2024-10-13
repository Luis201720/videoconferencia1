const express = require('express')
const fs = require('fs');
const https = require('https');
var cookieParser = require('cookie-parser');
var setings = require('./setings.json')
const path = require('path');
const mongoose = require('mongoose')
const socketIo = require('socket.io');
const { ExpressPeerServer } = require('peer');
const indexrrutas = require('./rutas/index.js')
const app = express();
var users = require('./rutas/usuarioRoutes.js')


// Leer los archivos de clave y certificado
const key = fs.readFileSync('server.key');
const cert = fs.readFileSync('server.cert');

const server = https.createServer({ key, cert }, app);

server.on('error', (err) => {
  console.error('Error en el servidor HTTPS:', err);
});




// coneccion a mongodb con mongoose 
mongoose.connect('mongodb://127.0.0.1:27017/videoconference');

const io = socketIo(server);


io.on('error', (err) => {
  console.error('Error en Socket.IO:', err);
});

app.use(express.static('public'));

app.set('views', path.join(__dirname, 'vistas'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Configuración de PeerJS Server





const peerServer = ExpressPeerServer(server, { debug: false,});

app.use('/',indexrrutas)
app.use('/peerjs', peerServer);
app.use('/users', users);

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  socket.on('join-room', (roomId, userId) => {
    console.log('Usuario unido:', userId, 'a la sala:', roomId);
    socket.join(roomId);
    socket.broadcast.to(roomId).emit('user-connected', userId);
    

 


socket.on('disconnect', () => {
  socket.broadcast.emit('user-disconnected', userId);
});


  });

  // Manejo de errores en el socket
  socket.on('error', (err) => {
    console.error('Error en el socket:', err);
  });
});




const PORT = process.env.PORT || setings.puerto;
server.listen(PORT, () => {
  console.log(`Servidor HTTPS ejecutándose en https://localhost:${PORT}`);
});
