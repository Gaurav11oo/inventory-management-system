import React, { useState } from 'react';

const StockForm = ({ products, operation, onSubmit }) => {
    const [formData, setFormData] = useState({
        productId: '',
        quantity: '',
        notes: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.productId || !formData.quantity) {
            alert('Please select a product and enter quantity');
            return;
        }
        onSubmit(formData.productId, formData.quantity, formData.notes);
        setFormData({ productId: '', quantity: '', notes: '' });
    };

    const selectedProduct = products.find(p => p._id === formData.productId);

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Product *
                    </label>
                    <select
                        name="productId"
                        value={formData.productId}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                    >
                        <option value="">Choose a product</option>
                        {products.map((product) => (
                            <option key={product._id} value={product._id}>
                                {product.name} - {product.productId} (Stock: {product.currentStock} {product.unit})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity *
                    </label>
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter quantity"
                        required
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notes (Optional)
                    </label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Add any notes..."
                    />
                </div>
            </div>

            {selectedProduct && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Product Information</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                            <span className="text-blue-700">Current Stock:</span>
                            <span className="ml-2 font-semibold text-blue-900">
                                {selectedProduct.currentStock} {selectedProduct.unit}
                            </span>
                        </div>
                        <div>
                            <span className="text-blue-700">Min Stock:</span>
                            <span className="ml-2 font-semibold text-blue-900">
                                {selectedProduct.minStock} {selectedProduct.unit}
                            </span>
                        </div>
                        {formData.quantity && (
                            <div className="col-span-2">
                                <span className="text-blue-700">New Stock:</span>
                                <span className="ml-2 font-semibold text-blue-900">
                                    {operation === 'in'
                                        ? selectedProduct.currentStock + parseInt(formData.quantity)
                                        : selectedProduct.currentStock - parseInt(formData.quantity)
                                    } {selectedProduct.unit}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <button
                type="submit"
                className={`w-full py-2 rounded-lg text-white transition-colors ${operation === 'in'
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
            >
                {operation === 'in' ? 'Add Stock' : 'Remove Stock'}
            </button>
        </form>
    );
};

export default StockForm;