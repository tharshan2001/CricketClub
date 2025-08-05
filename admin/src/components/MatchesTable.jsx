import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import MatchCard from './MatchCard';

const MatchesTable = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    teamA: '',
    teamB: '',
    date: '',
    venue: '',
    result: 'pending',
    scores: {
      teamA: '',
      teamB: ''
    }
  });

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/matches`, {
        withCredentials: true
      });
      setMatches(Array.isArray(response?.data) ? response.data : []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch matches');
      console.error('Error fetching matches:', err);
      setMatches([]);
      toast.error('Failed to fetch matches');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this match?')) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/matches/${id}`, {
        withCredentials: true
      });
      setMatches(prevMatches => prevMatches.filter(match => match._id !== id));
      toast.success('Match deleted successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete match');
      console.error('Error deleting match:', err);
      toast.error('Failed to delete match');
    }
  };

  const handleEdit = (match) => {
    setEditingId(match._id);
    setEditForm({
      teamA: match.teamA,
      teamB: match.teamB,
      date: match.date ? match.date.split('T')[0] : '',
      venue: match.venue || '',
      result: match.result || 'pending',
      scores: {
        teamA: match.scores?.teamA || '',
        teamB: match.scores?.teamB || ''
      }
    });
  };

  const handleUpdate = async (id) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/matches/${id}`,
        editForm,
        { withCredentials: true }
      );

      setMatches(prevMatches =>
        prevMatches.map(match =>
          match._id === id ? response.data : match
        )
      );
      setEditingId(null);
      toast.success('Match updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update match');
      console.error('Error updating match:', err);
      toast.error('Failed to update match');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('scores.')) {
      const scoreField = name.split('.')[1];
      setEditForm(prev => ({
        ...prev,
        scores: {
          ...prev.scores,
          [scoreField]: value
        }
      }));
    } else {
      setEditForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Matches Management</h2>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded" role="alert">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No matches found</p>
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              {matches.map((match) => (
                <MatchCard
                  key={match._id}
                  match={match}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  editingId={editingId}
                  editForm={editForm}
                  onUpdate={handleUpdate}
                  onCancel={handleCancel}
                  onInputChange={handleInputChange}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MatchesTable;
