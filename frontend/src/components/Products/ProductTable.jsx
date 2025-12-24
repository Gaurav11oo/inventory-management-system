import React, { useState } from 'react';
import { Edit2, Trash2, Package, TrendingUp, TrendingDown, Search, Filter, AlertCircle } from 'lucide-react';

// Helper function
const isLowStock = (product) => product.currentStock <= product.minStock;

const ProductTable = ({ products, onEdit, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [setHoveredRow] = useState(null);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStockPercentage = (product) => {
        return ((product.currentStock / product.minStock) * 100).toFixed(0);
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-inventory-gradient px-6 py-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                            <Package className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Manage Inventory</h2>
                            <p className="text-white/80 text-sm">
                                {filteredProducts.length} items total
                            </p>
                        </div>
                    </div>

                    <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2">
                        <Filter className="w-4 h-4" />
                        <span className="text-sm font-medium">Filters</span>
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products or categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white/95 backdrop-blur-sm rounded-xl border-0 focus:ring-2 focus:ring-white/50 transition-all duration-300 text-gray-700 placeholder-gray-400"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                Product ID
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                Product Name
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                Category
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                Unit
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                Price
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                Stock Level
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredProducts.map((product, index) => (
                            <tr
                                key={product._id}
                                onMouseEnter={() => setHoveredRow(product._id)}
                                onMouseLeave={() => setHoveredRow(null)}
                                className="group hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-300"
                                style={{
                                    animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`
                                }}
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                        {product.productId}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            <Package className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900">{product.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 border border-indigo-200">
                                        {product.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm text-gray-600">{product.unit}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm font-bold text-gray-900">${product.price}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-semibold text-gray-700">
                                                {product.currentStock} / {product.minStock}
                                            </span>
                                            <span className={`font-bold ${isLowStock(product) ? 'text-red-600' : 'text-emerald-600'}`}>
                                                {getStockPercentage(product)}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${isLowStock(product)
                                                    ? 'bg-gradient-to-r from-red-500 to-orange-500'
                                                    : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                                                    }`}
                                                style={{ width: `${Math.min(getStockPercentage(product), 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {isLowStock(product) ? (
                                        <div className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full bg-red-100 border border-red-200">
                                            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                                            <TrendingDown className="w-3.5 h-3.5 text-red-600" />
                                            <span className="text-xs font-bold text-red-700">Low Stock</span>
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full bg-emerald-100 border border-emerald-200">
                                            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                                            <span className="text-xs font-bold text-emerald-700">In Stock</span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => onEdit(product)}
                                            className="p-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg group/edit"
                                            title="Edit Product"
                                        >
                                            <Edit2 className="w-4 h-4 group-hover/edit:rotate-12 transition-transform" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(product._id)}
                                            className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg group/delete"
                                            title="Delete Product"
                                        >
                                            <Trash2 className="w-4 h-4 group-hover/delete:rotate-12 transition-transform" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No products found</p>
                    <p className="text-gray-400 text-sm mt-1">Try adjusting your search</p>
                </div>
            )}

            <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </div>
    );
};
export default ProductTable;