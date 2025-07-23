import { Request, NextFunction, Response } from "express";

export interface HRequest extends Request {

}
export const apikeyMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const apikey = req.headers['apikey'];
    if (apikey !== 'xxx-xxx-xxx') {
        return res.send('Invalid Token');
    }
    next();
}