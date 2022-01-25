import { Request, Response, NextFunction } from 'express';
import jwt , { JwtPayload } from 'jsonwebtoken';
import HttpError from '../models/HttpError';

interface JsonWebTokenProps extends JwtPayload {
    userId: string;
    email: string;
}


// to modify an existing interface . . . 
declare global {
    namespace Express {
        interface Request {
            user?: JsonWebTokenProps
        }
    }
}

const checkAuth = (req: Request, _res: Response, next: NextFunction) => {
    if(req.method==='OPTIONS') {
        return next();
    }

    let decodedToken: JsonWebTokenProps;
    const token = req.headers.authorization?.split(' ')[1];

    if(!token) {
        return next(new HttpError('Auth failed', 401));
    }

    try {
        decodedToken = jwt.verify(token, process.env.JWT_KEY!) as JsonWebTokenProps;
        req.user = { userId: decodedToken?.id, email: decodedToken?.email };
        next();
    } catch (error) {
        return next(new HttpError('Auth failed', 401));
    }
}

export default checkAuth;