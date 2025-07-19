import React, { useEffect, useState } from 'react';
import { analyticsApi, ViewData } from '../services/api';

const ViewsPage: React.FC = () => {
  const [views, setViews] = useState<ViewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchViews = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await analyticsApi.getViews();
        setViews(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch views');
      } finally {
        setLoading(false);
      }
    };
    fetchViews();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Views</h2>
      {loading && <div>Loading views...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Job Title</th>
                <th className="px-4 py-2 border-b">Department</th>
                <th className="px-4 py-2 border-b">Application Status</th>
                <th className="px-4 py-2 border-b">Viewed At</th>
              </tr>
            </thead>
            <tbody>
              {views.map(view => (
                <tr key={view._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{view.job?.title || 'N/A'}</td>
                  <td className="px-4 py-2 border-b">{view.job?.department || 'N/A'}</td>
                  <td className="px-4 py-2 border-b">{view.job?.status || 'N/A'}</td>
                  <td className="px-4 py-2 border-b">{new Date(view.viewedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewsPage; 