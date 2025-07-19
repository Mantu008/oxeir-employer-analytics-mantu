import React from 'react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import { Outlet } from 'react-router-dom';

interface LayoutProps {
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ onLogout }) => (
  <div className="flex min-h-screen">
    <Sidebar />
    <div className="flex-1 flex flex-col bg-gray-50">
      <TopNavbar onLogout={onLogout} />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  </div>
);

export default Layout; 