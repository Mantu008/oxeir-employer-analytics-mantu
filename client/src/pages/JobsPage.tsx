import React, { useEffect, useState } from 'react';
import { analyticsApi, JobData } from '../services/api';

const JobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await analyticsApi.getJobs();
        setJobs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">All Jobs</h2>
      {loading && <div>Loading jobs...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map(job => (
            <div key={job._id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 flex flex-col gap-2 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  job.status === 'open'
                    ? 'bg-green-100 text-green-700'
                    : job.status === 'filled'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-200 text-gray-600'
                }`}>{job.status}</span>
              </div>
              <div className="text-gray-600 text-sm mb-1">
                {job.department ?? 'N/A'} &bull; 
                {job.experienceLevel
                  ? job.experienceLevel.charAt(0).toUpperCase() + job.experienceLevel.slice(1)
                  : 'N/A'} &bull; 
                {job.jobType
                  ? job.jobType.replace('-', ' ')
                  : 'N/A'}
              </div>
              <div className="text-gray-500 text-sm mb-1">
                <span className="font-medium">Location:</span>{' '}
                {job.location?.city ?? 'N/A'}, {job.location?.country ?? 'N/A'}
                {job.location?.remote ? (
                  <span className="ml-2 px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">Remote</span>
                ) : null}
              </div>
              <div className="text-gray-500 text-sm mb-1">
                <span className="font-medium">Salary:</span> {job.salary?.min?.toLocaleString()} - {job.salary?.max?.toLocaleString()} {job.salary?.currency}
              </div>
              <div className="text-gray-500 text-sm mb-1">
                <span className="font-medium">Skills Required:</span> {job.skillsRequired?.join(', ')}
              </div>
              <div className="text-gray-500 text-sm mb-1">
                <span className="font-medium">Views:</span> {job.views}
              </div>
              <div className="text-gray-400 text-xs mb-2">Posted on {new Date(job.createdAt).toLocaleDateString()}</div>
              <div className="text-gray-700 text-sm mb-2 line-clamp-3">{job.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsPage; 