import { mongoose } from "mongoose"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession(); // session of mongoose transaction
  session.startTransaction();

  try {
    const { first_name, last_name, email, password } = req.body;

    const existingUser = await User.findOne({email});

    if (existingUser) {
      const error = new Error("User already exists with this email");
      error.status = 409;
      throw error;
    }

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUsers = await User.create([{first_name, last_name, email, password: hashedPassword}], {session});

    const token = jwt.sign({userId: newUsers[0]._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});

    await session.commitTransaction();
    session.endSession();
        
    res.status(201).json({success: true, message: "User created successfully", user:{token, user: newUsers[0]}});

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.log("Error in signUp", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
}

export const signIn = async (req, res) => {
  try {
    const {email, password} = req.body;

    const user = await User.findOne({email});

    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: "No user found with this email" 
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);  

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid password" 
      });
    }

    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});

    res.status(200).json({
      success: true, 
      message: "User signed in successfully", 
      user:{
        token, 
        user
      }
    });
    
  } catch (error) {

    console.log("Error in signIn", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
}

// Sign out is handled on the client by deleting the token.
export const signOut = async (req, res) => {
  try {    
    res.status(200).json({
      success: true,
      message: "User signed out successfully"
    });
  } catch (error) {
    console.log("Error in signOut", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}