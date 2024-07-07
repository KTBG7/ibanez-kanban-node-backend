import {findSession} from "../utils/helperFunctions";

const authController = require('../controllers/authController');
const router = require('express').Router();
const doubleCsrfProtection = require('../utils/CsrfUtil').doubleCsrfProtection;

router.post('/login', findSession, authController.login);
router.post('/signup', findSession, authController.signup);
router.post('/logout', doubleCsrfProtection, authController.logout);

module.exports = router;