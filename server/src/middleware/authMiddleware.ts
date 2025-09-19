import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authServices';
import AuthRequest from '../types/authRequest';

const authService = new AuthService(process.env.JWT_SECRET || 'default_secret');

const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = await authService.verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    
};

export default authMiddleware;