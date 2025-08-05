import { useEffect, useState } from "react";
import axios from "axios";
import FeaturedPlayerCard from "./FeaturedPlayerCard";

const FeaturedPlayersList = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:6030/api/players/players/featured", {
          withCredentials: true,
        });

        if (!Array.isArray(res.data)) {
          throw new Error("Unexpected response format");
        }

        setPlayers(res.data);
        setError(null);
      } catch (err) {
        setError("Failed to load featured players");
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin h-10 w-10 border-t-4 border-blue-500 rounded-full"></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-6">
        {error}
      </div>
    );
  }

  if (!players.length) {
    return (
      <div className="text-center py-6 text-gray-400">
        No featured players found.
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-20 mx-10">
      <h2 className="text-2xl font-bold text-amber-600">Featured Players</h2>
      <div className="grid grid-cols-6 gap-6">
        {players.slice(0, 6).map((player) => (
          <FeaturedPlayerCard key={player._id || player.id} player={player} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedPlayersList;