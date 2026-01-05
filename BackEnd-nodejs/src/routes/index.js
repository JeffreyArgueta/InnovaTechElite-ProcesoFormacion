const express = require('express');
const router = express.Router();

// const modelsRoutes = require('./models');

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Rutas funcionando correctamente!',
    version: '1.0.0'
  });
});

// router.use('/', modelsRoutes);

module.exports = router;
