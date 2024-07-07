import { Response } from "express";
import {model, Model} from "mongoose";
import {UserType} from "../types/GlobalTypes";
import {destroySession, findSession, responseBodyBuilder} from "../utils/helperFunctions";

const User: Model<UserType> = model('User', require('../models/user'));
const bcrypt = require('bcryptjs');

const login = async (req: any, res: Response, next) =>{
    if(req.session.user && req.session.isLoggedIn){
        res.statusCode = 220;
        res.statusMessage = "User has an active session, redirecting to kanban.";
        return responseBodyBuilder(res, req);
    }
    if(req.headers['kanban_user'] && req.headers['kanban_user'].length > 1){
        const sessionFound = await findSession(req.headers['kanban_user'], req);
        if(sessionFound){
            res.statusCode = 220;
            res.statusMessage = "User has an active session, redirecting to kanban.";
            await req.session.save((err)=>{
                if(err){
                    console.log('Error saving', err);
                }
            });
            return responseBodyBuilder(res, req);
        }
        res.statusCode = 230;
        res.statusMessage = "User has expired token.";
        return responseBodyBuilder(res);

    }
    return User.findOne({email: req.body.email})
        .then((user)=>{
            if(!user){
                res.statusCode = 404;
                res.statusMessage = "Email is not registered, please try a different email or sign up.";
                return responseBodyBuilder(res);
            }
            bcrypt.compare(req.body.password, user.password)
                .then((validPassword) => {
                    if (!validPassword) {
                        res.statusCode = 401;
                        res.statusMessage = "Incorrect password, please try again.";
                        return responseBodyBuilder(res);
                    }
                    req.session.isLoggedIn = true;
                    req.session.user = req.body.email;
                    res.statusCode = 200;
                    res.statusMessage = "User Logged In.";
                    req.session.save((err)=>{
                        if(err){
                            console.log('Error saving', err);
                        }
                    })
                    return responseBodyBuilder(res, req)
                })
                .catch((err)=>{
                    res.statusCode = 503;
                    res.statusMessage = "There has been an error please retry.";
                    console.log(err);
                    return responseBodyBuilder(res);
                })
        })

}

const signup = async (req:any, res: Response, next) =>{
    if(req.session.user && req.session.isLoggedIn){
        res.statusCode = 220;
        res.statusMessage = "User has an active session, redirecting to kanban.";
        return responseBodyBuilder(res, req);
    }
    if(req.headers['kanban_user'] && req.headers['kanban_user'].length > 1){
        const sessionFound = await findSession(req.headers['kanban_user'], req);
        if(sessionFound){
            res.statusCode = 220;
            res.statusMessage = "User has an active session, redirecting to kanban.";
            await req.session.save((err)=>{
                if(err){
                    console.log('Error saving', err);
                }
            })
            return responseBodyBuilder(res, req);
        }
        res.statusCode = 230;
        res.statusMessage = "User has expired token.";
        return responseBodyBuilder(res);

    }
    return User.findOne({email: req.body.email})
        .then((user)=>{
            if(user){
                res.statusCode = 210;
                res.statusMessage = "Email is already registered, please try a different email.";
                return responseBodyBuilder(res)
            }
            return bcrypt.hash(req.body.password, 12)
                .then((hashedPass) =>{
                const user = new User({email: req.body.email, password: hashedPass, boards: [
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
                        }]});
                user.save().then(async ()=>{
                    res.statusCode = 200;
                    res.statusMessage = "User has been created.";
                    req.session.user = req.body.email;
                    req.session.isLoggedIn = true;
                    await req.session.save((err)=>{
                        if(err){
                            console.log('Error saving', err);
                        }
                    })
                    return responseBodyBuilder(res, req);
                });
            })
        })

}

const logout = async (req, res, next)=>{
    await destroySession(req);
    res.statusCode = 200;
    res.statusMessage = "Logout Successful.";
    return responseBodyBuilder(res);
}

module.exports = {
    signup,
    login,
    logout
}