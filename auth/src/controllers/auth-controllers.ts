import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import HttpError from '../models/HttpError';

const signUp = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as { email: string, password: string };

    const error = validationResult(req);
    if(!error.isEmpty()) {
        return next(new HttpError('Invalid inputs', 422));
    }
    //check if email exists in DB
    //hash and save account
    //generate auth tokens
    res.status(201).json({message: 'Sign up successful', user: { email }});
} 

const login = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as { email: string, password: string };

    const error = validationResult(req);
    if(!error.isEmpty()) {
        return next(new HttpError('Invalid inputs', 422));
    }

    // check if email exists in DB
    // check if password is correct
    // generate auth tokens
    res.status(200).json({message: 'Login successful', user: { email }});
}

const requestResetPassword = (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body as { email: string };

    const error = validationResult(req);
    if(!error.isEmpty()) {
        return next(new HttpError('Invalid inputs', 422));
    }

    console.log(email);

    // check if email exists in DB
    // create a reset token, modify user to add reset token + expiry date for token
    // send reset link via email

    res.status(200).json({message: 'Reset link sent via email'});
}

const resetPassword = (req: Request, res: Response, next: NextFunction) => {
    const { password } = req.body as { email: string, password: string };
    const resetToken  = <string>req.params?.resetToken;

    const error = validationResult(req);
    if(!error.isEmpty()) {
        return next(new HttpError('Invalid inputs', 422));
    }
    console.log(resetToken);

    // find account using reset token and expiry date
    // hash password
    // patch the account to use this password, set token to null and expiry date to undefined

    res.status(200).json({message: 'Password reset successful'});
}

export default { signUp, login, requestResetPassword, resetPassword };