"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseBodyBuilder = exports.destroySession = void 0;
var generateToken = require('../utils/CsrfUtil').generateToken;
var destroySession = function (req) {
    return req.session.destroy(function (err) {
        console.log("Error destroying session", err);
    });
};
exports.destroySession = destroySession;
var responseBodyBuilder = function (res, req, boards) {
    if (req) {
        var token = generateToken(req, res);
        return res.send({
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
            csrf: token
        });
    }
    if (boards) {
        return res.send({
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
            boards: boards
        });
    }
    return res.send({
        statusCode: res.statusCode,
        statusMessage: res.statusMessage
    });
};
exports.responseBodyBuilder = responseBodyBuilder;
