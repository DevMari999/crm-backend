import {Request, Response} from 'express';

import {
    findUserById,
    generateActivationLink, loginUser,
    RefreshTokenService,
    registerUser,
    setUserPassword
} from "../services/auth.services";
import {NewRequest} from "../types/request.types";
import {CookieOptions} from 'express';

export const register = async (req: Request, res: Response) => {
    try {
        const {name, email, lastname} = req.body;

        const registrationError = await registerUser(name, email, lastname);
        if (registrationError) {
            return res.status(400).json({message: registrationError});
        }

        res.status(201).json({message: 'Manager registered successfully.'});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: error.message});
    }
};


export const login = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;

        const tokens = await loginUser(email, password);
        if (!tokens) {
            return res.status(401).send({message: 'Authentication failed'});
        }

        const {accessToken, refreshToken, expiresIn} = tokens;

        res.cookie('token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            expires: new Date(Date.now() + 3600000)
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            expires: new Date(Date.now() + expiresIn)
        });
        res.status(200).send({message: 'Login successful'});
    } catch (error) {

        res.status(500).send(error);
    }
};


export const logout = (req: Request, res: Response) => {
    const cookieOptions: CookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    };

    res.clearCookie('token', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);

    return res.status(200).send({message: 'Logout successful'});
};


export const generateLink = async (req: Request, res: Response) => {
    try {
        const {userId} = req.params;

        const activationLink = await generateActivationLink(userId);

        res.json({message: 'Activation link generated.', activationLink});
    } catch (error) {

        res.status(500).json({message: error.message});
    }
};
export const setPassword = async (req: Request, res: Response) => {
    try {
        const { activationToken, newPassword } = req.body;

        console.log('Attempting to set password with activationToken:', activationToken);

        await setUserPassword(activationToken, newPassword);

        console.log('Password set successfully. Your account is now active.');

        res.status(200).send({ message: 'Password set successfully. Your account is now active.' });
    } catch (error) {
        console.error('Error during password set:', error.message);
        res.status(500).send({ message: error.message });
    }
};


export const getUserDetails = async (req: NewRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({message: 'Not authenticated'});
        }

        const user = await findUserById(req.user._id);

        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        res.json({
            userId: user._id,
            email: user.email,
            name: user.name,
            lastname: user.lastname,
            role: user.role,

        });
    } catch (error) {

        res.status(500).json({message: 'Internal server error'});
    }
};


export const refresh = async (req: Request, res: Response) => {

    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) {
        return res.status(400).send({message: 'Refresh token is required'});
    }

    const newAccessToken = await RefreshTokenService.refreshAccessToken(refreshToken);

    if (newAccessToken) {
        return res.status(200).send({accessToken: newAccessToken});
    } else {
        return res.status(401).send({message: 'Failed to refresh access token'});
    }
};
