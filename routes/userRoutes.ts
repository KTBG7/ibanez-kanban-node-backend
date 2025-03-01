import {findSession} from "../utils/helperFunctions";

const userController = require('../controllers/userController');
const rtr = require('express').Router();
const dblCsrfprotection = require('../utils/CsrfUtil').doubleCsrfProtection;

rtr.get('/boards', findSession, dblCsrfprotection, userController.getUserBoards);
rtr.post('/update-user-boards', dblCsrfprotection, userController.postUserBoards);

module.exports = rtr;