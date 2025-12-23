import React, { useState, useEffect } from 'react';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import StockForm from './StockForm';
import { getProducts, updateStock } from '../../services/productService';

const StockManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [operation, setOperation] = useState('in');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStockUpdate = async (productId, quantity, notes) => {
        try {
            await updateStock(productId, operation, parseInt(quantity));
            await fetchProducts();
            alert(`Stock ${operation === 'in' ? 'added' : 'removed'} successfully!`);
        } catch (error) {
            console.error('Error updating stock:', error);
            alert(error.response?.data?.message || 'Failed to update stock');
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Stock Management</h2>

            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center space-x-4 mb-6">
                    <button
                        onClick={() => setOperation('in')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${operation === 'in'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        <ArrowUpCircle className="w-5 h-5" />
                        <span>Stock In</span>
                    </button>
                    <button
                        onClick={() => setOperation('out')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${operation === 'out'
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        <ArrowDownCircle className="w-5 h-5" />
                        <span>Stock Out</span>
                    </button>
                </div>

                <StockForm
                    products={products}
                    operation={operation}
                    onSubmit={handleStockUpdate}
                />
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">Current Stock Levels</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {products.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {product.currentStock} {product.unit}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {product.minStock} {product.unit}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${product.currentStock <= product.minStock
                                                ? 'bg-red-100 text-red-800'
                                                : product.currentStock <= product.minStock * 1.5
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-green-100 text-green-800'
                                            }`}>
                                            {product.currentStock <= product.minStock ? 'Critical' :
                                                product.currentStock <= product.minStock * 1.5 ? 'Low' : 'Good'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StockManagement;