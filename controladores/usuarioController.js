


var UsuarioModel = require('../modelos/usuarioModelo.js');

module.exports = {

    list: async function(req, res) {
        try {
            const usuarios = await UsuarioModel.find({});
            return res.status(200).json(usuarios);
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: 'Error when getting usuario.',
                error: err
            });
        }
    },
 
   show: async function(req, res) {
        try {
            const usuario = await UsuarioModel.findById(req.params.id);
            if (!usuario) {
                return res.status(404).json({
                    message: 'No such usuario'
                });
            }
            return res.status(200).json(usuario);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting usuario.',
                error: err
            });
        }
    },
 
    create: async function(req, res) {

        
        try {
            let usuario = new UsuarioModel({
                usuario: req.body.usuario,
                email: req.body.email,
                password: req.body.password,
                DisplayName: req.body.DisplayName,
                rol: req.body.rol,
                rooms: req.body.rooms
            });
            console.log(usuario)
 
            const savedUsuario = await usuario.save();
            return res.status(201).json(savedUsuario);
        } catch (err) {
            return res.status(200).json({
                message: 'Error when creating usuario',
                error: err
            });
        }
    },
 
    update:  async function(req, res) {
        try {
            const usuario = await UsuarioModel.findById(req.params.id);
            if (!usuario) {
                return res.status(404).json({
                    message: 'No such usuario'
                });
            }
 
            usuario.usuario = req.body.usuario ? req.body.usuario : usuario.usuario;
            usuario.email = req.body.email ? req.body.email : usuario.email;
            usuario.password = req.body.password ? req.body.password : usuario.password;
            usuario.DisplayName = req.body.DisplayName ? req.body.DisplayName : usuario.DisplayName;
            usuario.rol = req.body.rol ? req.body.rol : usuario.rol;
            usuario.rooms = req.body.rooms ? req.body.rooms : usuario.rooms;
 
            const updatedUsuario = await usuario.save();
            return res.json(updatedUsuario);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when updating usuario.',
                error: err
            });
        }
    },
 
    remove:  async function(req, res) {
        try {
            await UsuarioModel.findByIdAndRemove(req.params.id);
            return res.status(204).json();
        } catch (err) {
            return res.status(500).json({
                message: 'Error when deleting the usuario.',
                error: err
            });
        }
    }
 };

 