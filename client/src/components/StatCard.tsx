import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => (
  <div className={`card flex items-center gap-4 border-l-4 border-${color}-500`}>
    <div className={`text-${color}-500 text-3xl`}>{icon}</div>
    <div>
      <div className="text-gray-500 text-sm font-medium">{label}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  </div>
);

export default StatCard; 