import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: /.+\@.+\..+/
  },
  passwordHash: {   
    type: String,
    required: true
  },
  otp: {
    type: Number
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  preferredRole: {
    type: String,
    enum: ['Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper'],
    required: true
  },
  battingStyle: {
    type: String,
    enum: ['Right', 'Left'],
    required: true
  },
  bowlingStyle: {
    type: [String],
    enum: ['Fast', 'Medium', 'Spin', 'Left-arm', 'Right-arm'],
    required: true
  },
  experience: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Professional'],
    required: true
  },
  imagePath: {
    type: String,
    default: ''
  },
  performance: {
    matchesPlayed: { type: Number, default: 0 },
    hundreds: { type: Number, default: 0 },
    fifties: { type: Number, default: 0 },
    strikeRate: { type: Number, default: 0 },
    runs: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 }
  }
});

const Player = mongoose.model('Player', playerSchema);
export default Player;
