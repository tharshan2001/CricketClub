import { useState, useEffect } from 'react';
import axios from 'axios';
import Card from "../../components/ui/Card";  
import Badge from "../../components/ui/Badge";
import { Clock, MapPin, TrendingUp } from "lucide-react";
import MatchScheduleBanner from './MatchScheduleBanner';

const getStatusColor = (status) => {
  switch (status) {
    case "upcoming":
      return "bg-blue-600 text-white";
    case "completed":
      return "bg-green-600 text-white";
    default:
      return "bg-gray-600 text-white";
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
      bg-gray-800 shadow-lg hover:shadow-xl 
      transition-all duration-300 hover:scale-[1.02]
      border-l-4 overflow-hidden
      ${isUpcoming ? 'border-l-blue-500' : 'border-l-gray-600'}
      p-6 h-full
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
              <h3 className="font-semibold text-white">{match.teamA}</h3>
              {!isUpcoming && match.scores?.teamA && (
                <p className="text-sm text-gray-400">
                  {match.scores.teamA}
                </p>
              )}
            </div>
          </div>
          {!isUpcoming && match.scores?.teamA && (
            <div className="text-right">
              <span className="text-lg font-bold text-white">{match.scores.teamA}</span>
            </div>
          )}
        </div>

        {/* VS Divider */}
        <div className="flex items-center justify-center">
          <div className="flex-1 border-t border-gray-700"></div>
          <span className="px-3 text-sm font-medium text-gray-400 bg-gray-800">
            vs
          </span>
          <div className="flex-1 border-t border-gray-700"></div>
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
              <h3 className="font-semibold text-white">{match.teamB}</h3>
              {!isUpcoming && match.scores?.teamB && (
                <p className="text-sm text-gray-400">
                  {match.scores.teamB}
                </p>
              )}
            </div>
          </div>
          {!isUpcoming && match.scores?.teamB && (
            <div className="text-right">
              <span className="text-lg font-bold text-white">{match.scores.teamB}</span>
            </div>
          )}
        </div>
      </div>

      {/* Result for completed matches */}
      {!isUpcoming && match.result && (
        <div className="mb-4 p-3 bg-gray-700 rounded-lg border border-gray-600">
          {match.result === 'draw' ? (
            <p className="text-sm font-medium text-gray-300">Match ended in a draw</p>
          ) : match.result === 'no result' ? (
            <p className="text-sm font-medium text-gray-300">No result (abandoned)</p>
          ) : (
            <p className="text-sm font-medium text-gray-300">
              <span className="font-bold text-white">
                {match.result === 'teamA' ? match.teamA : match.teamB}
              </span> won the match
            </p>
          )}
        </div>
      )}

      {/* Match Details */}
      <div className="flex items-center justify-between text-sm text-gray-400">
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

const MatchSchedule = () => {
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [matches, setMatches] = useState({
    upcoming: [],
    completed: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const [upcomingResponse, completedResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/matches/future`, {
            withCredentials: true
          }),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/matches/completed`, {
            withCredentials: true
          })
        ]);
        
        // Add status to each match
        const upcomingMatches = upcomingResponse.data.map(match => ({ ...match, status: 'upcoming' }));
        const completedMatches = completedResponse.data.map(match => ({ ...match, status: 'completed' }));
        
        setMatches({
          upcoming: upcomingMatches,
          completed: completedMatches
        });
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch matches');
        console.error('Error fetching matches:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const displayedMatches = showUpcoming ? matches.upcoming : matches.completed;

  return (
<>
<MatchScheduleBanner/>
    <section className="py-12 bg--900 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">

          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={() => setShowUpcoming(true)}
              className={`px-4 py-2 rounded-md transition-colors ${showUpcoming ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              Upcoming Matches
            </button>
            <button
              onClick={() => setShowUpcoming(false)}
              className={`px-4 py-2 rounded-md transition-colors ${!showUpcoming ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              Past Matches
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading matches...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-400 bg-red-900/20 rounded-lg">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {displayedMatches.length === 0 ? (
              <div className="col-span-full p-8 text-center text-gray-400 bg-gray-800/50 rounded-lg">
                {showUpcoming ? 'No upcoming matches scheduled' : 'No past matches recorded'}
              </div>
            ) : (
              displayedMatches.map((match, index) => (
                <CricketMatchCard 
                  key={index} 
                  match={match} 
                  isUpcoming={showUpcoming} 
                />
              ))
            )}
          </div>
        )}
      </div>
    </section>
</>
  );
};

export default MatchSchedule;