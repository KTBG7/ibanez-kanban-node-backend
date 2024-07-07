import { Response } from "express";
import {BoardType} from "../types/GlobalTypes";
import {IncomingMessage} from "node:http";

const generateToken = require('../utils/CsrfUtil').generateToken
const defaultDestroyCallback = (err)=>{
    if(err){
        console.log('Error Destroying session')
    }else{
        console.log('Success destroying session')
    }
}
export const destroySession = (req, sessionId, callback?)=>{
    if(!callback){
        return req.session.destroy(sessionId, defaultDestroyCallback)
    }
    return req.session.destroy(sessionId, callback);
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

export const findSession = (req, res, next)=>{
    console.log(req.method);
        if( req.method === 'OPTIONS'){
            next();
        }
        const sessionToken = req.headers['kanban_user'];
        if (sessionToken.length < 1) {
            console.log("Empty User ID");
            next()
        }
        if(sessionToken === req.sessionID){
            console.log('equal')
            next()
        }
        req.sessionStore.get(sessionToken, (err, session) => {
            if (err) {
                console.log('No session found session', err);
                res.statusCode = 401;
                res.statusMessage = 'User is unauthorized.'
                return responseBodyBuilder(res);
            }
            if (!!session) {
                console.log('Session found', session)
                if(session.isLoggedIn){
                    req.session.isLoggedIn = session.isLoggedIn;
                    req.session.user = session.user;
                }
                return req.session.destroy(session.id, (err) => {
                    if (err) {
                        console.log("Couldn't destroy old session");
                        next();
                    } else {
                        console.log('Destroyed session');
                        next();
                    }
                });
            }
        })
}

