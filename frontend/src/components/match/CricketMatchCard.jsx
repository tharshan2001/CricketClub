import Card from "../../components/ui/Card";  
import Badge from "../../components/ui/Card";
import { Clock, MapPin, TrendingUp } from "lucide-react";

const getStatusColor = (status) => {
  switch (status) {
    case "upcoming":
      return "bg-blue-500 text-white";
    case "completed":
      return "bg-green-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "upcoming":
      return <Clock className="w-3 h-3" />;
    case "completed":
      return <TrendingUp className="w-3 h-3" />;
    default:
      return null;
  }
};

const getTeamShortName = (teamName) => {
  return teamName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 3);
};

const CricketMatchCard = ({ match, isUpcoming }) => {
  const matchDate = new Date(match.date);
  const formattedDate = matchDate.toLocaleDateString();
  const formattedTime = matchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <Card className={`
      bg-white shadow-md hover:shadow-lg 
      transition-all duration-300 hover:scale-[1.02]
      border-l-4 overflow-hidden
      ${isUpcoming ? 'border-l-blue-500' : 'border-l-green-500'}
      p-6 mb-4
    `}>
      {/* Header with Status */}
      <div className="flex items-center justify-between mb-4">
        <Badge className={`${getStatusColor(match.status)} flex items-center gap-1.5 px-3 py-1`}>
          {getStatusIcon(match.status)}
          {match.status.toUpperCase()}
        </Badge>
      </div>

      {/* Teams Section */}
      <div className="space-y-4 mb-4">
        {/* Team A */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {getTeamShortName(match.teamA)}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{match.teamA}</h3>
              {!isUpcoming && match.scores?.teamA && (
                <p className="text-sm text-gray-600">
                  {match.scores.teamA}
                </p>
              )}
            </div>
          </div>
          {!isUpcoming && match.scores?.teamA && (
            <div className="text-right">
              <span className="text-lg font-bold text-gray-800">{match.scores.teamA}</span>
            </div>
          )}
        </div>

        {/* VS Divider */}
        <div className="flex items-center justify-center">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-3 text-sm font-medium text-gray-500 bg-white">
            vs
          </span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* Team B */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {getTeamShortName(match.teamB)}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{match.teamB}</h3>
              {!isUpcoming && match.scores?.teamB && (
                <p className="text-sm text-gray-600">
                  {match.scores.teamB}
                </p>
              )}
            </div>
          </div>
          {!isUpcoming && match.scores?.teamB && (
            <div className="text-right">
              <span className="text-lg font-bold text-gray-800">{match.scores.teamB}</span>
            </div>
          )}
        </div>
      </div>

      {/* Result for completed matches */}
      {!isUpcoming && match.result && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          {match.result === 'draw' ? (
            <p className="text-sm font-medium text-gray-700">Match ended in a draw</p>
          ) : match.result === 'no result' ? (
            <p className="text-sm font-medium text-gray-700">No result (abandoned)</p>
          ) : (
            <p className="text-sm font-medium text-gray-700">
              <span className="font-bold">
                {match.result === 'teamA' ? match.teamA : match.teamB}
              </span> won the match
            </p>
          )}
        </div>
      )}

      {/* Match Details */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          <span>{match.venue}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{formattedDate} • {formattedTime}</span>
        </div>
      </div>
    </Card>
  );
};

export default CricketMatchCard;