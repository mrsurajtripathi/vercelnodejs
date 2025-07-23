"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apikeyMiddleware = void 0;
const apikeyMiddleware = (req, res, next) => {
    const apikey = req.headers['apikey'];
    if (apikey !== 'xxx-xxx-xxx') {
        return res.send('Invalid Token');
    }
    next();
};
exports.apikeyMiddleware = apikeyMiddleware;
