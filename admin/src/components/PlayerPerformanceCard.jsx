import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Shirt } from 'lucide-react';

const PlayerPerformanceCard = ({ player, onUpdate, onDelete }) => {
  // Initialize with default performance values if not provided
  const defaultPerformance = {
    matchesPlayed: 0,
    hundreds: 0,
    fifties: 0,
    strikeRate: 0,
    runs: 0,
    wickets: 0
  };

  const [editing, setEditing] = useState(false);
  const [performance, setPerformance] = useState(player.performance || defaultPerformance);
  const [loading, setLoading] = useState(false);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    // Handle different types of image paths
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) {
      return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:6030'}${imagePath}`;
    }
    return imagePath;
  };

  const imageUrl = getImageUrl(player.imagePath);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPerformance(prev => ({
      ...prev,
      [name]: Number(value) || 0
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/players/${player._id}/performance`,
        { performance },
        { withCredentials: true }
      );
      
      onUpdate(response.data);
      toast.success('Performance updated successfully');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update performance');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          {imageUrl ? (
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
              <img 
                src={imageUrl}
                alt={player.fullName}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '';
                  e.target.parentElement.classList.add('bg-gray-200');
                  e.target.parentElement.innerHTML = '<Shirt className="w-10 h-10 text-gray-500" />';
                }}
              />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
              <Shirt className="w-10 h-10 text-gray-500" />
            </div>
          )}
          
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{player.fullName}</h3>
                <p className="text-gray-600">{player.email}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {player.preferredRole} • {player.gender} • {formatDate(player.dateOfBirth)}
                </p>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditing(!editing)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                >
                  {editing ? 'Cancel' : 'Edit'}
                </button>
                <button
                  onClick={() => onDelete(player._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {editing ? (
            <>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Matches Played</label>
                  <input
                    type="number"
                    name="matchesPlayed"
                    value={performance.matchesPlayed}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Runs</label>
                  <input
                    type="number"
                    name="runs"
                    value={performance.runs}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Wickets</label>
                  <input
                    type="number"
                    name="wickets"
                    value={performance.wickets}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hundreds</label>
                  <input
                    type="number"
                    name="hundreds"
                    value={performance.hundreds}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fifties</label>
                  <input
                    type="number"
                    name="fifties"
                    value={performance.fifties}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Strike Rate</label>
                  <input
                    type="number"
                    name="strikeRate"
                    value={performance.strikeRate}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="md:col-span-2 flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Batting Performance</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Matches</p>
                    <p className="text-lg font-semibold">{performance.matchesPlayed}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Runs</p>
                    <p className="text-lg font-semibold">{performance.runs}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">SR</p>
                    <p className="text-lg font-semibold">{performance.strikeRate?.toFixed?.(2) || '0.00'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">100s</p>
                    <p className="text-lg font-semibold">{performance.hundreds}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">50s</p>
                    <p className="text-lg font-semibold">{performance.fifties}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Bowling Performance</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Matches</p>
                    <p className="text-lg font-semibold">{performance.matchesPlayed}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Wickets</p>
                    <p className="text-lg font-semibold">{performance.wickets}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerPerformanceCard;