const express = require('express');

const usuariosRoutes = require('./usuarios.routes');
const detalleOrdenesRoutes = require('./detalleOrdenes.routes');

const router = express.Router();

router.use('/usuarios', usuariosRoutes);
router.use('/detalles', detalleOrdenesRoutes);

module.exports = router;
