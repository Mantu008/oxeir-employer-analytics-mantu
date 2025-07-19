import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { analyticsApi, FunnelData } from '../../services/api';

interface ApplicationFunnelProps {
  jobId?: string;
  dateRange?: {
    start?: string;
    end?: string;
    period?: 'week' | 'month' | 'quarter' | 'year';
  };
}

const ApplicationFunnel: React.FC<ApplicationFunnelProps> = ({ jobId, dateRange }) => {
  const [data, setData] = useState<FunnelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!jobId) {
        setData(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const result = await analyticsApi.getFunnel(jobId);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId]);

  if (!jobId) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Application Funnel</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          Select a job to view funnel data
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Application Funnel</h3>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Application Funnel</h3>
        <div className="flex items-center justify-center h-64 text-red-500">
          {error}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Application Funnel</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No data available
        </div>
      </div>
    );
  }

  // Transform data for the chart
  const chartData = [
    { stage: 'Views', count: data.views },
    { stage: 'Applied', count: data.applications },
    { stage: 'Shortlisted', count: data.shortlisted },
    { stage: 'Interviewed', count: data.interviewed },
    { stage: 'Hired', count: data.hired }
  ];

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Application Funnel</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} layout="vertical">
          <XAxis type="number" />
          <YAxis dataKey="stage" type="category" width={80} />
          <Tooltip 
            formatter={(value: any) => [value, 'Candidates']}
            labelFormatter={(label: any) => `Stage: ${label}`}
          />
          <Bar dataKey="count" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
      
      {/* Conversion Rates */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="text-center">
          <div className="text-gray-600">View to Apply</div>
          <div className="font-semibold text-blue-600">
            {data.views > 0 ? ((data.applications / data.views) * 100).toFixed(1) : 0}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-gray-600">Apply to Hire</div>
          <div className="font-semibold text-green-600">
            {data.applications > 0 ? ((data.hired / data.applications) * 100).toFixed(1) : 0}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationFunnel; 