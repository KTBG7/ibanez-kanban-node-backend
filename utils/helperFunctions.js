"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseBodyBuilder = exports.findSession = exports.destroySession = void 0;
var generateToken = require('../utils/CsrfUtil').generateToken;
var destroySession = function (req) {
    return req.session.destroy(function (err) {
        console.log("Error destroying session", err);
    });
};
exports.destroySession = destroySession;
var findSession = function (sessionToken) {
    return mongoStore.get(sessionToken, function (err, session) {
        if (err) {
            return false;
        }
        if (session) {
            return session;
        }
    });
};
exports.findSession = findSession;
var responseBodyBuilder = function (res, req, boards) {
    if (req) {
        var token = generateToken(req, res);
        return res.send({
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
            csrf: token,
            kanban_user: req.sessionID
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
        statusMessage: res.statusMessage,
    });
};
exports.responseBodyBuilder = responseBodyBuilder;
