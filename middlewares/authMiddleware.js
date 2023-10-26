const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).send({ message: "Authorization token missing" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Add the decoded token to the request object
        next();
    } catch (error) {
        return res.status(403).send({ message: "Invalid or expired token" });
    }
};

module.exports = authMiddleware;