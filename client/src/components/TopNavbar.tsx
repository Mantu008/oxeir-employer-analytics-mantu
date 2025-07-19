import React from "react";
import { FaSignOutAlt } from "react-icons/fa";

interface TopNavbarProps {
    onLogout: () => void;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ onLogout }) => {
    return (
        <nav className="bg-white shadow-sm border-b px-6 py-4">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold text-gray-800">
                    Employer Analytics
                </h1>
                <button
                    onClick={onLogout}
                    className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                >
                    <FaSignOutAlt />
                    <span>Logout</span>
                </button>
            </div>
        </nav>
    );
};

export default TopNavbar;
