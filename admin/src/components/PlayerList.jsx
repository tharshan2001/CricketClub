import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import PlayerPerformanceCard from './PlayerPerformanceCard';

const PlayerList = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/players`, {
          withCredentials: true
        });
        setPlayers(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch players');
        toast.error('Failed to fetch players');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const handleUpdatePlayer = (updatedPlayer) => {
    setPlayers(players.map(player => 
      player._id === updatedPlayer._id ? updatedPlayer : player
    ));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this player?')) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/players/${id}`, {
        withCredentials: true
      });
      setPlayers(players.filter(player => player._id !== id));
      toast.success('Player deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete player');
    }
  };

  const filteredPlayers = players.filter(player =>
    player.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.preferredRole.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4">
      <p>{error}</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Players Management</h1>
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search players..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
      </div>

      {filteredPlayers.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">
            {searchTerm ? 'No players match your search' : 'No players found'}
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredPlayers.map(player => (
            <PlayerPerformanceCard
              key={player._id}
              player={player}
              onUpdate={handleUpdatePlayer}
              onDelete={() => handleDelete(player._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PlayerList;