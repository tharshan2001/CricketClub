import Tournament from '../models/Tournament.js';

// Create a new tournament
export const createTournament = async (req, res) => {
  try {
    const tournament = new Tournament(req.body);
    await tournament.save();
    res.status(201).json(tournament);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all tournaments
export const getTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find(); 
    res.status(200).json(tournaments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a tournament by ID
export const getTournamentById = async (req, res) => {
  try {
    const { id } = req.params;
    const tournament = await Tournament.findById(id); 
    if (!tournament) return res.status(404).json({ message: 'Tournament not found' });
    res.status(200).json(tournament);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a tournament by ID
export const updateTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTournament = await Tournament.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedTournament) return res.status(404).json({ message: 'Tournament not found' });
    res.status(200).json(updatedTournament);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a tournament by ID
export const deleteTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTournament = await Tournament.findByIdAndDelete(id);
    if (!deletedTournament) return res.status(404).json({ message: 'Tournament not found' });
    res.status(200).json({ message: 'Tournament deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
