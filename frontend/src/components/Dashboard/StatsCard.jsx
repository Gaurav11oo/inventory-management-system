import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color }) => {
  const colors = {
    indigo: 'text-indigo-600',
    green: 'text-green-600',
    red: 'text-red-600'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <Icon className={`w-12 h-12 ${colors[color]}`} />
      </div>
    </div>
  );
};

export default StatsCard;