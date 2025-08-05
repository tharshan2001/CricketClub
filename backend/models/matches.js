import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  teamA: {
    type: String,
    required: true
  },
  teamB: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  result: {
    type: String,
    enum: ['teamA', 'teamB', 'draw', 'no result', 'pending'],
    default: 'pending'
  },
  scores: {
    teamA: {
      type: String,
      default: null // e.g., "150/7 in 20 overs"
    },
    teamB: {
      type: String,
      default: null
    }
  }
}, {
  timestamps: true
});

const Match = mongoose.model('Match', matchSchema);
export default Match;
