const express = require('express');
const router = express.Router();

const usuariosRoutes = require('./models/usuarios.routes');
const ordenesRoutes = require('./models/ordenes.routes');

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Rutas funcionando correctamente!',
    version: '1.0.0'
  });
});

router.use('/usuarios', usuariosRoutes);
router.use('/ordenes', ordenesRoutes);

module.exports = router;
