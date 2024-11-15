import bcrypt from "bcrypt";
import validator from "validator";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from 'cloudinary';

const RegisterUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password length should be at least 8 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    const user = await newUser.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ success: true, message: "User registered successfully", token });
  } catch (error) {
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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ success: true, message: "Login successful", token });
  } catch (error) {
    console.error("Error in LoginUser:", error);
    res.status(500).json({ message: "Server error, please try again" });
  }
};

const getUserData = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const userData = await User.findById(userId).select("-password");
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(userData)
    res.json({ success: true, userData });
  } catch (err) {
    console.error("Error in getUserData:", err);
    res.status(500).json({ message: "Server error, please try again" });

  }
};

const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.status(400).json({ success: false, message: "Data incomplete" });
    }

    // Parse the address as an object directly from the request body
    const parsedAddress = address ? JSON.parse(address) : {};

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, phone, address: address, dob, gender },
      { new: true }
    );

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
      const imageUrl = imageUpload.secure_url;

      updatedUser.image = imageUrl;
      await updatedUser.save();
    }

    res.json({ success: true, message: "Profile updated", userData: updatedUser });
  } catch (err) {
    console.error("Error in updateProfile:", err);
    res.status(500).json({ success: false, message: "Server error, please try again" });
  }
};

export { RegisterUser, LoginUser, getUserData, updateProfile };
