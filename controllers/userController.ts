import { Response } from "express";
import {model, Model} from "mongoose";
import {UserType} from "../types/GlobalTypes";
import {responseBodyBuilder} from "../utils/helperFunctions";

const User: Model<UserType> = model('User', require('../models/user'));

const getUserBoards = async (req: any, res: Response, next)=>{
        console.log(req.session.user, 'checking for email');
        return User.findOne({email: req.session.user})
            .then((user)=>{
                res.statusCode = 200;
                res.statusMessage = "User Boards found successfully";
                return responseBodyBuilder(res, null, user.boards);
            })
            .catch((err)=>{
                console.log("There has been an error contacting the DB: ", err);
                res.statusCode = 503;
                res.statusMessage = "Downstream Error";
                return responseBodyBuilder(res);
            });
}

const postUserBoards = async (req:any, res: Response, next)=>{
    return User.findOne({email: req.session.user})
        .then((user)=>{
            if(!user){
                res.statusCode = 404;
                res.statusMessage = "User not found."
                return responseBodyBuilder(res);
            }
            if(Array.isArray(req.body.boards)){
                user.boards = req.body.boards;
                return user.save().then(()=>{
                    res.statusCode = 200;
                    res.statusMessage = "User boards have been updated";
                    return responseBodyBuilder(res)
                }).catch((err)=>{
                    res.statusCode = 500;
                    res.statusMessage = "User boards have not been updated, DB issue." + err;
                    return responseBodyBuilder(res);
                });

            }
        })
}

module.exports = {
    getUserBoards,
    postUserBoards
}

