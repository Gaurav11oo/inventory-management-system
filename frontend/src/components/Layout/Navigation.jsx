import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Package, Users, TrendingDown, BarChart3 } from 'lucide-react';

const Navigation = () => {
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Dashboard', icon: Home },
        { path: '/products', label: 'Products', icon: Package },
        { path: '/suppliers', label: 'Suppliers', icon: Users },
        { path: '/stock', label: 'Stock Management', icon: TrendingDown },
        { path: '/reports', label: 'Reports', icon: BarChart3 }
    ];

    return (
        <nav className="bg-white rounded-lg shadow mb-6 p-4">
            <div className="flex flex-wrap gap-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isActive
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default Navigation;