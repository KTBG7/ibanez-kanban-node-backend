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
var bcrypt = require('bcryptjs');
var login = function (req, res, next) {
    console.log(req.session.user, req.session.isLoggedIn);
    if (req.session.user && req.session.isLoggedIn) {
        res.statusCode = 200;
        res.statusMessage = "User has logged in.";
        return (0, helperFunctions_1.responseBodyBuilder)(res, req);
    }
    return User.findOne({ email: req.body.email })
        .then(function (user) {
        console.log(user);
        if (!user) {
            res.statusCode = 404;
            res.statusMessage = "Email is not registered, please try a different email or sign up.";
            return (0, helperFunctions_1.responseBodyBuilder)(res);
        }
        bcrypt.compare(req.body.password, user.password)
            .then(function (validPassword) {
            if (!validPassword) {
                res.statusCode = 401;
                res.statusMessage = "Incorrect password, please try again.";
                return (0, helperFunctions_1.responseBodyBuilder)(res);
            }
            req.session.isLoggedIn = true;
            req.session.user = req.body.email;
            res.statusCode = 200;
            res.statusMessage = "User Logged In.";
            (0, helperFunctions_1.responseBodyBuilder)(res, req);
            return req.session.save(function (err) {
                console.log(err);
            });
        })
            .catch(function (err) {
            res.statusCode = 503;
            res.statusMessage = "There has been an error please retry.";
            console.log(err);
            return (0, helperFunctions_1.responseBodyBuilder)(res);
        });
    });
};
var signup = function (req, res, next) {
    return User.findOne({ email: req.body.email })
        .then(function (user) {
        if (user) {
            res.statusCode = 210;
            res.statusMessage = "Email is already registered, please try a different email.";
            return (0, helperFunctions_1.responseBodyBuilder)(res);
        }
        return bcrypt.hash(req.body.password, 12)
            .then(function (hashedPass) {
            var user = new User({ email: req.body.email, password: hashedPass, boards: [
                    {
                        "name": "Example Board",
                        "columns": [
                            {
                                "name": "Example Column",
                                "tasks": [
                                    {
                                        "title": "Example Task",
                                        "description": "",
                                        "status": "Example Column",
                                        "subtasks": [
                                            {
                                                "title": "Example Subtask",
                                                "isCompleted": false
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ] });
            return user.save();
        })
            .then(function () {
            res.statusCode = 200;
            res.statusMessage = "User has been created.";
            req.session.user = req.body.email;
            req.session.isLoggedIn = true;
            return (0, helperFunctions_1.responseBodyBuilder)(res, req);
        });
    });
};
var logout = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, helperFunctions_1.destroySession)(req)];
            case 1:
                _a.sent();
                res.statusCode = 200;
                res.statusMessage = "Logout Successful.";
                return [2 /*return*/, (0, helperFunctions_1.responseBodyBuilder)(res)];
        }
    });
}); };
module.exports = {
    signup: signup,
    login: login,
    logout: logout
};
