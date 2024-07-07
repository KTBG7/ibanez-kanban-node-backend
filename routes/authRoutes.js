var authController = require('../controllers/authController');
var router = require('express').Router();
var doubleCsrfProtection = require('../utils/CsrfUtil').doubleCsrfProtection;
router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/logout', doubleCsrfProtection, authController.logout);
module.exports = router;
