import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
    FiPackage,
    FiLogOut,
    FiSun,
    FiMoon,
    FiClock,
    FiCalendar,
    FiUser,
    FiBell,
    FiSettings,
    FiMenu,
    FiX
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Header = () => {
    const { user, logout } = useAuth();
    const { toggleTheme, isDark } = useTheme();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [notifications] = useState([
        { id: 1, message: 'Low stock alert: Steel Sheets', time: '5 min ago', unread: true },
        { id: 2, message: 'New product added successfully', time: '1 hour ago', unread: true },
        { id: 3, message: 'Monthly report ready', time: '2 hours ago', unread: false },
    ]);

    // Update clock every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`sticky top-0 z-50 backdrop-blur-lg border-b transition-all duration-300 ${isDark
                ? 'bg-dark-bg/95 border-dark-border shadow-2xl'
                : 'bg-white/95 border-gray-200 shadow-lg'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Left Section - Logo & Brand */}
                    <div className="flex items-center space-x-4">
                        <motion.div
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                            className={`p-3 rounded-2xl ${isDark
                                ? 'bg-gradient-to-br from-[#021B79] to-[#0575E6]'
                                : 'bg-gradient-to-r from-[#0575E6] via-[#021B79] to-[#0575E6]'
                                } shadow-lg`}
                        >
                            <FiPackage className="w-7 h-7 text-white" />
                        </motion.div>

                        <div className="hidden md:block">
                            <motion.h1
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`text-2xl font-bold bg-gradient-to-r from-[#000428] via-[#004e92] to-[#000428]
 bg-clip-text text-transparent ${isDark && ' from-[#021B79] to-[#0575E6]'
                                    }`}
                            >
                                Inventory Management System
                            </motion.h1>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                for Manufacturers

                            </p>
                        </div>
                    </div>

                    {/* Center Section - Date & Time */}
                    <div className="hidden lg:flex items-center space-x-6">
                        {/* Date */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-xl ${isDark
                                ? 'bg-dark-card hover:bg-dark-hover'
                                : 'bg-gray-100 hover:bg-gray-200'
                                } transition-all duration-200`}
                        >
                            <FiCalendar className={`w-5 h-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                            <div>
                                <p className={`text-sm font-semibold ${isDark ? 'text-dark-text' : 'text-gray-800'}`}>
                                    {format(currentTime, 'EEEE')}
                                </p>
                                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {format(currentTime, 'MMM dd, yyyy')}
                                </p>
                            </div>
                        </motion.div>

                        {/* Time */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-xl ${isDark
                                ? 'bg-dark-card hover:bg-dark-hover'
                                : 'bg-gray-100 hover:bg-gray-200'
                                } transition-all duration-200`}
                        >
                            <FiClock className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                            <div>
                                <p className={`text-sm font-semibold ${isDark ? 'text-dark-text' : 'text-gray-800'} tabular-nums`}>
                                    {format(currentTime, 'hh:mm:ss')}
                                </p>
                                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {format(currentTime, 'a')}
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Section - Actions */}
                    <div className="flex items-center space-x-3">
                        {/* Theme Toggle */}
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 180 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleTheme}
                            className={`p-3 rounded-xl transition-all duration-300 ${isDark
                                ? 'bg-dark-card hover:bg-dark-hover text-yellow-400'
                                : 'bg-gray-100 hover:bg-gray-200 text-indigo-600'
                                }`}
                            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            <AnimatePresence mode="wait">
                                {isDark ? (
                                    <motion.div
                                        key="sun"
                                        initial={{ rotate: -180, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 180, opacity: 0 }}
                                    >
                                        <FiSun className="w-5 h-5" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="moon"
                                        initial={{ rotate: 180, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -180, opacity: 0 }}
                                    >
                                        <FiMoon className="w-5 h-5" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>

                        {/* Notifications */}
                        <div className="relative hidden md:block">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`p-3 rounded-xl transition-all duration-200 relative ${isDark
                                    ? 'bg-dark-card hover:bg-dark-hover text-dark-text'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                    }`}
                            >
                                <FiBell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
                                    >
                                        {unreadCount}
                                    </motion.span>
                                )}
                            </motion.button>

                            {/* Notifications Dropdown */}
                            <AnimatePresence>
                                {showNotifications && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        className={`absolute right-0 mt-2 w-80 rounded-2xl shadow-2xl overflow-hidden ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-200'
                                            }`}
                                    >
                                        <div className={`p-4 border-b ${isDark ? 'border-dark-border' : 'border-gray-200'}`}>
                                            <h3 className={`font-semibold ${isDark ? 'text-dark-text' : 'text-gray-800'}`}>
                                                Notifications
                                            </h3>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {notifications.map((notification) => (
                                                <motion.div
                                                    key={notification.id}
                                                    whileHover={{ backgroundColor: isDark ? '#334155' : '#f3f4f6' }}
                                                    className={`p-4 border-b ${isDark ? 'border-dark-border' : 'border-gray-100'} cursor-pointer`}
                                                >
                                                    <div className="flex items-start space-x-3">
                                                        {notification.unread && (
                                                            <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2" />
                                                        )}
                                                        <div className="flex-1">
                                                            <p className={`text-sm ${isDark ? 'text-dark-text' : 'text-gray-800'}`}>
                                                                {notification.message}
                                                            </p>
                                                            <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                                {notification.time}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* User Menu */}
                        <div className="relative">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className={`flex items-center space-x-3 px-4 py-2 rounded-xl transition-all duration-200 ${isDark
                                    ? 'bg-dark-card hover:bg-dark-hover'
                                    : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                                    {user?.username?.charAt(0).toUpperCase()}
                                </div>
                                <div className="hidden md:block text-left">
                                    <p className={`text-sm font-semibold ${isDark ? 'text-dark-text' : 'text-gray-800'}`}>
                                        {user?.username}
                                    </p>
                                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {user?.role || 'Admin'}
                                    </p>
                                </div>
                            </motion.button>

                            {/* User Dropdown */}
                            <AnimatePresence>
                                {showUserMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        className={`absolute right-0 mt-2 w-64 rounded-2xl shadow-2xl overflow-hidden ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-200'
                                            }`}
                                    >
                                        <div className={`p-4 border-b ${isDark ? 'border-dark-border' : 'border-gray-200'}`}>
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                                    {user?.username?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className={`font-semibold ${isDark ? 'text-dark-text' : 'text-gray-800'}`}>
                                                        {user?.username}
                                                    </p>
                                                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                        {user?.role || 'Administrator'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-2">
                                            <motion.button
                                                whileHover={{ backgroundColor: isDark ? '#334155' : '#f3f4f6' }}
                                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${isDark ? 'text-dark-text' : 'text-gray-700'
                                                    }`}
                                            >
                                                <FiUser className="w-5 h-5" />
                                                <span>Profile Settings</span>
                                            </motion.button>

                                            <motion.button
                                                whileHover={{ backgroundColor: isDark ? '#334155' : '#f3f4f6' }}
                                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${isDark ? 'text-dark-text' : 'text-gray-700'
                                                    }`}
                                            >
                                                <FiSettings className="w-5 h-5" />
                                                <span>Preferences</span>
                                            </motion.button>

                                            <div className={`my-2 border-t ${isDark ? 'border-dark-border' : 'border-gray-200'}`} />

                                            <motion.button
                                                whileHover={{ backgroundColor: '#fee2e2' }}
                                                onClick={logout}
                                                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-red-600"
                                            >
                                                <FiLogOut className="w-5 h-5" />
                                                <span className="font-semibold">Logout</span>
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Mobile Menu Button */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className={`md:hidden p-3 rounded-xl ${isDark ? 'bg-dark-card text-dark-text' : 'bg-gray-100 text-gray-700'
                                }`}
                        >
                            {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
                        </motion.button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className={`md:hidden overflow-hidden border-t ${isDark ? 'border-dark-border' : 'border-gray-200'
                                }`}
                        >
                            <div className="py-4 space-y-3">
                                {/* Mobile Date & Time */}
                                <div className={`flex items-center justify-between px-4 py-3 rounded-xl ${isDark ? 'bg-dark-card' : 'bg-gray-100'
                                    }`}>
                                    <div className="flex items-center space-x-2">
                                        <FiCalendar className={isDark ? 'text-indigo-400' : 'text-indigo-600'} />
                                        <span className={`text-sm ${isDark ? 'text-dark-text' : 'text-gray-800'}`}>
                                            {format(currentTime, 'MMM dd, yyyy')}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <FiClock className={isDark ? 'text-purple-400' : 'text-purple-600'} />
                                        <span className={`text-sm font-semibold ${isDark ? 'text-dark-text' : 'text-gray-800'}`}>
                                            {format(currentTime, 'hh:mm:ss a')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.header>
    );
};

export default Header;