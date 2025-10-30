import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if(!token) return res.status(401).json({ message: 'Access Denied. No token provided.' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch(err) {
        return res.status(400).json({ message: 'Invalid token.' });
    }
};

export const verifyRole = (roles) => async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        if(!user || !roles.includes(user.userType)) {
            return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
        }
        next();
    } catch(err) {
        return res.status(500).json({ message: 'Server error.' });
    }
};
