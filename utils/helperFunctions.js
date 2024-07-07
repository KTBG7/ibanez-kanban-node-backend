"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseBodyBuilder = exports.findSession = exports.destroySession = void 0;
var generateToken = require('../utils/CsrfUtil').generateToken;
var destroySession = function (req) {
    return req.session.destroy(function (err) {
        if (err) {
            console.log('Error Destroying session');
        }
        else {
            console.log('Success destroying session');
        }
    });
};
exports.destroySession = destroySession;
var findSession = function (sessionToken, req) {
    if (sessionToken === req.sessionID) {
        console.log('equal');
        return true;
    }
    return req.sessionStore.get(sessionToken, function (err, session) {
        if (err) {
            console.log('No session found session', err);
            return false;
        }
        if (!!session) {
            console.log('Session found', session);
            if (session.isLoggedIn) {
                return session;
            }
            return req.sessionStore.destroy(session.id, function (err) {
                if (err) {
                    console.log("Couldn't destroy old session");
                    return false;
                }
                else {
                    console.log('Destroyed session');
                    return true;
                }
            });
        }
    });
};
exports.findSession = findSession;
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
