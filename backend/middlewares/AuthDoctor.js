import jwt from 'jsonwebtoken';

const authDoctor = async (req, res, next) => {
    try {
        const { dtoken } = req.headers;

        console.log(dtoken)
        if (!dtoken) {
            return res.status(401).json({ success: false, message: 'Not authorized, please login again' });
        }

        const tokenDecoded = jwt.verify(dtoken, process.env.JWT_SECRET);

        console.log(tokenDecoded)

        req.body.docId=tokenDecoded.id
        next();
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

export default authDoctor;
