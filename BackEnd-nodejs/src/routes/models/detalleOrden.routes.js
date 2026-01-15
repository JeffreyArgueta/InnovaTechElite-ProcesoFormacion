const express = require('express');
const detalleOrdenController = require('../../controllers/detalleOrden.controller');

const router = express.Router();

router.get('/orden/:id_orden', detalleOrdenController.getDetalleOrdenByOrden);
router.get('/:id_detalle', detalleOrdenController.getDetalleOrdenById);
router.post('/', detalleOrdenController.createDetalleOrden);
router.put('/:id_detalle', detalleOrdenController.updateDetalleOrden);
router.delete('/:id_detalle', detalleOrdenController.deleteDetalleOrden);

module.exports = router;
