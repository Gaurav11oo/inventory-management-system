
import React, { useState, useEffect } from 'react';
import { Package, BarChart3, AlertTriangle, TrendingUp, TrendingDown, DollarSign, Box, Layers, ShoppingCart, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';
import StatsCard from './StatsCard';
import LowStockAlert from './LowStockAlert';
import { getProducts, getLowStockProducts } from '../../services/productService';
import { calculateTotalValue, groupByCategory } from '../../utils/helpers';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [productsData, lowStockData] = await Promise.all([
                getProducts(),
                getLowStockProducts()
            ]);
            setProducts(productsData);
            setLowStockProducts(lowStockData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    const totalValue = calculateTotalValue(products);
    const categoryGroups = groupByCategory(products);
    const inStockProducts = products.filter(p => p.currentStock > p.minStock);
    const criticalStock = products.filter(p => p.currentStock === 0);

    // Chart Data Preparation
    const categoryData = Object.entries(categoryGroups).map(([category, items]) => ({
        name: category,
        value: items.length,
        stock: items.reduce((sum, item) => sum + item.currentStock, 0),
        value_amount: items.reduce((sum, item) => sum + (item.currentStock * item.price), 0)
    }));

    const stockStatusData = [
        { name: 'In Stock', value: inStockProducts.length, color: '#10b981' },
        { name: 'Low Stock', value: lowStockProducts.length, color: '#f59e0b' },
        { name: 'Out of Stock', value: criticalStock.length, color: '#ef4444' }
    ];

    const topProductsData = products
        .sort((a, b) => (b.currentStock * b.price) - (a.currentStock * a.price))
        .slice(0, 6)
        .map(p => ({
            name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
            value: p.currentStock * p.price,
            stock: p.currentStock
        }));

    const recentActivity = products.slice(0, 5).map(p => ({
        name: p.name,
        stock: p.currentStock,
        change: Math.random() > 0.5 ? 'up' : 'down'
    }));

    const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            {/* Header Section */}
            <motion.div variants={itemVariants} className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-[#3c3cbf] via-[#05c9ff] to-[#464545]
 bg-clip-text text-transparent">
                        Dashboard Overview
                    </h2>
                    <p className="text-gray-600 mt-1">Welcome back! Here's your inventory status</p>
                </div>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-r from-[#000046] via-[#1CB5E0] to-[#000046]
 text-white px-6 py-3 rounded-xl shadow-lg flex items-center space-x-2 cursor-pointer"
                >
                    <Activity className="w-5 h-5" />
                    <span className="font-semibold">Real-time Updates</span>
                </motion.div>
            </motion.div>

            {/* Stats Cards Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Products Card */}
                <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white overflow-hidden relative"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16" />
                    <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                                <Package className="w-8 h-8" />
                            </div>
                            <div className="text-xs bg-white bg-opacity-20 px-3 py-1 rounded-full">+12%</div>
                        </div>
                        <h3 className="text-white text-opacity-90 text-sm font-medium mb-1">Total Products</h3>
                        <p className="text-4xl font-bold">
                            <CountUp end={products.length} duration={2} />
                        </p>
                        <p className="text-xs text-white text-opacity-75 mt-2">Active inventory items</p>
                    </div>
                </motion.div>

                {/* Stock Value Card */}
                <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white overflow-hidden relative"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16" />
                    <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                                <DollarSign className="w-8 h-8" />
                            </div>
                            <div className="text-xs bg-white bg-opacity-20 px-3 py-1 rounded-full">+8%</div>
                        </div>
                        <h3 className="text-white text-opacity-90 text-sm font-medium mb-1">Stock Value</h3>
                        <p className="text-4xl font-bold">
                            $<CountUp end={totalValue} duration={2} separator="," />
                        </p>
                        <p className="text-xs text-white text-opacity-75 mt-2">Total inventory worth</p>
                    </div>
                </motion.div>

                {/* Categories Card */}
                <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl p-6 text-white overflow-hidden relative"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16" />
                    <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                                <Layers className="w-8 h-8" />
                            </div>
                            <div className="text-xs bg-white bg-opacity-20 px-3 py-1 rounded-full">New</div>
                        </div>
                        <h3 className="text-white text-opacity-90 text-sm font-medium mb-1">Categories</h3>
                        <p className="text-4xl font-bold">
                            <CountUp end={Object.keys(categoryGroups).length} duration={2} />
                        </p>
                        <p className="text-xs text-white text-opacity-75 mt-2">Product categories</p>
                    </div>
                </motion.div>

                {/* Low Stock Alerts Card */}
                <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-xl p-6 text-white overflow-hidden relative"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16" />
                    <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                                <AlertTriangle className="w-8 h-8" />
                            </div>
                            {lowStockProducts.length > 0 && (
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="text-xs bg-white bg-opacity-20 px-3 py-1 rounded-full"
                                >
                                    Alert!
                                </motion.div>
                            )}
                        </div>
                        <h3 className="text-white text-opacity-90 text-sm font-medium mb-1">Low Stock</h3>
                        <p className="text-4xl font-bold">
                            <CountUp end={lowStockProducts.length} duration={2} />
                        </p>
                        <p className="text-xs text-white text-opacity-75 mt-2">Items need attention</p>
                    </div>
                </motion.div>
            </motion.div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category Distribution Chart */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Category Distribution</h3>
                            <p className="text-sm text-gray-600">Product count by category</p>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                            <BarChart3 className="w-6 h-6 text-indigo-600" />
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Stock Status Chart */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Stock Status</h3>
                            <p className="text-sm text-gray-600">Current inventory health</p>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                            <Activity className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stockStatusData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                                {stockStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Top Products and Category Value */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products by Value */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Top Products</h3>
                            <p className="text-sm text-gray-600">By stock value</p>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                            <TrendingUp className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={topProductsData} layout="horizontal">
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={100} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#6366f1" radius={[0, 10, 10, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Category Value Chart */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Category Value</h3>
                            <p className="text-sm text-gray-600">Total value by category</p>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                            <DollarSign className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={categoryData}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="value_amount" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorValue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Low Stock Alert */}
            {lowStockProducts.length > 0 && (
                <motion.div variants={itemVariants}>
                    <LowStockAlert products={lowStockProducts} />
                </motion.div>
            )}

            {/* Recent Products Grid */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Recent Activity</h3>
                        <p className="text-sm text-gray-600">Latest product updates</p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center space-x-1"
                    >
                        <span>View All</span>
                        <TrendingUp className="w-4 h-4" />
                    </motion.button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.slice(0, 6).map((product, index) => (
                        <motion.div
                            key={product._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <Box className="w-5 h-5 text-indigo-600" />
                                </div>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${product.currentStock > product.minStock
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                    }`}>
                                    {product.currentStock > product.minStock ? 'In Stock' : 'Low'}
                                </span>
                            </div>
                            <h4 className="font-semibold text-gray-800 mb-1 truncate">{product.name}</h4>
                            <p className="text-xs text-gray-600 mb-2">{product.category}</p>
                            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                <div className="text-sm">
                                    <span className="text-gray-600">Stock: </span>
                                    <span className="font-bold text-gray-800">{product.currentStock}</span>
                                    <span className="text-gray-500 text-xs ml-1">{product.unit}</span>
                                </div>
                                <div className="text-sm font-bold text-indigo-600">
                                    ${product.price}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Quick Stats Bar */}
            <motion.div
                variants={itemVariants}
                className="rounded-2xl shadow-xl p-6 text-white"
                style={{
                    backgroundImage:
                        "linear-gradient(90deg, #f3f0c3 0%, #ffa858 25%, #730000 50%, #001b1c 75%, #0aac86 100%)",
                }}

            >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                        <div className="text-3xl font-bold mb-1">
                            <CountUp end={products.reduce((sum, p) => sum + p.currentStock, 0)} duration={2} separator="," />
                        </div>
                        <div className="text-sm text-white text-opacity-80">Total Items in Stock</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold mb-1">
                            <CountUp end={inStockProducts.length} duration={2} />
                        </div>
                        <div className="text-sm text-white text-opacity-80">Healthy Stock</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold mb-1">
                            {Object.keys(categoryGroups).length}
                        </div>
                        <div className="text-sm text-white text-opacity-80">Active Categories</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold mb-1">
                            $<CountUp end={Math.round(totalValue / products.length)} duration={2} separator="," />
                        </div>
                        <div className="text-sm text-white text-opacity-80">Avg Product Value</div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Dashboard;