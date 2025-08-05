import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const tournamentSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  organizer: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  format: {
    type: String,
    enum: ['T20', 'ODI', 'Test'],
    default: 'T20',
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Ongoing', 'Completed'],
    default: 'Upcoming',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Tournament = model('Tournament', tournamentSchema);

export default Tournament;
