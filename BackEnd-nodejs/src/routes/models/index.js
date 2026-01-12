const express = require('express');

const usuariosRoutes = require('./usuarios.routes');

const router = express.Router();

router.use('/usuarios', usuariosRoutes)

module.exports = router;
