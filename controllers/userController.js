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
var mongoose_1 = require("mongoose");
var helperFunctions_1 = require("../utils/helperFunctions");
var User = (0, mongoose_1.model)('User', require('../models/user'));
var getUserBoards = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var session_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.headers['kanban_user']) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, helperFunctions_1.findSession)(req.headers['kanban_user'])];
            case 1:
                session_1 = _a.sent();
                if (session_1) {
                    req.session = session_1;
                    res.statusCode = 200;
                    res.statusMessage = "User has logged in.";
                    return [2 /*return*/, (0, helperFunctions_1.responseBodyBuilder)(res, req)];
                }
                res.statusCode = 210;
                res.statusMessage = "Session Expired, please log in again!";
                return [2 /*return*/, (0, helperFunctions_1.responseBodyBuilder)(res)];
            case 2:
                if (!(!req.session.user || !req.session.isLoggedIn)) return [3 /*break*/, 5];
                res.statusCode = 401;
                res.statusMessage = 'User is not authenticated';
                if (!req.session.user) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, helperFunctions_1.destroySession)(req)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [2 /*return*/, (0, helperFunctions_1.responseBodyBuilder)(res)];
            case 5: return [2 /*return*/, User.findOne({ email: req.session.user })
                    .then(function (user) {
                    res.statusCode = 200;
                    res.statusMessage = "User Boards found successfully";
                    return (0, helperFunctions_1.responseBodyBuilder)(res, null, user.boards);
                })
                    .catch(function (err) {
                    console.log("There has been an error contacting the DB: ", err);
                    res.statusCode = 503;
                    res.statusMessage = "Downstream Error";
                    return (0, helperFunctions_1.responseBodyBuilder)(res);
                })];
        }
    });
}); };
var postUserBoards = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(!req.session.user || !req.session.isLoggedIn)) return [3 /*break*/, 3];
                res.statusCode = 401;
                res.statusMessage = 'User is not authenticated';
                if (!req.session.user) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, helperFunctions_1.destroySession)(req)];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/, (0, helperFunctions_1.responseBodyBuilder)(res)];
            case 3: return [2 /*return*/, User.findOne({ email: req.session.user })
                    .then(function (user) {
                    if (!user) {
                        res.statusCode = 404;
                        res.statusMessage = "User not found.";
                        return (0, helperFunctions_1.responseBodyBuilder)(res);
                    }
                    if (Array.isArray(req.body.boards)) {
                        user.boards = req.body.boards;
                        return user.save().then(function () {
                            res.statusCode = 200;
                            res.statusMessage = "User boards have been updated";
                            return (0, helperFunctions_1.responseBodyBuilder)(res);
                        }).catch(function (err) {
                            res.statusCode = 500;
                            res.statusMessage = "User boards have not been updated, DB issue." + err;
                            return (0, helperFunctions_1.responseBodyBuilder)(res);
                        });
                    }
                })];
        }
    });
}); };
module.exports = {
    getUserBoards: getUserBoards,
    postUserBoards: postUserBoards
};
