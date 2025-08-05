import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import TournamentCard from './TournamentCard';

const TournamentList = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    organizer: '',
    startDate: '',
    endDate: '',
    location: '',
    format: 'T20',
    status: 'Upcoming'
  });

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/tournaments`, {
        withCredentials: true
      });
      setTournaments(Array.isArray(response?.data) ? response.data : []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tournaments');
      console.error('Error fetching tournaments:', err);
      setTournaments([]);
      toast.error('Failed to fetch tournaments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tournament?')) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/tournaments/${id}`, {
        withCredentials: true
      });
      setTournaments(prev => prev.filter(t => t._id !== id));
      toast.success('Tournament deleted successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete tournament');
      console.error('Error deleting tournament:', err);
      toast.error('Failed to delete tournament');
    }
  };

  const handleEdit = (tournament) => {
    setEditingId(tournament._id);
    setEditForm({
      name: tournament.name,
      organizer: tournament.organizer,
      startDate: tournament.startDate ? tournament.startDate.split('T')[0] : '',
      endDate: tournament.endDate ? tournament.endDate.split('T')[0] : '',
      location: tournament.location,
      format: tournament.format,
      status: tournament.status
    });
  };

  const handleUpdate = async (id) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/tournaments/${id}`,
        editForm,
        { withCredentials: true }
      );

      setTournaments(prev =>
        prev.map(t => 
          t._id === id ? response.data : t
        )
      );
      setEditingId(null);
      toast.success('Tournament updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update tournament');
      console.error('Error updating tournament:', err);
      toast.error('Failed to update tournament');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Tournaments Management</h2>

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
          {tournaments.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No tournaments found</p>
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              {tournaments.map((tournament) => (
                <TournamentCard
                  key={tournament._id}
                  tournament={tournament}
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

export default TournamentList;