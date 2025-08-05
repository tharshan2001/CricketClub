import TempUser from '../models/TempUser.js';
import User from '../models/playerModel.js'; 
import { sendEmail } from '../utils/emailHandler.js';

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export const createTempUser = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    // Check if player already exists (fully registered)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered!' });
    }

    // Check if OTP already sent and still valid
    const existingTemp = await TempUser.findOne({ email });
    const now = new Date();

    if (existingTemp && existingTemp.otpExpires > now) {
      return res.status(200).json({ message: 'OTP already sent. Please wait until it expires.' });
    }

    // Generate new OTP and expiry
    const otp = generateOtp();
    const otpExpires = new Date(now.getTime() + 2 * 60 * 1000); // 2 minutes expiry

    // Upsert temp user record
    const tempUser = await TempUser.findOneAndUpdate(
      { email },
      { otp, otpExpires, verified: false },
      { upsert: true, new: true }
    );

    // Send OTP email
    await sendEmail({
      to: email,
      subject: 'Your OTP Code for CrickNex Club',
      html: `<p>Your OTP code is <strong>${otp}</strong>. It will expire in 2 minutes.</p>`,
    });

    res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error('Error sending OTP email:', error);
    res.status(500).json({ message: 'Failed to send OTP', error: error.message });
  }
};

export const verifyTempOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

    const tempUser = await TempUser.findOne({ email });
    if (!tempUser) {
      return res.status(404).json({ message: 'No OTP request found for this email' });
    }

    if (tempUser.otpExpires < new Date()) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    if (tempUser.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    tempUser.verified = true;
    await tempUser.save();

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to verify OTP', error: error.message });
  }
};
