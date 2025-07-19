import React, { useEffect, useState } from "react";
import axios from "axios";

interface Job {
    _id: string;
    title: string;
    status: string;
    department?: string;
}

interface JobSelectorProps {
    selectedJobId?: string;
    onJobSelect: (jobId: string) => void;
}

const JobSelector: React.FC<JobSelectorProps> = ({
    selectedJobId,
    onJobSelect,
}) => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                setError(null);
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `${import.meta.env.VITE_APP_API_URL}api/employer/jobs`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setJobs(response.data);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Failed to fetch jobs"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    if (loading) {
        return (
            <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Select Job</h3>
                <div className="flex items-center justify-center h-12">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Select Job</h3>
                <div className="text-red-500 text-sm">{error}</div>
            </div>
        );
    }

    if (jobs.length === 0) {
        return (
            <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Select Job</h3>
                <div className="text-gray-500 text-sm">No jobs available</div>
            </div>
        );
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Select Job</h3>
            <select
                value={selectedJobId || ""}
                onChange={(e) => onJobSelect(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
                <option value="">Choose a job...</option>
                {jobs.map((job) => (
                    <option key={job._id} value={job._id}>
                        {job.title} -{" "}
                        {job.status.charAt(0).toUpperCase() +
                            job.status.slice(1)}
                        {job.department && ` (${job.department})`}
                    </option>
                ))}
            </select>

            {selectedJobId && (
                <div className="mt-2 text-sm text-gray-600">
                    Selected:{" "}
                    {jobs.find((job) => job._id === selectedJobId)?.title}
                </div>
            )}
        </div>
    );
};

export default JobSelector;
