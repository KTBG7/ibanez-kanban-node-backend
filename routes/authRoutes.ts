const authController = require('../controllers/authController');
const router = require('express').Router();
const doubleCsrfProtection = require('../utils/CsrfUtil').doubleCsrfProtection;
router.post('/login',authController.login);
router.post('/signup', authController.signup);
router.post('/logout', doubleCsrfProtection, authController.logout);

module.exports = router;