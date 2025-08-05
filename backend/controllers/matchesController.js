import Match from '../models/matches.js';

// Create a new match
export const createMatch = async (req, res) => {
  try {
    const match = new Match(req.body);
    await match.save();
    res.status(201).json(match);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all matches
export const getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find().sort({ date: -1 });
    res.status(200).json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a match by ID
export const getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ error: 'Match not found' });
    res.status(200).json(match);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get future matches (date in the future)

// Get future matches (pending only)
export const getFutureMatches = async (req, res) => {
  try {
    const now = new Date();
    const matches = await Match.find({
      date: { $gt: now },
      result: "pending"
    }).sort({ date: 1 });
    res.status(200).json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get past/completed matches
export const getCompletedMatches = async (req, res) => {
  try {
    const matches = await Match.find({
      result: { $ne: 'pending' }
    }).sort({ date: -1 });
    res.status(200).json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update match details (score/result etc.)
export const updateMatch = async (req, res) => {
  try {
    const match = await Match.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!match) return res.status(404).json({ error: 'Match not found' });
    res.status(200).json(match);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a match
export const deleteMatch = async (req, res) => {
  try {
    const match = await Match.findByIdAndDelete(req.params.id);
    if (!match) return res.status(404).json({ error: 'Match not found' });
    res.status(200).json({ message: 'Match deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
