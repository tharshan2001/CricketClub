import { Clock, Calendar, MapPin, Trophy, Users, Award } from "lucide-react";
import Card from "../../components/ui/Card";
import ProgressBar from "../../components/ui/ProgressBar";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
};

const TournamentCard = ({ tournament }) => {
  const progress = tournament.registeredTeams / tournament.maxTeams * 100;
  const daysRemaining = Math.floor((new Date(tournament.startDate) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <Card className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-700">
      {/* Tournament Header with Gradient */}
      <div className={`relative h-32 ${getTournamentGradient(tournament.status)}`}>
        <div className="absolute top-4 left-4">
          <div className="flex items-center gap-2 bg-gray-900/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-medium text-white">{tournament.game}</span>
          </div>
        </div>
        
        <div className="absolute bottom-4 left-4">
          <h3 className="text-xl font-bold text-white drop-shadow-md">{tournament.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-1 bg-gray-900/50 backdrop-blur-sm rounded-full text-xs font-medium text-white">
              {tournament.prizePool}
            </span>
            <span className="px-2 py-1 bg-gray-900/50 backdrop-blur-sm rounded-full text-xs font-medium text-white">
              {tournament.format}
            </span>
          </div>
        </div>
      </div>

      {/* Tournament Content */}
      <div className="p-5">
        {/* Meta Information */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-400">Date</p>
              <p className="text-sm font-medium text-white">
                {formatDate(tournament.startDate)}
                {tournament.endDate && ` - ${formatDate(tournament.endDate)}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-400">Location</p>
              <p className="text-sm font-medium text-white">
                {tournament.location || 'Online'}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">Registration</span>
            <span className={daysRemaining > 0 ? 'text-amber-400' : 'text-red-400'}>
              {daysRemaining > 0 ? `${daysRemaining}d left` : 'Closing soon'}
            </span>
          </div>
          <ProgressBar 
            value={progress} 
            color={getProgressColor(tournament.status)}
            bgColor="bg-gray-700"
          />
        </div>

        {/* CTA Button */}
        <button className={`w-full py-2 rounded-lg font-medium text-white ${getButtonColor(tournament.status)} hover:opacity-90 transition-opacity`}>
          {getButtonText(tournament.status)}
        </button>
      </div>
    </Card>
  );
};

// Helper functions
const getTournamentGradient = (status) => {
  switch (status.toLowerCase()) {
    case 'upcoming':
      return 'bg-gradient-to-r from-gray-700 to-gray-900';
    case 'ongoing':
      return 'bg-gradient-to-r from-amber-600 to-amber-700';
    case 'completed':
      return 'bg-gradient-to-r from-green-600 to-green-700';
    default:
      return 'bg-gradient-to-r from-gray-700 to-gray-800';
  }
};

const getProgressColor = (status) => {
  switch (status.toLowerCase()) {
    case 'upcoming':
      return 'blue';
    case 'ongoing':
      return 'amber';
    case 'completed':
      return 'green';
    default:
      return 'gray';
  }
};

const getButtonColor = (status) => {
  switch (status.toLowerCase()) {
    case 'upcoming':
      return 'bg-amber-600 hover:bg-amber-700';
    case 'ongoing':
      return 'bg-amber-600 hover:bg-amber-700';
    case 'completed':
      return 'bg-green-600 hover:bg-green-700';
    default:
      return 'bg-gray-600 hover:bg-gray-700';
  }
};

const getButtonText = (status) => {
  switch (status.toLowerCase()) {
    case 'upcoming':
      return 'Register Now';
    case 'ongoing':
      return 'View Bracket';
    case 'completed':
      return 'View Results';
    default:
      return 'Learn More';
  }
};

export default TournamentCard;