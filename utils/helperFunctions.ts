import { Response } from "express";
import {BoardType} from "../types/GlobalTypes";

const generateToken = require('../utils/CsrfUtil').generateToken
export const destroySession = (req)=>{
    return req.session.destroy((err)=>{
        console.log("Error destroying session", err);
    });
}

export const findSession = (sessionToken, req)=>{
    console.log(req.app.get('mongoStore').all());
    return req.app.get('mongoStore').get(sessionToken, (err, session)=>{
        if(err){
            return false;
        }
        if(session){
            return session;
        }
    })
}

export const responseBodyBuilder = (res: Response, req?: any, boards?: BoardType[])=>{
    if(req){
        const token = generateToken(req, res)
        return res.send({
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
            csrf: token,
            kanban_user: req.sessionID
        })
    }
    if(boards){
        return res.send({
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
            boards: boards
        })
    }
    return res.send({
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,

    })
}