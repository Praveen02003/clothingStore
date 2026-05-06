const jwt = require('jsonwebtoken');
var secretKey = process.env.JWT_SECRET_KEY

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'Access denied' });
    }
    else {
        try {
            const decoded = jwt.verify(token, secretKey);
            console.log(decoded, "===>");

            req.userId = decoded.userId;
            req.role = decoded.role;
            next();
        } catch (error) {
            console.log(error);
            res.status(401).json({ message: 'Invalid token' });
        }
    }
};
module.exports = verifyToken