const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).send({ message: "Authorization token missing" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }else if(user.device_id.toString() != decoded.device_id.toString()){
            return res.status(401).send({ message: "Invalid or expired token" });
        }else{
            req.user = user;
            next();
        }
    } catch (error) {
        return res.status(401).send({ message: "Invalid or expired token" });
    }
};

module.exports = authMiddleware;