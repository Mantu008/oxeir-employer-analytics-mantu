import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { analyticsApi, SkillGapData } from '../../services/api';

interface SkillGapHeatmapProps {
  jobId?: string;
  dateRange?: {
    start?: string;
    end?: string;
    period?: 'week' | 'month' | 'quarter' | 'year';
  };
}

const SkillGapHeatmap: React.FC<SkillGapHeatmapProps> = ({ jobId, dateRange }) => {
  const [data, setData] = useState<SkillGapData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!jobId) {
        setData([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const result = await analyticsApi.getSkillGap(jobId);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId]);

  const getColorForScore = (score: number) => {
    if (score >= 80) return '#10b981'; // Green for high scores
    if (score >= 60) return '#f59e0b'; // Yellow for medium scores
    return '#ef4444'; // Red for low scores
  };

  if (!jobId) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Skill Gap Analysis</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          Select a job to view skill gap data
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Skill Gap Analysis</h3>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Skill Gap Analysis</h3>
        <div className="flex items-center justify-center h-64 text-red-500">
          {error}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
  <div className="card">
        <h3 className="text-lg font-semibold mb-4">Skill Gap Analysis</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No skill data available for this job
        </div>
  </div>
);
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Skill Gap Analysis</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} layout="horizontal">
          <XAxis type="number" domain={[0, 100]} />
          <YAxis dataKey="_id" type="category" width={100} />
          <Tooltip 
            formatter={(value: any, name: any) => [
              `${value.toFixed(1)}%`, 
              name === 'avgSkillScore' ? 'Average Score' : name
            ]}
            labelFormatter={(label: any) => `Skill: ${label}`}
          />
          <Bar dataKey="avgSkillScore" fill="#8b5cf6">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColorForScore(entry.avgSkillScore)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      {/* Legend */}
      <div className="mt-4 flex justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>High (80%+)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span>Medium (60-79%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Low (&lt;60%)</span>
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div className="text-center">
          <div className="text-gray-600">Avg Score</div>
          <div className="font-semibold text-purple-600">
            {(data.reduce((sum, item) => sum + item.avgSkillScore, 0) / data.length).toFixed(1)}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-gray-600">Skills Tested</div>
          <div className="font-semibold text-blue-600">{data.length}</div>
        </div>
        <div className="text-center">
          <div className="text-gray-600">Candidates</div>
          <div className="font-semibold text-green-600">
            {data.length > 0 ? data[0].candidateCount : 0}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillGapHeatmap; 