const express = require('express');
const router = express.Router();
const usuarioController = require('../controladores/usuarioController.js');
var bcrypt = require('bcrypt')
const saltRounds = 10;


var encriptPassword = function(req,res,next){
    var password1 = req.body.password
    bcrypt.genSalt(saltRounds, function(err, salt) {
     bcrypt.hash(password1, salt, function(err, hash) {
         console.log(hash)
         req.body.password =  hash
         next()
     });
 });
 
 }
 
 
router.get('/', usuarioController .list.bind(usuarioController));
 
router.get('/:id', usuarioController.show.bind(usuarioController));
 
router.post('/register',encriptPassword, usuarioController.create.bind(usuarioController));
 
router.put('/:id',encriptPassword, usuarioController.update.bind(usuarioController));
 
router.delete('/:id', usuarioController.remove.bind(usuarioController));
 
module.exports = router;

