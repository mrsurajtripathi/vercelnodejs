
import { Request, Response } from 'express';
export const BlogController = {
    create: (req: Request, res: Response) => {
        res.send('main');
    }
}