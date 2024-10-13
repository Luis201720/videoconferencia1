const app = angular.module('videoApp', []);
app.controller('CallController', function($scope, $location) {
  const socket = io('/');

  // Variables para el estado de la videollamada
  $scope.IDROOMGEN = '';
  $scope.btnulink = true;
  $scope.btnUnirse = true;
  $scope.btnGenerate = true;
  $scope.nombre = '';
  let myStream;
  let isAudioEnabled = true;
  let isVideoEnabled = true;

  // Capturar el parámetro 'roomId' del URL
  const roomIdFromUrl = $location.search().roomId;

  // Configuración de PeerJS
  const peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3000'
  });

  const videoGrid = document.getElementById('video-grid');
  const myVideo = document.createElement('video');
  myVideo.className = 'col-6 col-md-3 col-lg-3 vinsert';
  myVideo.muted = true;

  // Obtener el stream de video y audio
  navigator.mediaDevices.getUserMedia({
    video: {
      width: { ideal: 640 },
      height: { ideal: 360 },
    },
    audio: true
  }).then(stream => {
    myStream = stream;
    setTimeout(function() {
      addVideoStream(myVideo, stream, peer.id);
    }, 100);

    peer.on('call', call => {
      call.answer(stream);
      const video = document.createElement('video');
      video.className = 'col-6 col-md-3 col-lg-3 vinsert';
      call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream, call.peer);  // Pasar el ID único de peer
      });
    });

    socket.on('user-connected', userId => {
      connectToNewUser(userId, stream);
    });
  });

  // Detectar cuando un usuario se desconecta
  socket.on('user-disconnected', userId => {
    removeVideoStream(userId);
  });

  // Función para eliminar el video del usuario desconectado
  function removeVideoStream(userId) {
    const video = document.getElementById(userId);  // Buscar el video por el ID de usuario
    if (video) {
      video.remove();  // Eliminar el video del DOM
    }
  }

  // Función para agregar el video al DOM
  function addVideoStream(video, stream, userId) {
    video.srcObject = stream;
    video.id = userId;  // Asignar ID único basado en el userId
    video.addEventListener('loadedmetadata', () => {
      video.play();
    });
    videoGrid.append(video);
  }

  function connectToNewUser(userId, stream) {
    const call = peer.call(userId, stream);
    const video = document.createElement('video');
    video.className = 'col-6 col-md-3 col-lg-3 vinsert';
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream, call.peer);  // Pasar el ID de peer
    });
  }

  $scope.playRecordSound = function() {
    var audio = new Audio('./sounds/bell.mp3');
    audio.play();
  };

  $scope.generarCodigoAleatorio = function() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let codigo = '';
    for (let i = 0; i < 9; i++) {
      const caracterAleatorio = caracteres.charAt(Math.floor(Math.random() * caracteres.length));
      codigo += caracterAleatorio;
      if ((i + 1) % 3 === 0 && i !== 8) {
        codigo += '-';
      }
      $scope.btnGenerate = false;
    }
    $scope.IDROOMGEN = codigo;
    return codigo;
  };

  peer.on('open', id => {
    $scope.IDROOMGEN = roomIdFromUrl;
    socket.emit('join-room', roomIdFromUrl, peer.id);  // Usa el roomId capturado de la URL
  });

  $scope.joinRoomlink = function(a) {
    $scope.playRecordSound();
    $scope.btnulink = false;
    $scope.btnGenerate = false;
    $scope.IDROOMGEN = a;
    socket.emit('join-room', a, peer.id);
  };

  $scope.joinRoom = function(a) {
    $scope.playRecordSound();
    $scope.btnUnirse = false;
    const ROOM_ID = a || $scope.IDROOMGEN;
    socket.emit('join-room', ROOM_ID, peer.id);
  };

  $scope.muteUnmute = function() {
    isAudioEnabled = !isAudioEnabled;
    myStream.getAudioTracks()[0].enabled = isAudioEnabled;
  };

  $scope.toggleVideo = function() {
    isVideoEnabled = !isVideoEnabled;
    myStream.getVideoTracks()[0].enabled = isVideoEnabled;
  };

  $scope.leaveRoom = function() {
    myStream.getTracks().forEach(track => track.stop());  // Detener todos los streams
    socket.disconnect();  // Desconectar del socket
    peer.destroy();  // Destruir la conexión peer
    location.reload();  // Recargar la página para reiniciar la sesión
  };
});