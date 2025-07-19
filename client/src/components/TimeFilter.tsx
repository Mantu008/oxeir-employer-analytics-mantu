import React from 'react';
import { DateRange } from '../services/api';

interface TimeFilterProps {
  dateRange: DateRange;
  onDateRangeChange: (dateRange: DateRange) => void;
}

const TimeFilter: React.FC<TimeFilterProps> = ({ dateRange, onDateRangeChange }) => {
  const handlePeriodChange = (period: DateRange['period']) => {
    onDateRangeChange({ period });
  };

  const handleCustomDateChange = (field: 'start' | 'end', value: string) => {
    onDateRangeChange({
      ...dateRange,
      [field]: value,
      period: undefined // Clear period when using custom dates
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">Time Filter</h3>
      
      {/* Quick Period Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quick Periods
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'week', label: 'Last Week' },
            { value: 'month', label: 'Last Month' },
            { value: 'quarter', label: 'Last Quarter' },
            { value: 'year', label: 'Last Year' }
          ].map((period) => (
            <button
              key={period.value}
              onClick={() => handlePeriodChange(period.value as DateRange['period'])}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                dateRange.period === period.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Date Range */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Custom Date Range
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Start Date</label>
            <input
              type="date"
              value={dateRange.start || ''}
              onChange={(e) => handleCustomDateChange('start', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">End Date</label>
            <input
              type="date"
              value={dateRange.end || ''}
              onChange={(e) => handleCustomDateChange('end', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Current Selection Display */}
      <div className="text-sm text-gray-600">
        {dateRange.period ? (
          <span>Showing data for: <strong>{dateRange.period}</strong></span>
        ) : dateRange.start && dateRange.end ? (
          <span>
            Showing data from: <strong>{new Date(dateRange.start).toLocaleDateString()}</strong> to{' '}
            <strong>{new Date(dateRange.end).toLocaleDateString()}</strong>
          </span>
        ) : (
          <span>Showing all data</span>
        )}
      </div>
    </div>
  );
};

export default TimeFilter; 