import bcrypt from 'bcrypt';
import validator from 'validator';
import User from '../models/UserModel.js';
import jwt from  'jsonwebtoken'
const RegisterUser = async (req, res) => {
    try {
    
        const { name, email, password } = req.body;

        
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        if(password.length<8)
        {
            return res.status(400).json({ message: "password length should be alteast 8 characters" });
        }


        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered" });
        }

        
        const hashedPassword = await bcrypt.hash(password, 10);

    
        const newUser = new User({ name, email, password: hashedPassword });
         const user=await newUser.save();
         console.log(user)

        const token=jwt.sign({id:user._id},process.env.JWT_SECRET)

        res.status(201).json({ success:true,message: "User registered successfully",token });
    } 
    
    catch (error) {
        console.error("Error in RegisterUser:", error);
        res.status(500).json({ message: "Server error, please try again" });
    }
};


const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Both email and password are required" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }


        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Incorrect password" });
        }

    
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ success: true, message: "Login successful", token });
    } catch (error) {
        console.error("Error in LoginUser:", error);
        res.status(500).json({ message: "Server error, please try again" });
    }
};

export { RegisterUser,LoginUser};
