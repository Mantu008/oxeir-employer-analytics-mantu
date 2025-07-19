import React, { useState } from 'react';
import { analyticsApi, DateRange } from '../services/api';

interface ExportButtonProps {
  dateRange?: DateRange;
}

const ExportButton: React.FC<ExportButtonProps> = ({ dateRange }) => {
  const [loading, setLoading] = useState(false);
  const [format, setFormat] = useState<'csv' | 'pdf'>('csv');

  const handleExport = async () => {
    try {
      setLoading(true);
      const blob = await analyticsApi.exportReport(format, dateRange);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analytics-report-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">Export Report</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Export Format
          </label>
          <div className="flex gap-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="csv"
                checked={format === 'csv'}
                onChange={(e) => setFormat(e.target.value as 'csv' | 'pdf')}
                className="mr-2"
              />
              CSV
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="pdf"
                checked={format === 'pdf'}
                onChange={(e) => setFormat(e.target.value as 'csv' | 'pdf')}
                className="mr-2"
              />
              PDF
            </label>
          </div>
        </div>

        <button
          onClick={handleExport}
          disabled={loading}
          className={`w-full px-4 py-2 rounded-md text-white font-medium transition-colors ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Exporting...
            </div>
          ) : (
            `Export ${format.toUpperCase()} Report`
          )}
        </button>

        <div className="text-xs text-gray-500">
          {format === 'csv' 
            ? 'CSV format includes all analytics data in a spreadsheet format.'
            : 'PDF format includes charts and formatted analytics report.'
          }
        </div>
      </div>
    </div>
  );
};

export default ExportButton; 