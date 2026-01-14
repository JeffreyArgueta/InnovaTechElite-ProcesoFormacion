const express = require('express');
const detalleOrdenesController = require('../../controllers/detalleOrden.controller');

const router = express.Router();

router.get('/orden/:id_orden', detalleOrdenesController.getDetalleOrdenByOrden);
router.get('/:id_detalle', detalleOrdenesController.getDetalleOrdenById);
router.post('/', detalleOrdenesController.createDetalleOrden);
router.put('/:id_detalle', detalleOrdenesController.updateDetalleOrden);
router.delete('/:id_detalle', detalleOrdenesController.deleteDetalleOrden);

module.exports = router;
