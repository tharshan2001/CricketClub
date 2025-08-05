import Player from '../models/playerModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import TempUser from '../models/TempUser.js';
import { sendEmail } from '../utils/emailHandler.js';  


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//register
export const createPlayer = async (req, res) => {
  try {
    const { password, email, ...otherData } = req.body;
    if (!password) return res.status(400).json({ message: 'Password is required' });
    if (!email) return res.status(400).json({ message: 'Email is required' });

    // Check if a player with this email already exists
    const existingPlayer = await Player.findOne({ email });
    if (existingPlayer) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    // Check if the TempUser with this email exists and is verified
    const tempUser = await TempUser.findOne({ email });
    if (!tempUser || !tempUser.verified) {
      return res.status(400).json({ message: 'Email not verified. Please verify OTP before registering.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create new player
    const newPlayer = new Player({
      email,
      ...otherData,
      passwordHash,
      isVerified: true,
    });

    await newPlayer.save();

    // Send welcome email
    const emailSubject = 'Welcome to CrickNex Club!';
    const emailBody = `
      <h1>Welcome to CrickNex Club, ${otherData.name || 'Player'}!</h1>
      <p>Thank you for registering with us. We're excited to have you on board.</p>
      <p>Happy playing!</p>
      <br/>
      <p>— The CrickNex Club Team</p>
    `;

    try {
      await sendEmail({
        to: email,
        subject: emailSubject,
        html: emailBody,
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // You can decide if this should affect the registration success or not
      // Usually you don't want to fail registration due to email sending issues
    }

    // Delete the TempUser after successful registration
    await TempUser.deleteOne({ email });

    // Exclude passwordHash from response
    const { passwordHash: _, ...playerData } = newPlayer.toObject();

    res.status(201).json(playerData);
  } catch (error) {
    res.status(500).json({ message: 'Error creating player', error: error.message });
  }
};


// Login
export const loginPlayer = async (req, res) => {
  try {
    const { email, password } = req.body;

    const player = await Player.findOne({ email });
    if (!player) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, player.passwordHash);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: player._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { passwordHash, ...playerData } = player.toObject();
    res.status(200).json({ message: 'Login successful', player: playerData });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all players
export const getAllPlayers = async (req, res) => {
  try {
    const players = await Player.aggregate([
      {
        $addFields: {
          performanceScore: {
            $add: [
              { $multiply: ['$performance.runs', 1] },
              { $multiply: ['$performance.wickets', 20] },
              { $multiply: ['$performance.hundreds', 50] },
              { $multiply: ['$performance.fifties', 20] },
              { $multiply: ['$performance.strikeRate', 2] },
              { $multiply: ['$performance.matchesPlayed', 1] }
            ]
          }
        }
      },
      {
        $sort: { performanceScore: -1 } // descending order: highest first
      },
      {
        $project: { passwordHash: 0 } // exclude sensitive data
      }
    ]);

    res.status(200).json(players);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching players', error: error.message });
  }
};


// Get player by ID (from token)
export const getPlayerById = async (req, res) => {
  try {
    const id = req.user._id;

    const player = await Player.findById(id).select('-passwordHash');
    if (!player) return res.status(404).json({ message: 'Player not found' });

    res.status(200).json(player);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching player', error: error.message });
  }
};

// Update player (from token)
export const updatePlayer = async (req, res) => {
  try {
    const id = req.user._id;
    const updatedData = req.body;

    const updatedPlayer = await Player.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    }).select('-passwordHash');

    if (!updatedPlayer) return res.status(404).json({ message: 'Player not found' });

    res.status(200).json(updatedPlayer);
  } catch (error) {
    res.status(500).json({ message: 'Error updating player', error: error.message });
  }
};

// Delete player (from token)
export const deletePlayer = async (req, res) => {
  try {
    const { id } = req.params; // <-- Use req.params, not req.user

    const deletedPlayer = await Player.findByIdAndDelete(id);
    if (!deletedPlayer) return res.status(404).json({ message: 'Player not found' });

    if (deletedPlayer.imagePath) {
      const imagePath = path.join(__dirname, '../uploads', path.basename(deletedPlayer.imagePath));
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    res.status(200).json({ message: 'Player deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting player', error: error.message });
  }
};


export const uploadPlayerImage = async (req, res) => {
  try {
    const id = req.body.id;  // get id from request body

    const player = await Player.findById(id);
    if (!player) return res.status(404).json({ message: 'Player not found' });
    if (!req.file) return res.status(400).json({ message: 'No image uploaded' });

    if (player.imagePath) {
      const oldImagePath = path.join(__dirname, '../uploads', path.basename(player.imagePath));
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
    }

    player.imagePath = `/uploads/${req.file.filename}`;
    await player.save();

    res.status(200).json({ message: 'Image uploaded successfully', imagePath: player.imagePath });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload image', error: error.message });
  }
};

export const removePlayerImage = async (req, res) => {
  try {
    const id = req.body.id;  // get id from request body

    const player = await Player.findById(id);
    if (!player || !player.imagePath) {
      return res.status(404).json({ message: 'Image not found for player' });
    }

    const imageFile = path.join(__dirname, '../uploads', path.basename(player.imagePath));
    if (fs.existsSync(imageFile)) fs.unlinkSync(imageFile);

    player.imagePath = '';
    await player.save();

    res.status(200).json({ message: 'Image removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove image', error: error.message });
  }
};



// Get logged-in player's profile
export const getPlayerProfile = async (req, res) => {
  try {
    const player = await Player.findById(req.user._id).select('-passwordHash -otp');
    if (!player) return res.status(404).json({ message: 'Player not found' });

    res.status(200).json(player);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
};

// Logout player
export const logoutPlayer = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.status(200).json({ message: 'Logout successful' });
};



export const updatePerformanceController = async (req, res) => {
  try {
    const playerId = req.params.id; // 👈 make sure this matches route param
    const { performance } = req.body;

    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    player.performance = performance; // 👈 assumes your Player schema allows this

    await player.save();

    res.status(200).json(player);
  } catch (error) {
    console.error('Update performance error:', error);
    res.status(500).json({ message: 'Server error while updating performance' });
  }
};


// Get top 6 featured players based on performance
export const getFeaturedPlayers = async (req, res) => {
  try {
    const featuredPlayers = await Player.aggregate([
      {
        $addFields: {
          performanceScore: {
            $add: [
              { $multiply: ['$performance.runs', 1] },
              { $multiply: ['$performance.wickets', 20] },
              { $multiply: ['$performance.hundreds', 50] },
              { $multiply: ['$performance.fifties', 20] },
              { $multiply: ['$performance.strikeRate', 2] },
              { $multiply: ['$performance.matchesPlayed', 1] }
            ]
          }
        }
      },
      {
        $sort: { performanceScore: -1 }
      },
      {
        $limit: 6
      },
      {
        $project: { passwordHash: 0 } 
      }
    ]);

    res.status(200).json(featuredPlayers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch featured players', error: error.message });
  }
};
