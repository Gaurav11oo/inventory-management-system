import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, Package, TrendingDown, X } from 'lucide-react';

const LowStockAlert = ({ products }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [dismissedProducts, setDismissedProducts] = useState([]);

  // Filter out dismissed products
  const visibleProducts = products.filter(
    product => !dismissedProducts.includes(product._id)
  );

  // Calculate severity levels
  const criticalProducts = visibleProducts.filter(
    p => p.currentStock === 0 || p.currentStock < p.minStock * 0.5
  );
  const warningProducts = visibleProducts.filter(
    p => p.currentStock > 0 && p.currentStock >= p.minStock * 0.5 && p.currentStock <= p.minStock
  );

  const handleDismiss = (productId) => {
    setDismissedProducts([...dismissedProducts, productId]);
  };

  const getSeverityColor = (product) => {
    if (product.currentStock === 0) {
      return 'bg-red-900 text-white';
    }
    if (product.currentStock < product.minStock * 0.5) {
      return 'bg-red-100 text-red-800 border-red-300';
    }
    return 'bg-yellow-100 text-yellow-800 border-yellow-300';
  };

  const getSeverityBadge = (product) => {
    if (product.currentStock === 0) {
      return { text: 'OUT OF STOCK', color: 'bg-red-600 text-white' };
    }
    if (product.currentStock < product.minStock * 0.5) {
      return { text: 'CRITICAL', color: 'bg-red-500 text-white' };
    }
    return { text: 'LOW STOCK', color: 'bg-yellow-500 text-white' };
  };

  const getStockPercentage = (product) => {
    return Math.round((product.currentStock / product.minStock) * 100);
  };

  if (visibleProducts.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div 
        className="bg-red-600 text-white p-4 cursor-pointer hover:bg-red-700 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Low Stock Alert</h3>
              <p className="text-red-100 text-sm">
                {criticalProducts.length} Critical • {warningProducts.length} Warning • {visibleProducts.length} Total
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-semibold">
              {visibleProducts.length} Item{visibleProducts.length !== 1 ? 's' : ''}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4">
          {/* Statistics Bar */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-white rounded-lg p-3 border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 font-medium">Out of Stock</p>
                  <p className="text-2xl font-bold text-red-600">
                    {visibleProducts.filter(p => p.currentStock === 0).length}
                  </p>
                </div>
                <Package className="w-8 h-8 text-red-600 opacity-50" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 font-medium">Critical</p>
                  <p className="text-2xl font-bold text-red-500">
                    {criticalProducts.filter(p => p.currentStock > 0).length}
                  </p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-500 opacity-50" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 font-medium">Warning</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {warningProducts.length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-600 opacity-50" />
              </div>
            </div>
          </div>

          {/* Products List */}
          <div className="space-y-2">
            {visibleProducts.map((product) => {
              const badge = getSeverityBadge(product);
              const percentage = getStockPercentage(product);
              
              return (
                <div 
                  key={product._id} 
                  className={`bg-white rounded-lg p-4 border-2 transition-all hover:shadow-md ${getSeverityColor(product)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{product.name}</h4>
                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${badge.color}`}>
                          {badge.text}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        {/* Stock Info */}
                        <div className="flex items-center space-x-4 text-sm">
                          <div>
                            <span className="text-gray-600">Current: </span>
                            <span className="font-bold text-gray-900">
                              {product.currentStock} {product.unit}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Minimum: </span>
                            <span className="font-semibold text-gray-700">
                              {product.minStock} {product.unit}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Shortage: </span>
                            <span className="font-bold text-red-600">
                              {Math.max(0, product.minStock - product.currentStock)} {product.unit}
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all ${
                              product.currentStock === 0 
                                ? 'bg-red-900'
                                : percentage < 50 
                                ? 'bg-red-500' 
                                : 'bg-yellow-500'
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                        
                        {/* Additional Info */}
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">
                            Category: <span className="font-medium text-gray-700">{product.category}</span>
                          </span>
                          <span className="text-gray-500">
                            Stock Level: <span className={`font-bold ${
                              product.currentStock === 0 
                                ? 'text-red-900'
                                : percentage < 50 
                                ? 'text-red-600' 
                                : 'text-yellow-600'
                            }`}>
                              {percentage}%
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Dismiss Button */}
                    <button
                      onClick={() => handleDismiss(product._id)}
                      className="ml-4 text-gray-400 hover:text-red-600 transition-colors"
                      title="Dismiss alert"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Footer */}
          <div className="mt-4 pt-4 border-t border-red-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-red-600">Action Required:</span> Review and restock low inventory items
              </p>
              {dismissedProducts.length > 0 && (
                <button
                  onClick={() => setDismissedProducts([])}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Show Dismissed ({dismissedProducts.length})
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LowStockAlert;