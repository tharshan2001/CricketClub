import jwt from "jsonwebtoken";
import Player from "../models/playerModel.js";  
import Admin from '../models/adminModel.js';

export const protect = async (req, res, next) => {
  let token;

  try {
    token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach player to request object, exclude sensitive fields (e.g., password, if any)
    req.user = await Player.findById(decoded.id).select("-password -otp"); 

    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, player not found" });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};


// Middleware: Protect admin routes
export const verifyAdmin = async (req, res, next) => {
  const token = req.cookies.admintoken;

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: "Authentication required" 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select("-passwordHash");

    if (!admin) {
      return res.status(401).json({ 
        success: false,
        message: "Admin not found" 
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false,
      message: "Invalid or expired token",
      error: error.message 
    });
  }
};