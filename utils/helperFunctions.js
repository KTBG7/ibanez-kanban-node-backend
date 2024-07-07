"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findSession = exports.responseBodyBuilder = exports.destroySession = void 0;
var generateToken = require('../utils/CsrfUtil').generateToken;
var defaultDestroyCallback = function (err) {
    if (err) {
        console.log('Error Destroying session');
    }
    else {
        console.log('Success destroying session');
    }
};
var destroySession = function (req, sessionId, callback) {
    if (!callback) {
        return req.session.destroy(sessionId, defaultDestroyCallback);
    }
    return req.session.destroy(sessionId, callback);
};
exports.destroySession = destroySession;
var responseBodyBuilder = function (res, req, boards) {
    if (boards && req) {
        var token = generateToken(req, res);
        return res.send({
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
            boards: boards,
            csrf: token
        });
    }
    if (req) {
        var token = generateToken(req, res);
        return res.send({
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
            csrf: token,
            kanban_user: req.sessionID
        });
    }
    return res.send({
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
    });
};
exports.responseBodyBuilder = responseBodyBuilder;
var findSession = function (req, res, next) {
    if (req.method === 'OPTIONS') {
        next();
    }
    var sessionToken = req.headers['kanban_user'];
    if (sessionToken.length < 1) {
        console.log("Empty User ID");
        next();
    }
    if (sessionToken === req.sessionID) {
        console.log('equal');
        next();
    }
    req.sessionStore.get(sessionToken, function (err, session) {
        if (err) {
            console.log('No session found session', err);
            res.statusCode = 401;
            res.statusMessage = 'User is unauthorized.';
            return (0, exports.responseBodyBuilder)(res);
        }
        if (!!session) {
            console.log('Session found', session);
            if (session.isLoggedIn) {
                req.session.isLoggedIn = session.isLoggedIn;
                req.session.user = session.user;
            }
            return req.session.destroy(session.id, function (err) {
                if (err) {
                    console.log("Couldn't destroy old session");
                    next();
                }
                else {
                    console.log('Destroyed session');
                    next();
                }
            });
        }
    });
};
exports.findSession = findSession;
