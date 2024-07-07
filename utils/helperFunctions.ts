import { Response } from "express";
import {BoardType} from "../types/GlobalTypes";

const generateToken = require('../utils/CsrfUtil').generateToken
export const destroySession = (req)=>{
    return req.session.destroy((err)=>{
        if(err){
            console.log('Error Destroying session')
        }else{
            console.log('Success destroying session')
        }
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
                if(session.isLoggedIn){
                    req.session.email = session.email;
                    req.session.isLoggedIn = session.isLoggedIn;
                    req.session.cookie = session.cookie;
                }
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
    if(boards && req){
        const token = generateToken(req, res)
        return res.send({
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
            boards: boards,
            csrf: token
        })
    }
    if(req){
        const token = generateToken(req, res)
        return res.send({
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
            csrf: token,
            kanban_user: req.sessionID
        })
    }
    return res.send({
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,

    })
}