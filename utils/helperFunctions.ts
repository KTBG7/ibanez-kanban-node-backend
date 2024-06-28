import { Response } from "express";
import {BoardType} from "../types/GlobalTypes";

const generateToken = require('../utils/CsrfUtil').generateToken
export const destroySession = (req)=>{
    return req.session.destroy((err)=>{
        console.log("Error destroying session", err);
    });
}

export const responseBodyBuilder = (res: Response, req?: any, boards?: BoardType[])=>{
    if(req){
        const token = generateToken(req, res)
        return res.send({
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
            csrf: token
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
        statusMessage: res.statusMessage
    })
}