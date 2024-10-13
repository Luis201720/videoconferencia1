const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const usuarioSchema = new Schema({
	'usuario' : { type: String,unique: true,required: true},
	'email' :  {
		type: String,
		required: true
	  },
	'password' : {
		type: String,
		required: true
	  },
	'DisplayName' : String,
	'rol' : String,
	'rooms' : Array
},{timestamps : true});

module.exports = mongoose.model('usuario', usuarioSchema);

