const express = require('express');
const authMicrosoftController = require('../../controllers/auth.microsoft.controller');

const router = express.Router();

router.get('/url', authMicrosoftController.getMicrosoftAuthUrl);
router.post('/login', authMicrosoftController.loginWithMicrosoft);
router.post('/register', authMicrosoftController.registerWithMicrosoft);
router.post('/authenticate', authMicrosoftController.authenticateWithMicrosoft);
router.get('/callback', authMicrosoftController.getMicrosoftCallback);

module.exports = router;
