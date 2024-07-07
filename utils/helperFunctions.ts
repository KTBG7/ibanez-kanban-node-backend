import { Response } from "express";
import {BoardType} from "../types/GlobalTypes";

const generateToken = require('../utils/CsrfUtil').generateToken
export const destroySession = (req)=>{
    return req.session.destroy((err)=>{
        console.log("Error destroying session", err);
    });
}

export const findSession = async (sessionToken, req)=>{
        if(sessionToken === req.sessionID){
            console.log('equal')
            return true;
        }
        return await req.sessionStore.get(sessionToken, async (err, session) => {
            if (err) {
                console.log('No session found session', err)
                return false;
            }
            if (!!session) {
                console.log('Session found', session)
                req.session.email = session.email;
                return await req.sessionStore.destroy(session.id, (err) => {
                    if (err) {
                        console.log("Couldn't destroy old session");
                        return false;
                    } else {
                        console.log('Destroyed session');
                        return true;
                    }
                });
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