const express = require('express');
const detalleOrdenesController = require('../../controllers/detalleOrdenes.controller');

const router = express.Router();

router.get('/orden/:id_orden', detalleOrdenesController.getDetallesPorOrden);
router.get('/:id_detalle', detalleOrdenesController.getDetalleOrdenById);
router.post('/', detalleOrdenesController.createDetalleOrdenes);
router.put('/:id_detalle', detalleOrdenesController.updateDetalleOrdenes);
router.delete('/:id_detalle', detalleOrdenesController.deleteDetalleOrdenes);

module.exports = router;
