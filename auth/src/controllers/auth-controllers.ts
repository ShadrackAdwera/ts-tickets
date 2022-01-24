import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/User';
import HttpError from '../models/HttpError';

interface UserProps {
    _id: number,
    email: string;
    password: string;
}

const signUp = async(req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as { email: string, password: string };

    let foundUser: UserProps;
    let hashedPassword: string;
    let token: string;

    const error = validationResult(req);
    if(!error.isEmpty()) {
        return next(new HttpError('Invalid inputs', 422));
    }
    try {
        foundUser = await User.findOne({email}).exec();
    } catch (error) {
        return next(new HttpError('An error occured, try again',500));
    }

    if(foundUser) {
        return next(new HttpError('User exists, log in instead', 403));
    }

    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (error) {
        return next(new HttpError('An error occured, try again',500));
    }

    const user = new User<{
        email: string, password: string, resetToken: any, tokenExpirationDate: any  
    }>({
        email, password, resetToken: null, tokenExpirationDate: undefined
    });

    try {
        await user.save()
    } catch (error) {
        return next(new HttpError('An error occured, try again',500));
    }

    try {
        token = jwt.sign({ id: user._id.toString(), email }, 'jsonsupersecretkey',  { expiresIn: '1h' });
    } catch (error) {
        return next(new HttpError('An error occured, login to continue',500));
    }
    res.status(201).json({message: 'Sign up successful', user: { id: user._id.toString(), email, token }});
} 

const login = async(req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as { email: string, password: string };
    let foundUser: UserProps;
    let isPassword: boolean;
    let token: string;

    const error = validationResult(req);
    if(!error.isEmpty()) {
        return next(new HttpError('Invalid inputs', 422));
    }

    try {
        foundUser = await User.findOne({email}).exec();
    } catch (error) {
        return next(new HttpError('An error occured, try again',500));
    }

    if(!foundUser) {
        return next(new HttpError('This account does not exist, sign up in instead', 403));
    }

    try {
        isPassword = await bcrypt.compare(password, foundUser.password);
    } catch (error) {
        return next(new HttpError('An error occured, try again',500));
    }

    if(!isPassword) {
        return next(new HttpError('Invalid password', 422));
    }
    try {
        token = jwt.sign({ id: foundUser._id.toString(), email }, 'jsonsupersecretkey',  { expiresIn: '1h' });
    } catch (error) {
        return next(new HttpError('An error occured, login to continue',500));
    }

    res.status(200).json({message: 'Login successful', user: { id: foundUser._id.toString(), email, token }});
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