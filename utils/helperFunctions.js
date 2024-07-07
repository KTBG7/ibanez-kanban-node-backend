"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseBodyBuilder = exports.findSession = exports.destroySession = void 0;
var testHelper_1 = require("connect-mongo/build/main/test/testHelper");
var generateToken = require('../utils/CsrfUtil').generateToken;
var destroySession = function (req) {
    return req.session.destroy(function (err) {
        console.log("Error destroying session", err);
    });
};
exports.destroySession = destroySession;
var findSession = function (sessionToken, req) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (sessionToken === req.sessionID) {
                    console.log('equal');
                    return [2 /*return*/, true];
                }
                return [4 /*yield*/, req.sessionStore.get(sessionToken, function (err, session) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (err) {
                                        console.log('No session found session', err);
                                        return [2 /*return*/, false];
                                    }
                                    if (!!!session) return [3 /*break*/, 2];
                                    console.log('Session found', session);
                                    req.session.email = session.email;
                                    return [4 /*yield*/, req.sessionStore.destroy(session.id, function (err) {
                                            if (err) {
                                                console.log("Couldn't destroy old session");
                                                return false;
                                            }
                                            else {
                                                console.log('Destroyed session');
                                                return true;
                                            }
                                        })];
                                case 1: return [2 /*return*/, _a.sent()];
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.findSession = findSession;
var responseBodyBuilder = function (res, req, boards) {
    if (req) {
        var token = generateToken(req, res);
        (0, testHelper_1.makeCookie)();
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
