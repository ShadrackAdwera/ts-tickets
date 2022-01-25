import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { Document } from 'mongoose';
import brypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/User';
import HttpError from '../models/HttpError';

interface UserProps extends Document {
    email: string;
    password: string;
    resetToken: any;
    tokenExpirationDate: any;
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

    const user: UserProps = new User<{
        email: string, password: string, resetToken: any, tokenExpirationDate: any  
    }>({
        email, password: hashedPassword, resetToken: null, tokenExpirationDate: undefined
    });

    try {
        await user.save()
    } catch (error) {
        return next(new HttpError('An error occured, try again',500));
    }

    try {
        token = jwt.sign({ id: user._id.toString() , email }, 'jsonsupersecretkey',  { expiresIn: '1h' });
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

const requestResetPassword = async(req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body as { email: string };
    let foundUser: UserProps;

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

    const authToken = brypto.randomBytes(64).toString('hex');
    const tokenExpiration = Date.now() + 3600000;
    foundUser.resetToken = authToken;
    foundUser.tokenExpirationDate = new Date(tokenExpiration);
    // send reset link via email--- https://your-site/${resetToken}/reset-password

    try {
        await foundUser.save();
    } catch (error) {
        
    }

    res.status(200).json({message: 'Reset link sent via email'});
}

const resetPassword = async(req: Request, res: Response, next: NextFunction) => {
    const { password } = req.body as { email: string, password: string };
    const resetToken  = <string>req.params?.resetToken;
    let foundUser: UserProps;
    let newPassword: string;

    const error = validationResult(req);
    if(!error.isEmpty()) {
        return next(new HttpError('Invalid inputs', 422));
    }

    try {
        foundUser = await User.findOne({resetToken, tokenExpirationDate: { $gt: Date.now() }});
    } catch (error) {
        return next(new HttpError('An error occured, try again',500));
    }

    try {
        newPassword = await bcrypt.hash(password, 12);
    } catch (error) {
        return next(new HttpError('An error occured, try again',500));
    }

    foundUser.password = newPassword;
    foundUser.resetToken = null;
    foundUser.tokenExpirationDate = undefined;
    
    try {
        await foundUser.save();
    } catch (error) {
        return next(new HttpError('An error occured, try again',500));
    }
    res.status(200).json({message: 'Password reset successful'});
}

export default { signUp, login, requestResetPassword, resetPassword };