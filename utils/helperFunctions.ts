import {NextFunction, Response} from "express";
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

export const findSession = (req, res, next: NextFunction)=>{
            console.log('REQUEST LOGGER', req.body, req.method)
            req.sessionStore.load(req.headers['kanban_user'], (err, session) => {
                if(!req.headers['kanban_user'] || req.headers['kanban_user'].length < 1){
                    return next();
                }
                if(req.body.email && req.body.email.includes('@') && req.body.password){
                    console.log('READING NEXT FOR BODY')
                    return next();
                }
                if (err || !session) {
                    console.log('No session found session', err);
                    res.statusCode = 401;
                    res.statusMessage = 'User is unauthorized.'
                    return responseBodyBuilder(res);
                }else {
                    return req.sessionStore.destroy(session.id, (err)=>{
                        if(err){
                            console.log('There was an error destroying old session');
                        }else{
                            console.log('Old Session destroyed!');
                        }
                        return next();
                    });

                }
            });

}

