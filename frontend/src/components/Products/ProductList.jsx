import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion'; // ✅ FIX 1
import ProductTable from './ProductTable';
import ProductForm from './ProductForm';
import Modal from '../Common/Modal';
import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../../services/productService';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // ✅ Define before useEffect (best practice)
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

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleCreate = async (productData) => {
        try {
            await createProduct(productData);
            await fetchProducts();
            setShowForm(false);
        } catch (error) {
            console.error('Error creating product:', error);
            alert('Failed to create product');
        }
    };

    const handleUpdate = async (productData) => {
        try {
            if (!editingProduct?._id) return;

            await updateProduct(editingProduct._id, productData);
            await fetchProducts();
            setShowForm(false);
            setEditingProduct(null);
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Failed to update product');
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!id) return;

        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id);
                await fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Failed to delete product');
            }
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingProduct(null);
    };

    // ✅ Fixed loading UI
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    Product Management
                </h2>

                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center space-x-2 bg-[#0060c1] text-white px-4 py-2 rounded-lg hover:bg-[#0b64fe] transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Product</span>
                </button>
            </div>

            <ProductTable
                products={products}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <Modal
                isOpen={showForm}
                onClose={handleCloseForm}
                title={editingProduct ? 'Edit Product' : 'Add New Product'}
            >
                <ProductForm
                    product={editingProduct}
                    onSubmit={editingProduct ? handleUpdate : handleCreate}
                    onCancel={handleCloseForm}
                />
            </Modal>
        </div>
    );
};

export default ProductList;
