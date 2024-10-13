var express = require('express');
var router = express.Router();
var UsuarioModel = require('../modelos/usuarioModelo.js');
var bcrypt = require('bcrypt')
var setings = require('../setings.json')
var jwt = require('jsonwebtoken');
var secret  =  'asdfasdfwwe2e2ev2v24vwvi42890840940942039r'
const nodemailer = require('nodemailer');

const localIpAddress = require("local-ip-address")
 


var ip = localIpAddress()
var puerto = setings.puerto

var  sendmail = function(email,link,nombre){
  console.log('enviando email')
  // Configuración del transporte SMTP para Outlook
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'videoconferenciaumg2024@gmail.com', // Tu correo de Gmail
      pass: 'yjio gpsw gghh lgoe' // Tu contraseña de Gmail o una contraseña de aplicaciones
    }
  });
// Configuración del correo a enviar
let mailOptions = {
  from: '"Videoconferencia UMG" <videoconferenciaumg1628@outlook.com>', // Remitente
  to: email, // Reemplaza con la dirección del destinatario
  subject: 'Recuperacion de contraseña', // Asunto del correo
  //text: '', // Texto del correo
  html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
      body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
          color: #333;
      }
      .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 10px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      }
      .header {
          text-align: center;
          padding: 20px 0;
          background-color: #4CAF50;
          color: #ffffff;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
      }
      .header h1 {
          margin: 0;
          font-size: 24px;
      }
      .content {
          padding: 20px;
          text-align: center;
      }
      .content p {
          font-size: 16px;
          line-height: 1.5;
          margin: 0 0 20px;
      }
      .btn {
          display: inline-block;
          padding: 12px 24px;
          background-color: #4CAF50;
          color: #ffffff;
          text-decoration: none;
          border-radius: 5px;
          font-size: 16px;
      }
      .btn:hover {
          background-color: #45a049;
      }
      .footer {
          text-align: center;
          padding: 10px;
          font-size: 12px;
          color: #888888;
          margin-top: 20px;
      }
      .footer a {
          color: #4CAF50;
          text-decoration: none;
      }
      .footer a:hover {
          text-decoration: underline;
      }
  </style>
</head>
<body>
  <div class="container">
      <div class="header">
          <h1>Recuperación de Contraseña VideoConferencia UMG</h1>
      </div>
      <div class="content">
          <p>Hola ${nombre}</p>
          <p>Has solicitado restablecer tu contraseña. Haz clic en el botón a continuación para continuar:</p>
          <a href="${link}" class="btn">Restablecer Contraseña</a>
          <p>Si no solicitaste este cambio, puedes ignorar este correo electrónico.</p>
      </div>
      <div class="footer">
          <p>Gracias por confiar en nuestros servicios. Si tienes alguna duda, por favor <a href="mailto:videoconferenciaumg1628@outlook.com">contáctanos</a>.</p>
      </div>
  </div>
</body>
</html>
` // Contenido HTML
};

// Enviar el correo
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
      return console.log('Error al enviar el correo:', error);
  }
  console.log('Correo enviado con éxito:', info.messageId);
});

}



/* GET home page. */



var passVal= function(req,res,next){
  console.log(req,res)
}


router.get('/', function(req, res, next) {
    res.render('index', { 'message': 'ok' });
  });
  


  router.get('/:room', function(req, res, next) {
    console.log(req.params.room)
    if(setings.dominio){
      res.render('vconlink', { 'url':`https://${setings.dominio}:${puerto}/${req.params.room}`,'room': req.params.room});
    }else{
      res.render('vconlink', { 'url':`https://${ip}:${puerto}/${req.params.room}`,'room': req.params.room});
    }
    
  });
  


  // funcion que genera el jwt de recuperacion para ser enviado a mail 
  router.post('/recupera', async function(req, res, next) {
    const usuarios = await UsuarioModel.findOne({usuario:req.body.usuario});
    console.log(usuarios)
    if(usuarios){
      var jasonwebtoken = await jwt.sign({
        data: {usuario:usuarios._id}
      }, secret, { expiresIn: '24h' });
      console.log(jasonwebtoken)
      var nombre = usuarios.DisplayName
      var link = `https://${ip}:${puerto}/recupera/${jasonwebtoken}`
      var email =  usuarios.email
      sendmail(email,link,nombre)
      return res.json({'mensaje':'correo enviado','correo':usuarios.email});
    }else{
      console.log('no usuario registrado')
    }
   
/*-VALIDACION SI EXISTE EL USUARIO PARA OBTENER CONTRASEÑA
-COMENTARIO DE CONFIRMACIÓN DE ENVIO DE CORREO PARA RESTABLECIMIENTO DE CONTRASEÑA
boton salir */

    // jwt.verify(jasonwebtoken, secret, function(err, decoded) {
    //   if (err) {
    //     console.log(err)
    //   }
    //   console.log(decoded)
    // });
  })


  router.get('/recupera/:token', async function(req, res, next) {
    var jasonwebtoken = req.params.token

    jwt.verify(jasonwebtoken, secret, async function(err, decoded) {
       if (err) {
        // console.log('err',err)
       }else{
        console.log('decodificado',decoded)
        const usuarios = await UsuarioModel.findOne({'_id':decoded.data.usuario});
        console.log(usuarios)
     
        res.render('cambiocon', { 'usuarios': usuarios.usuario,'id':decoded.data.usuario});
       }
       



     });
  })


router.post('/', async function(req, res, next) {
  console.log(req.body)
  try {
    const usuarios = await UsuarioModel.findOne({usuario:req.body.usuario});
    console.log(usuarios)

    bcrypt.compare(req.body.password, usuarios.password, function(err, result) {
     if(err){
      console.log('errrrrrrr',err)
     
     }else{
      console.log(result)
      if(result){

        if(setings.dominio){
          res.render('vcon', { 'url':`https://${setings.dominio}:${puerto}/`,'room':'','nombre':usuarios.DisplayName});
        }else{
          res.render('vcon', { 'url':`https://${ip}:${puerto}/`,'room':'','nombre':usuarios.DisplayName});
        }
       // res.render('vcon.ejs', { 'url':`https://${ip}:${puerto}/`,'room':'','nombre':usuarios.DisplayName})
      }else{
        res.render('index', { 'message': 'usuario o password invalido' })
      }
     }

  });
} catch (err) {
    console.log(err)
    res.render('index', { 'message': 'usuario o password invalido' })
}
});



module.exports = router;
