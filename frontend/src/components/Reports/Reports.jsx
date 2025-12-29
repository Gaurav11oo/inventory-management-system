import React, { useState, useEffect } from 'react';
import { BarChart3, Package, TrendingUp, AlertCircle, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { getProducts } from '../../services/productService';
import { calculateTotalValue, groupByCategory } from '../../utils/helpers';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Reports = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);

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

    const totalValue = calculateTotalValue(products);
    const categoryGroups = groupByCategory(products);
    const lowStockProducts = products.filter(p => p.currentStock <= p.minStock);
    const totalProducts = products.length;
    const totalStockItems = products.reduce((sum, p) => sum + p.currentStock, 0);

    // ============================================
    // EXCEL EXPORT FUNCTIONS
    // ============================================

    const exportToExcel = () => {
        setExporting(true);
        try {
            // Create a new workbook
            const wb = XLSX.utils.book_new();

            // Sheet 1: Summary
            const summaryData = [
                ['Inventory Management System - Summary Report'],
                ['Generated on:', new Date().toLocaleString()],
                [],
                ['Metric', 'Value'],
                ['Total Products', totalProducts],
                ['Total Stock Items', totalStockItems],
                ['Total Stock Value', `$${totalValue.toLocaleString()}`],
                ['Low Stock Items', lowStockProducts.length],
            ];
            const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
            XLSX.utils.book_append_sheet(wb, ws1, 'Summary');

            // Sheet 2: All Products
            const productsData = [
                ['Product ID', 'Name', 'Category', 'Unit', 'Price', 'Min Stock', 'Current Stock', 'Stock Value', 'Status']
            ];
            products.forEach(product => {
                productsData.push([
                    product.productId,
                    product.name,
                    product.category,
                    product.unit,
                    product.price,
                    product.minStock,
                    product.currentStock,
                    product.currentStock * product.price,
                    product.currentStock <= product.minStock ? 'Low Stock' : 'In Stock'
                ]);
            });
            const ws2 = XLSX.utils.aoa_to_sheet(productsData);
            XLSX.utils.book_append_sheet(wb, ws2, 'All Products');

            // Sheet 3: Low Stock Report
            if (lowStockProducts.length > 0) {
                const lowStockData = [
                    ['Low Stock Report'],
                    ['Product ID', 'Name', 'Category', 'Current Stock', 'Min Stock', 'Shortage', 'Unit']
                ];
                lowStockProducts.forEach(product => {
                    lowStockData.push([
                        product.productId,
                        product.name,
                        product.category,
                        product.currentStock,
                        product.minStock,
                        product.minStock - product.currentStock,
                        product.unit
                    ]);
                });
                const ws3 = XLSX.utils.aoa_to_sheet(lowStockData);
                XLSX.utils.book_append_sheet(wb, ws3, 'Low Stock');
            }

            // Sheet 4: Category Analysis
            const categoryData = [
                ['Category Analysis'],
                ['Category', 'Products', 'Total Items', 'Total Value', 'Average Price']
            ];
            Object.entries(categoryGroups).forEach(([category, items]) => {
                const categoryValue = items.reduce((sum, item) => sum + (item.currentStock * item.price), 0);
                const categoryStock = items.reduce((sum, item) => sum + item.currentStock, 0);
                categoryData.push([
                    category,
                    items.length,
                    categoryStock,
                    categoryValue,
                    (categoryValue / categoryStock).toFixed(2)
                ]);
            });
            const ws4 = XLSX.utils.aoa_to_sheet(categoryData);
            XLSX.utils.book_append_sheet(wb, ws4, 'Category Analysis');

            // Generate Excel file
            const fileName = `Inventory_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
            XLSX.writeFile(wb, fileName);

            alert('Excel report downloaded successfully!');
        } catch (error) {
            console.error('Error exporting to Excel:', error);
            alert('Failed to export Excel report');
        } finally {
            setExporting(false);
        }
    };

    // ============================================
    // PDF EXPORT FUNCTIONS
    // ============================================

    const exportToPDF = () => {
        setExporting(true);
        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            let yPos = 20;

            // Title
            doc.setFontSize(20);
            doc.setFont(undefined, 'bold');
            doc.text('Inventory Management System', pageWidth / 2, yPos, { align: 'center' });

            yPos += 10;
            doc.setFontSize(16);
            doc.text('Comprehensive Inventory Report', pageWidth / 2, yPos, { align: 'center' });

            yPos += 10;
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, yPos, { align: 'center' });

            yPos += 15;

            // Summary Section
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text('Summary Statistics', 14, yPos);
            yPos += 10;

            const summaryData = [
                ['Metric', 'Value'],
                ['Total Products', totalProducts.toString()],
                ['Total Stock Items', totalStockItems.toString()],
                ['Total Stock Value', `$${totalValue.toLocaleString()}`],
                ['Low Stock Items', lowStockProducts.length.toString()],
            ];

            doc.autoTable({
                startY: yPos,
                head: [summaryData[0]],
                body: summaryData.slice(1),
                theme: 'striped',
                headStyles: { fillColor: [79, 70, 229] },
                margin: { left: 14, right: 14 },
            });

            yPos = doc.lastAutoTable.finalY + 15;

            // All Products Section
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text('All Products', 14, yPos);
            yPos += 10;

            const productsTableData = products.map(product => [
                product.productId,
                product.name,
                product.category,
                `${product.currentStock} ${product.unit}`,
                `$${product.price}`,
                product.currentStock <= product.minStock ? 'Low' : 'OK'
            ]);

            doc.autoTable({
                startY: yPos,
                head: [['ID', 'Name', 'Category', 'Stock', 'Price', 'Status']],
                body: productsTableData,
                theme: 'striped',
                headStyles: { fillColor: [79, 70, 229] },
                margin: { left: 14, right: 14 },
                styles: { fontSize: 8 },
            });

            // Low Stock Section (if any)
            if (lowStockProducts.length > 0) {
                doc.addPage();
                yPos = 20;

                doc.setFontSize(14);
                doc.setFont(undefined, 'bold');
                doc.text('Low Stock Alert', 14, yPos);
                yPos += 10;

                const lowStockTableData = lowStockProducts.map(product => [
                    product.productId,
                    product.name,
                    product.category,
                    `${product.currentStock} ${product.unit}`,
                    `${product.minStock} ${product.unit}`,
                    `${product.minStock - product.currentStock} ${product.unit}`
                ]);

                doc.autoTable({
                    startY: yPos,
                    head: [['ID', 'Name', 'Category', 'Current', 'Minimum', 'Shortage']],
                    body: lowStockTableData,
                    theme: 'striped',
                    headStyles: { fillColor: [239, 68, 68] },
                    margin: { left: 14, right: 14 },
                    styles: { fontSize: 8 },
                });
            }

            // Category Analysis Section
            doc.addPage();
            yPos = 20;

            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text('Category Analysis', 14, yPos);
            yPos += 10;

            const categoryTableData = Object.entries(categoryGroups).map(([category, items]) => {
                const categoryValue = items.reduce((sum, item) => sum + (item.currentStock * item.price), 0);
                const categoryStock = items.reduce((sum, item) => sum + item.currentStock, 0);
                return [
                    category,
                    items.length.toString(),
                    categoryStock.toString(),
                    `$${categoryValue.toLocaleString()}`,
                    `$${(categoryValue / categoryStock).toFixed(2)}`
                ];
            });

            doc.autoTable({
                startY: yPos,
                head: [['Category', 'Products', 'Total Items', 'Total Value', 'Avg Price']],
                body: categoryTableData,
                theme: 'striped',
                headStyles: { fillColor: [79, 70, 229] },
                margin: { left: 14, right: 14 },
            });

            // Footer on all pages
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setFont(undefined, 'normal');
                doc.text(
                    `Page ${i} of ${pageCount}`,
                    pageWidth / 2,
                    doc.internal.pageSize.getHeight() - 10,
                    { align: 'center' }
                );
            }

            // Save PDF
            const fileName = `Inventory_Report_${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(fileName);

            alert('PDF report downloaded successfully!');
        } catch (error) {
            console.error('Error exporting to PDF:', error);
            alert('Failed to export PDF report');
        } finally {
            setExporting(false);
        }
    };

    // ============================================
    // RENDER
    // ============================================

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header with Export Buttons */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Inventory Reports</h2>

                <div className="flex items-center space-x-3">
                    <button
                        onClick={exportToExcel}
                        disabled={exporting}
                        className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FileSpreadsheet className="w-5 h-5" />
                        <span>{exporting ? 'Exporting...' : 'Export Excel'}</span>
                    </button>

                    <button
                        onClick={exportToPDF}
                        disabled={exporting}
                        className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FileText className="w-5 h-5" />
                        <span>{exporting ? 'Exporting...' : 'Export PDF'}</span>
                    </button>

                    <button
                        onClick={() => {
                            const dropdown = document.createElement('div');
                            dropdown.className = 'absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-10';
                            dropdown.innerHTML = `
                <button onclick="exportToExcel()" class="w-full text-left px-4 py-2 hover:bg-gray-100">Excel (.xlsx)</button>
                <button onclick="exportToPDF()" class="w-full text-left px-4 py-2 hover:bg-gray-100">PDF (.pdf)</button>
              `;
                        }}
                        className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <Download className="w-5 h-5" />
                        <span>Download Report</span>
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Products</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">{totalProducts}</p>
                        </div>
                        <Package className="w-10 h-10 text-indigo-600" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Stock Items</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">{totalStockItems}</p>
                        </div>
                        <BarChart3 className="w-10 h-10 text-blue-600" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Value</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">${totalValue.toLocaleString()}</p>
                        </div>
                        <TrendingUp className="w-10 h-10 text-green-600" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Low Stock Items</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">{lowStockProducts.length}</p>
                        </div>
                        <AlertCircle className="w-10 h-10 text-red-600" />
                    </div>
                </div>
            </div>

            {/* Export Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                    <Download className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-blue-900">Export Reports</h4>
                        <p className="text-sm text-blue-700 mt-1">
                            Download comprehensive inventory reports in Excel or PDF format. Reports include summary statistics,
                            all products, low stock alerts, and category analysis.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stock by Category */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Stock by Category</h3>
                <div className="space-y-4">
                    {Object.entries(categoryGroups).map(([category, items]) => {
                        const categoryValue = items.reduce((sum, item) => sum + (item.currentStock * item.price), 0);
                        const categoryStock = items.reduce((sum, item) => sum + item.currentStock, 0);

                        return (
                            <div key={category} className="border-b pb-4 last:border-b-0">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium text-gray-800">{category}</h4>
                                    <span className="text-sm text-gray-600">{items.length} products</span>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-600">Total Items</p>
                                        <p className="font-semibold text-gray-800">{categoryStock}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Total Value</p>
                                        <p className="font-semibold text-gray-800">${categoryValue.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Avg Price</p>
                                        <p className="font-semibold text-gray-800">
                                            ${(categoryValue / categoryStock).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Low Stock Report */}
            {lowStockProducts.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Low Stock Report</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Current</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Minimum</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Shortage</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {lowStockProducts.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{product.name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{product.category}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {product.currentStock} {product.unit}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {product.minStock} {product.unit}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-red-600 font-semibold">
                                            {product.minStock - product.currentStock} {product.unit}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Top Products by Value */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Products by Stock Value</h3>
                <div className="space-y-3">
                    {products
                        .sort((a, b) => (b.currentStock * b.price) - (a.currentStock * a.price))
                        .slice(0, 10)
                        .map((product, index) => {
                            const value = product.currentStock * product.price;
                            return (
                                <div key={product._id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                                        <div>
                                            <p className="font-medium text-gray-800">{product.name}</p>
                                            <p className="text-sm text-gray-600">
                                                {product.currentStock} {product.unit} × ${product.price}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-800">${value.toLocaleString()}</p>
                                        <p className="text-sm text-gray-600">{product.category}</p>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
};

export default Reports;
