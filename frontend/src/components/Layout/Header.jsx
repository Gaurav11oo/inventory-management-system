import React from 'react';
import { Package, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();

    return (
        <header className="bg-indigo-600 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <Package className="w-8 h-8" />
                    <div>
                        <h1 className="text-2xl font-bold">Inventory Management</h1>
                        <p className="text-indigo-200 text-sm">Welcome, {user?.username}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center space-x-2 bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded-lg transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                </button>
            </div>
        </header>
    );
};

export default Header;