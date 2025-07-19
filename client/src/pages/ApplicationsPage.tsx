import React, { useEffect, useState } from 'react';
import { analyticsApi, ApplicationData } from '../services/api';

const ApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await analyticsApi.getApplications();
        setApplications(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch applications');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Applications</h2>
      {loading && <div>Loading applications...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Job Title</th>
                <th className="px-4 py-2 border-b">Department</th>
                <th className="px-4 py-2 border-b">Candidate ID</th>
                <th className="px-4 py-2 border-b">Status</th>
                <th className="px-4 py-2 border-b">Applied At</th>
                <th className="px-4 py-2 border-b">Location</th>
                <th className="px-4 py-2 border-b">Skills</th>
                <th className="px-4 py-2 border-b">Experience</th>
                <th className="px-4 py-2 border-b">Source</th>
                <th className="px-4 py-2 border-b">Rating</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{app.job?.title || 'N/A'}</td>
                  <td className="px-4 py-2 border-b">{app.job?.department || 'N/A'}</td>
                  <td className="px-4 py-2 border-b">{app.candidateId || 'N/A'}</td>
                  <td className="px-4 py-2 border-b">{app.status}</td>
                  <td className="px-4 py-2 border-b">{new Date(app.appliedAt).toLocaleDateString()}</td>
                  <td className="px-4 py-2 border-b">{app.location ? `${app.location.city || ''}, ${app.location.country || ''}` : 'N/A'}</td>
                  <td className="px-4 py-2 border-b">{app.skills?.join(', ') || 'N/A'}</td>
                  <td className="px-4 py-2 border-b">{app.experience ?? 'N/A'}</td>
                  <td className="px-4 py-2 border-b">{app.source || 'N/A'}</td>
                  <td className="px-4 py-2 border-b">{app.rating ?? 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage; 