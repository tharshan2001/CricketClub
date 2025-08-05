// src/components/ui/ProgressBar.jsx
const ProgressBar = ({ value, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-amber-500',
    amber: 'bg-amber-500',
    green: 'bg-green-500',
    gray: 'bg-gray-500'
  };

  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`h-full rounded-full ${colorClasses[color]}`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
};

export default ProgressBar;