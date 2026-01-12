const express = require('express');
const usuarioController = require('../../controllers/usuarios.controller');

const router = express.Router();

router.get('/', usuarioController.getUsuarios);
router.get('/:id_usuario', usuarioController.getUsuarioById);
router.post('/', usuarioController.createUsuario);
router.put('/:id_usuario', usuarioController.updateUsuario);
router.delete('/:id_usuario', usuarioController.deleteUsuario);

module.exports = router;
