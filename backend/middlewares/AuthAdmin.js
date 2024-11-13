import jwt from 'jsonwebtoken';

const authAdmin = async (req, res, next) => {
    try {
        const { atoken } = req.headers;

        console.log(atoken)
        if (!atoken) {
            return res.status(401).json({ success: false, message: 'Not authorized, please login again' });
        }

        const tokenDecoded = jwt.verify(atoken, process.env.JWT_SECRET);

        if (tokenDecoded.email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json({ success: false, message: 'Not authorized to login' });
        }

        next();
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

export default authAdmin;
