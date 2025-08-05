import { Shirt, ChevronRight, X } from 'lucide-react';
import Card from '../../components/ui/Card';

const Bat = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M17 17l-4-4m0 0l-4-4m4 4l-4 4m4-4l4 4" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const Ball = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <circle cx="12" cy="12" r="10" strokeWidth="2" />
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" strokeWidth="2" />
  </svg>
);

const PlayerCard = ({ player }) => {
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    return imagePath.startsWith('http') 
      ? imagePath 
      : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:6030'}${imagePath}`;
  };

  const imageUrl = getImageUrl(player.imagePath);
  const performance = player.performance || {};

  return (
    <div className="relative w-64 h-[420px] group">
      {/* Base Card - Dark Theme */}
      <Card className="bg-gray-800 rounded-lg overflow-hidden h-full flex flex-col border border-gray-700 transition-all hover:border-amber-500">
        {/* Player Portrait */}
        <div className="relative pt-8 pb-4 flex items-center justify-center bg-gradient-to-b from-gray-700 to-gray-800">
          {imageUrl ? (
            <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-gray-700 shadow-lg group-hover:border-amber-500 transition-colors">
              <img 
                src={imageUrl}
                alt={player.fullName}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '';
                  e.target.parentElement.classList.add('bg-gray-700');
                }}
              />
            </div>
          ) : (
            <div className="h-32 w-32 rounded-full bg-gray-700 flex items-center justify-center group-hover:bg-gray-600 transition-colors">
              <Shirt className="w-16 h-16 text-gray-500" />
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="p-4 flex-1 flex flex-col items-center text-center">
          <h3 className="text-lg font-semibold text-white mb-1">{player.fullName}</h3>
          
          {/* Primary Role */}
          <div className="flex items-center gap-2 mb-4 text-amber-400">
            <Shirt className="w-4 h-4" />
            <span className="text-sm capitalize">{player.preferredRole}</span>
          </div>

          {/* Basic Info */}
          <div className="w-full grid grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col items-center">
              <Bat className="w-6 h-6 text-gray-400 mb-1" />
              <span className="text-xs text-gray-400">Batting</span>
              <span className="text-sm font-medium text-white">
                {player.battingStyle || '-'}
              </span>
            </div>
            
            <div className="flex flex-col items-center">
              <Ball className="w-6 h-6 text-gray-400 mb-1" />
              <span className="text-xs text-gray-400">Bowling</span>
              <span className="text-sm font-medium text-white">
                {player.bowlingStyle?.[0] || '-'}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Hover Overlay - Dark Theme */}
      <div className="absolute inset-0 bg-gray-800 rounded-lg shadow-xl border border-amber-500 p-6 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 flex flex-col z-10 overflow-auto">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white">{player.fullName}</h3>
          <button className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          <h4 className="text-sm font-semibold text-amber-400 mb-3 uppercase tracking-wider">
            Performance Stats
          </h4>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-700 p-3 rounded-lg">
              <p className="text-2xl font-bold text-white">{performance.matchesPlayed || 0}</p>
              <p className="text-xs text-gray-400">Matches Played</p>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg">
              <p className="text-2xl font-bold text-white">{performance.runs || 0}</p>
              <p className="text-xs text-gray-400">Total Runs</p>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg">
              <p className="text-2xl font-bold text-white">{performance.wickets || 0}</p>
              <p className="text-xs text-gray-400">Wickets Taken</p>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg">
              <p className="text-2xl font-bold text-white">{performance.strikeRate || 0}</p>
              <p className="text-xs text-gray-400">Strike Rate</p>
            </div>
          </div>

          {(performance.hundreds || performance.fifties) && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-amber-400 mb-2 uppercase tracking-wider">
                Milestones
              </h4>
              <div className="flex gap-4">
                {performance.hundreds && (
                  <div className="bg-amber-900/30 p-3 rounded-lg flex-1 border border-amber-800">
                    <p className="text-2xl font-bold text-amber-400">{performance.hundreds}</p>
                    <p className="text-xs text-amber-300">Centuries</p>
                  </div>
                )}
                {performance.fifties && (
                  <div className="bg-blue-900/30 p-3 rounded-lg flex-1 border border-blue-800">
                    <p className="text-2xl font-bold text-blue-400">{performance.fifties}</p>
                    <p className="text-xs text-blue-300">Half-Centuries</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;