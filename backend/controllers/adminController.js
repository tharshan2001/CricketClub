import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";

// Register admin
export const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Email and password are required" 
      });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ 
        success: false,
        message: "Admin already exists" 
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({ email, passwordHash });
    await newAdmin.save();

    res.status(201).json({ 
      success: true,
      message: "Admin registered successfully" 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error registering admin", 
      error: error.message 
    });
  }
};

// Login admin and set cookie
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Email and password are required" 
      });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("admintoken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      domain: process.env.NODE_ENV === "development" ? "localhost" : ".yourdomain.com",
      path: "/"
    });

    res.status(200).json({ 
      success: true,
      message: "Login successful",
      admin: {
        id: admin._id,
        email: admin.email
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: error.message 
    });
  }
};

// Logout admin and clear cookie
export const logoutAdmin = (req, res) => {
  res.clearCookie("admintoken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    domain: process.env.NODE_ENV === "development" ? "localhost" : ".yourdomain.com",
    path: "/"
  });
  
  res.status(200).json({ 
    success: true,
    message: "Logged out successfully" 
  });
};

// Get admin profile
export const getAdminProfile = (req, res) => {
  if (!req.admin) {
    return res.status(401).json({ 
      success: false,
      message: "Not authorized" 
    });
  }

  res.status(200).json({
    success: true,
    admin: {
      _id: req.admin._id,
      email: req.admin.email
    }
  });
};
