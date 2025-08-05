import { useEffect, useState } from 'react';
import axios from 'axios';
import PlayerCard from '../player/PlayerCard';
import { Search, X } from 'lucide-react';

const PlayerList = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get('http://localhost:6030/api/players', {
          withCredentials: true,
        });

        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Invalid data format received from server');
        }

        setPlayers(response.data);
      } catch (err) {
        console.error('Error fetching players:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch players');
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const filteredPlayers = players.filter(player =>
    player.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.preferredRole?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="max-w-md mx-auto p-4 bg-red-50 rounded-lg border border-red-200">
          <h3 className="text-lg font-medium text-red-800">Error loading players</h3>
          <p className="mt-2 text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Player Roster</h1>
        
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name or role..."
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {filteredPlayers.length === 0 ? (
        <div className="text-center py-10">
          <div className="max-w-md mx-auto p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-800">
              {searchTerm ? 'No matching players found' : 'No players available'}
            </h3>
            <p className="mt-2 text-gray-600">
              {searchTerm ? 'Try a different search term' : 'Check back later or add new players'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlayers.map((player) => (
            <div key={player._id || player.id} className="group relative">
              <PlayerCard player={player} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlayerList;