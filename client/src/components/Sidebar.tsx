import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => (
  <aside className="w-64 h-screen bg-gray-900 text-white flex flex-col p-4">
    <div className="text-2xl font-bold mb-8">Employer Dashboard</div>
    <nav className="flex flex-col gap-4">
      <Link to="/dashboard" className="hover:bg-gray-700 rounded p-2">Overview</Link>
      <Link to="/jobs" className="hover:bg-gray-700 rounded p-2">All Jobs</Link>
      <Link to="/courses" className="hover:bg-gray-700 rounded p-2">Courses</Link>
      <Link to="/course-completions" className="hover:bg-gray-700 rounded p-2">Course Completions</Link>
      <Link to="/applications" className="hover:bg-gray-700 rounded p-2">Applications</Link>
      <Link to="/views" className="hover:bg-gray-700 rounded p-2">Views</Link>
    </nav>
  </aside>
);

export default Sidebar; 