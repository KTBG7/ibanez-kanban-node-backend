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
    if (req.session && req.session.isLoggedIn) {
        return next();
    }
    req.sessionStore.load(req.headers['kanban_user'], function (err, session) {
        console.log('OLD SESSION', session);
        if (!req.headers['kanban_user'] || req.headers['kanban_user'].length < 1) {
            return next();
        }
        if (req.body.email && req.body.email.includes('@') && req.body.password) {
            return next();
        }
        if (err || !session) {
            console.log('No session found session', err);
            res.statusCode = 401;
            res.statusMessage = 'User is unauthorized.';
            return (0, exports.responseBodyBuilder)(res);
        }
        else {
            req.session.user = session.user;
            req.session.isLoggedIn = session.isLoggedIn;
            return req.sessionStore.destroy(session.id, function (err) {
                if (err) {
                    console.log('There was an error destroying old session');
                }
                else {
                    console.log('Old Session destroyed!');
                    console.log('Current session', req.session);
                }
                return next();
            });
        }
    });
};
exports.findSession = findSession;
