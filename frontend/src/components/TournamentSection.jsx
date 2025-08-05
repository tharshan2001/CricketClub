import { useState, useEffect } from 'react';

const TournamentSection = ({ tournaments }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    if (tournaments.length > 0) {
      const timer = setInterval(() => {
        const now = new Date();
        const newTimeLeft = {};
        
        tournaments.forEach(tournament => {
          const endDate = new Date(tournament.endDate);
          const diff = endDate - now;
          
          if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            newTimeLeft[tournament.id] = { days, hours, minutes, seconds };
          } else {
            newTimeLeft[tournament.id] = { days: 0, hours: 0, minutes: 0, seconds: 0 };
          }
        });
        
        setTimeLeft(newTimeLeft);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [tournaments]);

  if (tournaments.length === 0) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500">No upcoming tournaments</p>
        </div>
      </section>
    );
  }

  const currentTournament = tournaments[activeTab];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Tournaments
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Compete and showcase your skills
          </p>
        </div>

        {/* Tournament Tabs */}
        <div className="flex overflow-x-auto pb-2 mb-8">
          {tournaments.map((tournament, index) => (
            <button
              key={tournament.id}
              onClick={() => setActiveTab(index)}
              className={`flex-shrink-0 px-4 py-2 border-b-2 font-medium text-sm ${activeTab === index ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              {tournament.name}
            </button>
          ))}
        </div>

        {/* Current Tournament Details */}
        <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{currentTournament.name}</h3>
                <p className="text-gray-600 mt-1">
                  {new Date(currentTournament.startDate).toLocaleDateString()} -{' '}
                  {new Date(currentTournament.endDate).toLocaleDateString()}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  new Date(currentTournament.endDate) > new Date()
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {new Date(currentTournament.endDate) > new Date() ? 'Ongoing' : 'Completed'}
                </span>
              </div>
            </div>

            {/* Countdown Timer */}
            {new Date(currentTournament.endDate) > new Date() && (
              <div className="mb-8">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Time Remaining</h4>
                <div className="flex space-x-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {timeLeft[currentTournament.id]?.days || 0}
                    </div>
                    <div className="text-xs text-gray-500">Days</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {timeLeft[currentTournament.id]?.hours || 0}
                    </div>
                    <div className="text-xs text-gray-500">Hours</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {timeLeft[currentTournament.id]?.minutes || 0}
                    </div>
                    <div className="text-xs text-gray-500">Minutes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {timeLeft[currentTournament.id]?.seconds || 0}
                    </div>
                    <div className="text-xs text-gray-500">Seconds</div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
              {/* Tournament Info */}
              <div>
                <h4 className="text-lg font-semibold mb-3">About the Tournament</h4>
                <p className="text-gray-600 mb-4">{currentTournament.description}</p>
                
                <div className="space-y-3">
                  <div className="flex">
                    <span className="text-gray-500 w-32">Format:</span>
                    <span className="text-gray-800">{currentTournament.format}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-32">Location:</span>
                    <span className="text-gray-800">{currentTournament.location}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-32">Prize Pool:</span>
                    <span className="text-gray-800">{currentTournament.prizePool}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-32">Teams:</span>
                    <span className="text-gray-800">{currentTournament.teams.length}</span>
                  </div>
                </div>
              </div>

              {/* Teams List */}
              <div>
                <h4 className="text-lg font-semibold mb-3">Participating Teams</h4>
                <div className="bg-white rounded-lg shadow-inner p-4">
                  <ul className="divide-y divide-gray-200">
                    {currentTournament.teams.map((team, index) => (
                      <li key={index} className="py-3 flex items-center">
                        <img
                          src={team.logo || '/team-default.png'}
                          alt={team.name}
                          className="h-8 w-8 rounded-full mr-3"
                        />
                        <span className="font-medium">{team.name}</span>
                        {team.isRegistered && (
                          <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Registered
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Tournament Bracket (simplified) */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold mb-4">Tournament Bracket</h4>
              <div className="bg-white rounded-lg shadow-inner p-4 overflow-x-auto">
                <div className="min-w-max">
                  {/* This is a simplified bracket visualization */}
                  <div className="flex justify-between items-center space-x-8">
                    {['Quarterfinals', 'Semifinals', 'Final'].map((round, index) => (
                      <div key={index} className="text-center">
                        <h5 className="text-sm font-medium text-gray-500 mb-2">{round}</h5>
                        <div className="space-y-2">
                          {Array.from({ length: index === 0 ? 4 : index === 1 ? 2 : 1 }).map((_, i) => (
                            <div
                              key={i}
                              className="border border-gray-200 rounded px-4 py-2 text-sm w-32"
                            >
                              {round === 'Final' ? 'Winner SF1 vs Winner SF2' : `Team ${i * 2 + 1} vs Team ${i * 2 + 2}`}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TournamentSection;