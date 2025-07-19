import React, { useEffect, useState } from 'react';
import { analyticsApi, CourseCompletionData } from '../services/api';

const CourseCompletionsPage: React.FC = () => {
  const [completions, setCompletions] = useState<CourseCompletionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompletions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await analyticsApi.getCourseCompletions();
        setCompletions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch course completions');
      } finally {
        setLoading(false);
      }
    };
    fetchCompletions();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Course Completions</h2>
      {loading && <div>Loading course completions...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Course</th>
                <th className="px-4 py-2 border-b">Job</th>
                <th className="px-4 py-2 border-b">Completed At</th>
                <th className="px-4 py-2 border-b">Was Hired</th>
                <th className="px-4 py-2 border-b">Performance Rating</th>
              </tr>
            </thead>
            <tbody>
              {completions.map(completion => (
                <tr key={completion._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{completion.course?.name || completion.courseId}</td>
                  <td className="px-4 py-2 border-b">{completion.job?.title || completion.jobId}</td>
                  <td className="px-4 py-2 border-b">{new Date(completion.completedAt).toLocaleDateString()}</td>
                  <td className="px-4 py-2 border-b">
                    {completion.wasHired ? (
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Yes</span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-600">No</span>
                    )}
                  </td>
                  <td className="px-4 py-2 border-b">{completion.performanceRating ?? 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CourseCompletionsPage; 