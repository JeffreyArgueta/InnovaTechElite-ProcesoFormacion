const express = require('express');
const authGoogleRoutes = require('./google.routes');
// const authMicrosoftRoutes = require('./authMicrosoft.routes');
const logoutController = require('../../controllers/logout.controller');

const router = express.Router();

router.use('/google', authGoogleRoutes);
// router.use('/microsoft', authGoogleRoutes);
router.post('/logout', logoutController);

module.exports = router;
