const express = require('express');
const ordenesController = require('../../controllers/ordenes.controller');
const detalleOrdenesRoutes = require('./detalleOrden.routes');

const router = express.Router();

router.get('/', ordenesController.getOrdenes);
router.get('/:id_usuario', ordenesController.getOrdenById);
router.post('/', ordenesController.createOrden);
router.put('/:id_usuario', ordenesController.updateOrden);
router.delete('/:id_usuario', ordenesController.deleteOrden);

router.use('/detalles', detalleOrdenesRoutes);

module.exports = router;
