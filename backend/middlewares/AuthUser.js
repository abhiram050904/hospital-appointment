import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    try {
        const { token } = req.headers;

        console.log(token)
        if (!token) {
            return res.status(401).json({ success: false, message: 'Not authorized, please login again' });
        }

        const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log(tokenDecoded)

        req.body.userId=tokenDecoded.id
        next();
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

export default authUser;
