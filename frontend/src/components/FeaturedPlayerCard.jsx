import { Link } from "react-router-dom";

// Load the API base URL from environment or use a fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:6030";

const FeaturedPlayerCard = ({ player }) => {
  // Construct the full image URL
  const imageUrl = player?.imagePath
    ? player.imagePath.startsWith("http")
      ? player.imagePath
      : `${API_BASE_URL}${player.imagePath}`
    : "hh";

  return (
    <div className="relative group overflow-hidden rounded-xl bg-gray-800 border border-gray-700 hover:border-amber-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-amber-500/10">
      {/* Player Image with fallback */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={imageUrl}
          alt={player?.fullName || "Player"}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/default-player.jpg";
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent" />
      </div>

      {/* Player Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-xl font-bold text-white">{player?.fullName}</h3>
            <p className="text-amber-400 text-sm">
              {player?.preferredRole || "Player"}
            </p>
          </div>
        </div>
      </div>

      {/* Clickable overlay */}
      <Link 
        className="absolute inset-0 z-10"
        aria-label={`View ${player?.fullName}'s profile`}
      >
        <span className="sr-only">View player</span>
      </Link>
    </div>
  );
};

export default FeaturedPlayerCard;
