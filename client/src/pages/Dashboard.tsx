import React, { useEffect, useState } from 'react';
import TopNavbar from '../components/TopNavbar';
import StatCard from '../components/StatCard';
import TimeFilter from '../components/TimeFilter';
import JobSelector from '../components/JobSelector';
import ExportButton from '../components/ExportButton';
import HiringStatusChart from '../components/charts/HiringStatusChart';
import ApplicationFunnel from '../components/charts/ApplicationFunnel';
import SkillGapHeatmap from '../components/charts/SkillGapHeatmap';
import TopCoursesChart from '../components/charts/TopCoursesChart';
import GeographyMap from '../components/charts/GeographyMap';
import { analyticsApi, SummaryData, DateRange } from '../services/api';
import { 
  FaBriefcase, 
  FaClipboardList, 
  FaUserCheck, 
  FaCalendarCheck, 
  FaUserTie,
  FaChartLine,
  FaDownload,
  FaFilter,
  FaSignOutAlt
} from 'react-icons/fa';

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({ period: 'month' });
  const [selectedJobId, setSelectedJobId] = useState<string>('');

  useEffect(() => {
    fetchSummary();
  }, [dateRange]);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsApi.getSummary(dateRange);
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch summary');
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (newDateRange: DateRange) => {
    setDateRange(newDateRange);
  };

  const handleJobSelect = (jobId: string) => {
    setSelectedJobId(jobId);
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-100">
      <main className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your hiring metrics and optimize your recruitment process</p>
        </div>

        {/* Filters and Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="lg:col-span-3">
            <TimeFilter dateRange={dateRange} onDateRangeChange={handleDateRangeChange} />
          </div>
          <div>
            <ExportButton dateRange={dateRange} />
          </div>
        </div>

        {/* Summary Cards */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-red-800">{error}</div>
          </div>
        )}

        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <StatCard 
              icon={<FaBriefcase />} 
              label="Total Jobs Posted" 
              value={summary.totalJobs} 
              color="blue" 
            />
            <StatCard 
              icon={<FaClipboardList />} 
              label="Open Positions" 
              value={summary.openJobs} 
              color="green" 
            />
            <StatCard 
              icon={<FaUserCheck />} 
              label="Applications Received" 
              value={summary.applicantsTotal} 
              color="yellow" 
            />
            <StatCard 
              icon={<FaCalendarCheck />} 
              label="Interviews Scheduled" 
              value={summary.interviews} 
              color="purple" 
            />
            <StatCard 
              icon={<FaUserTie />} 
              label="Hires Made" 
              value={summary.hires} 
              color="red" 
            />
            <StatCard 
              icon={<FaChartLine />} 
              label="Recent Applications" 
              value={summary.recentApplications} 
              color="indigo" 
            />
          </div>
        )}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Hiring Status Chart */}
          <HiringStatusChart dateRange={dateRange} />
          
          {/* Top Courses Chart */}
          <TopCoursesChart dateRange={dateRange} />
        </div>

        {/* Job-specific Analytics */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job-Specific Analytics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <JobSelector selectedJobId={selectedJobId} onJobSelect={handleJobSelect} />
            <ApplicationFunnel jobId={selectedJobId} dateRange={dateRange} />
            <SkillGapHeatmap jobId={selectedJobId} dateRange={dateRange} />
          </div>
        </div>

        {/* Geography Chart */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Geographic Distribution</h2>
          <GeographyMap dateRange={dateRange} />
        </div>

        {/* Additional Insights */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Conversion Rates</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Application to Interview</span>
                  <span className="font-semibold">
                    {summary.applicantsTotal > 0 
                      ? ((summary.interviews / summary.applicantsTotal) * 100).toFixed(1) 
                      : 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Interview to Hire</span>
                  <span className="font-semibold">
                    {summary.interviews > 0 
                      ? ((summary.hires / summary.interviews) * 100).toFixed(1) 
                      : 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Overall Success Rate</span>
                  <span className="font-semibold">
                    {summary.applicantsTotal > 0 
                      ? ((summary.hires / summary.applicantsTotal) * 100).toFixed(1) 
                      : 0}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Job Status Distribution</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Open Jobs</span>
                  <span className="font-semibold text-green-600">
                    {summary.openJobs}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Filled Jobs</span>
                  <span className="font-semibold text-blue-600">
                    {summary.filledJobs}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Archived Jobs</span>
                  <span className="font-semibold text-gray-600">
                    {summary.archivedJobs}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Recent Applications</span>
                  <span className="font-semibold text-indigo-600">
                    {summary.recentApplications}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Recent Hires</span>
                  <span className="font-semibold text-green-600">
                    {summary.recentHires}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard; 