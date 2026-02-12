import jwt from "jsonwebtoken";

export const checkAuth = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        req.user = null;
        return next();
    }

    try {
        const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = verified;
    } catch (error) {
        req.user = null;
    }
    next();
};
