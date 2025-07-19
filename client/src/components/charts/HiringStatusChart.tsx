import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { analyticsApi, HiringStatusData } from '../../services/api';

interface HiringStatusChartProps {
  dateRange?: {
    start?: string;
    end?: string;
    period?: 'week' | 'month' | 'quarter' | 'year';
  };
}

const HiringStatusChart: React.FC<HiringStatusChartProps> = ({ dateRange }) => {
  const [data, setData] = useState<HiringStatusData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const colors = {
    open: '#10b981',
    filled: '#3b82f6',
    archived: '#6b7280',
    draft: '#f59e0b'
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await analyticsApi.getHiringStatus(dateRange);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  if (loading) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Hiring Status</h3>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Hiring Status</h3>
        <div className="flex items-center justify-center h-64 text-red-500">
          {error}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Hiring Status</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Hiring Status</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis 
            dataKey="_id" 
            tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
          />
          <YAxis />
          <Tooltip 
            formatter={(value: any) => [value, 'Jobs']}
            labelFormatter={(label: any) => `Status: ${label.charAt(0).toUpperCase() + label.slice(1)}`}
          />
          <Bar dataKey="count" fill="#3b82f6">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[entry._id as keyof typeof colors] || '#3b82f6'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HiringStatusChart; 