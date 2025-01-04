const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token verified successfully:", verified);
        req.user = verified;
        next();
    } catch (error) {
        console.error("Token verification failed:", error.message);
        res.status(403).json({ error: "Invalid or expired token." });
    }
};

const authorizeRole = (requiredRole) => (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
        console.log(`Access forbidden: required role ${requiredRole}, but user role is ${req.user?.role || "Unknown"}`);
        return res.status(403).json({ error: `Access forbidden for role: ${req.user?.role || "Unknown"}` });
    }
    console.log(`Access granted for role: ${req.user.role}`);
    next();
};

module.exports = { authenticateToken, authorizeRole };
