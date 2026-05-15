// ConsumerAuthentication function
const ConsumerAuthentication = (req, res, next) => {
    console.log(req.role);
    
    if (req.role !== "user") {
        return res.status(403).json({ message: "user only access " });
    }
    next();
};

module.exports = ConsumerAuthentication;