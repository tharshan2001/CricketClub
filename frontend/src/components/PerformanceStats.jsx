import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const PerformanceStats = ({ player }) => {
  // If player or stats is not provided, show a friendly message
  if (!player || !player.stats) {
    return (
      <div className="p-4 text-center text-gray-500">
        No performance data available.
      </div>
    );
  }

  const stats = player.stats;

  const battingData = [
    { name: 'Matches', value: stats.matches || 0 },
    { name: 'Runs', value: stats.runs || 0 },
    { name: 'Average', value: stats.average || 0 },
    { name: '50s', value: stats.fifties || 0 },
    { name: '100s', value: stats.hundreds || 0 },
  ];

  const bowlingData = [
    { name: 'Wickets', value: stats.wickets || 0 },
    { name: 'Economy', value: stats.economy || 0 },
    { name: 'Best', value: stats.bestBowling?.wickets || 0 },
    { name: '5W', value: stats.fiveWickets || 0 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Performance Statistics</h3>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Batting Stats */}
        <div>
          <h4 className="text-xl font-semibold mb-4 text-center">Batting Performance</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={battingData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name="Batting Stats" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bowling Stats */}
        <div>
          <h4 className="text-xl font-semibold mb-4 text-center">Bowling Performance</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bowlingData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {bowlingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Stats Table */}
      <div className="mt-8">
        <h4 className="text-xl font-semibold mb-4">Detailed Statistics</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(stats).map(([key, value]) => (
                <tr key={key}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">{key}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PerformanceStats;
