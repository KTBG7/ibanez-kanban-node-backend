"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helperFunctions_1 = require("../utils/helperFunctions");
var userController = require('../controllers/userController');
var rtr = require('express').Router();
var dblCsrfprotection = require('../utils/CsrfUtil').doubleCsrfProtection;
rtr.get('/boards', helperFunctions_1.findSession, dblCsrfprotection, userController.getUserBoards);
rtr.post('/update-user-boards', dblCsrfprotection, userController.postUserBoards);
module.exports = rtr;
