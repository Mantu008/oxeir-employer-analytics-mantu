import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { analyticsApi, GeographyData } from '../../services/api';

interface GeographyMapProps {
  dateRange?: {
    start?: string;
    end?: string;
    period?: 'week' | 'month' | 'quarter' | 'year';
  };
}

const GeographyMap: React.FC<GeographyMapProps> = ({ dateRange }) => {
  const [data, setData] = useState<GeographyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await analyticsApi.getGeography(dateRange);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  const colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
  ];

  if (loading) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Geographic Distribution</h3>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Geographic Distribution</h3>
        <div className="flex items-center justify-center h-64 text-red-500">
          {error}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Geographic Distribution</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No geographic data available
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Geographic Distribution</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} layout="horizontal">
          <XAxis type="number" />
          <YAxis 
            dataKey="_id" 
            type="category" 
            width={80}
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            formatter={(value: any, name: any) => [
              value, 
              name === 'applications' ? 'Applications' : 'Hires'
            ]}
            labelFormatter={(label: any) => `Country: ${label}`}
          />
          <Bar dataKey="applications" fill="#06b6d4" name="Applications">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      {/* Geographic Details */}
      <div className="mt-4 space-y-2">
        {data.slice(0, 5).map((country, index) => (
          <div key={country._id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              <div className="font-medium text-sm">{country._id}</div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-sm">{country.applications} applications</div>
              <div className="text-xs text-gray-500">{country.hires} hires</div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Summary Stats */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="text-center">
          <div className="text-gray-600">Total Countries</div>
          <div className="font-semibold text-blue-600">{data.length}</div>
        </div>
        <div className="text-center">
          <div className="text-gray-600">Total Applications</div>
          <div className="font-semibold text-green-600">
            {data.reduce((sum, item) => sum + item.applications, 0)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeographyMap; 