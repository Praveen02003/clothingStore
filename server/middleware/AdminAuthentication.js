const AdminAuthentication = (req, res, next) => {
    if (req.role !== "admin") {
        return res.status(403).json({ message: "admin only access" });
    }
    next();
};

module.exports = AdminAuthentication;