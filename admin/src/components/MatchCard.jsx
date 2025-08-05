import { useState } from 'react';

const MatchCard = ({ match, onEdit, onDelete, editingId, editForm, onUpdate, onCancel, onInputChange }) => {
  const resultOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'teamA', label: 'Team A Won' },
    { value: 'teamB', label: 'Team B Won' },
    { value: 'draw', label: 'Draw' },
    { value: 'no result', label: 'No Result' }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const isUpcoming = match.date && new Date(match.date) > new Date();

  return (
    <div className="w-full bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-all">
      {editingId === match._id ? (
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 w-full">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Team A</label>
                <input
                  type="text"
                  name="teamA"
                  value={editForm.teamA}
                  onChange={onInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <span className="text-gray-500 font-medium mt-6">vs</span>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Team B</label>
                <input
                  type="text"
                  name="teamB"
                  value={editForm.teamB}
                  onChange={onInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <span className="px-4 py-1.5 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800 ml-4">
              Editing
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Match Date</label>
              <input
                type="date"
                name="date"
                value={editForm.date}
                onChange={onInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
              <input
                type="text"
                name="venue"
                value={editForm.venue}
                onChange={onInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Match Result</label>
              <select
                name="result"
                value={editForm.result}
                onChange={onInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {resultOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Team A Score</label>
              <input
                type="text"
                name="scores.teamA"
                value={editForm.scores.teamA}
                onChange={onInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter score"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Team B Score</label>
              <input
                type="text"
                name="scores.teamB"
                value={editForm.scores.teamB}
                onChange={onInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter score"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onCancel}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              onClick={() => onUpdate(match._id)}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-gray-800">
                {match.teamA || 'N/A'} vs {match.teamB || 'N/A'}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {formatDate(match.date)} • {match.venue || 'Venue not specified'}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                isUpcoming ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {isUpcoming ? 'Upcoming' : 'Completed'}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(match)}
                  className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(match._id)}
                  className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Match Result</h4>
              <p className="text-lg font-semibold text-gray-800">
                {resultOptions.find(o => o.value === match.result)?.label || 'Not available'}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Scores</h4>
              <p className="text-lg font-semibold text-gray-800">
                {match.scores?.teamA || 'N/A'} - {match.scores?.teamB || 'N/A'}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Status</h4>
              <p className="text-lg font-semibold text-gray-800">
                {isUpcoming ? 'Scheduled' : 'Match completed'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchCard;