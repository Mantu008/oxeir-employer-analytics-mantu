import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { analyticsApi, TopCourseData } from '../../services/api';

interface TopCoursesChartProps {
  dateRange?: {
    start?: string;
    end?: string;
    period?: 'week' | 'month' | 'quarter' | 'year';
  };
}

const TopCoursesChart: React.FC<TopCoursesChartProps> = ({ dateRange }) => {
  const [data, setData] = useState<TopCourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await analyticsApi.getTopCourses(dateRange);
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
        <h3 className="text-lg font-semibold mb-4">Top Courses Leading to Hires</h3>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Top Courses Leading to Hires</h3>
        <div className="flex items-center justify-center h-64 text-red-500">
          {error}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Top Courses Leading to Hires</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No course data available
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Top Courses Leading to Hires</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} layout="horizontal">
          <XAxis type="number" />
          <YAxis 
            dataKey="courseName" 
            type="category" 
            width={120}
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            formatter={(value: any, name: any) => [
              value, 
              name === 'hiresCount' ? 'Hires' : 'Performance Rating'
            ]}
            labelFormatter={(label: any) => `Course: ${label}`}
          />
          <Bar dataKey="hiresCount" fill="#6366f1">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      {/* Course Details */}
      <div className="mt-4 space-y-2">
        {data.slice(0, 5).map((course, index) => (
          <div key={course._id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              <div>
                <div className="font-medium text-sm">{course.courseName}</div>
                <div className="text-xs text-gray-500">{course.institution}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-sm">{course.hiresCount} hires</div>
              <div className="text-xs text-gray-500">
                {course.avgPerformanceRating ? `${course.avgPerformanceRating.toFixed(1)}/5 rating` : 'No rating'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCoursesChart; 