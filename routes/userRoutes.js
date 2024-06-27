var userController = require('../controllers/userController');
var rtr = require('express').Router();
var dblCsrfprotection = require('../utils/CsrfUtil').doubleCsrfProtection;
rtr.get('/boards', dblCsrfprotection, userController.getUserBoards);
rtr.post('/update-user-boards', dblCsrfprotection, userController.postUserBoards);
module.exports = rtr;
