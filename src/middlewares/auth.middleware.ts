import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { AuthRequest } from '../models/authModel';

export default (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });

    try {
        req.user = verify(token, (process as any).apps.JWT_SECRET as string);
        next();
    } catch {
        res.status(401).json({ message: 'Invalid token' });
    }
};
