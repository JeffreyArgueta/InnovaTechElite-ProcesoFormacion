const express = require('express');

const routes = require('./routes');
const logger = require('./utils/logger');
const morgan = require('morgan');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('combined', { stream: { write: message => logger.info(message) }}));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'BackEnd funcionando correctamente!',
    version: '1.0.0'
  });
});

app.use('/api/', routes);

module.exports = app;
