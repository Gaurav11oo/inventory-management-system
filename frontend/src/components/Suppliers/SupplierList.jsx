import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion'; // ✅ FIX 1
import SupplierCard from './SupplierCard';
import SupplierForm from './SupplierForm';
import Modal from '../Common/Modal';
import {
    getSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
} from '../../services/supplierService';

const SupplierList = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);

    // ✅ Define before useEffect
    const fetchSuppliers = async () => {
        try {
            const data = await getSuppliers();
            setSuppliers(data);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const handleCreate = async (supplierData) => {
        try {
            await createSupplier(supplierData);
            await fetchSuppliers();
            setShowForm(false);
        } catch (error) {
            console.error('Error creating supplier:', error);
            alert('Failed to create supplier');
        }
    };

    const handleUpdate = async (supplierData) => {
        try {
            if (!editingSupplier?._id) return; // ✅ safety check

            await updateSupplier(editingSupplier._id, supplierData);
            await fetchSuppliers();
            setShowForm(false);
            setEditingSupplier(null);
        } catch (error) {
            console.error('Error updating supplier:', error);
            alert('Failed to update supplier');
        }
    };

    const handleEdit = (supplier) => {
        setEditingSupplier(supplier);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!id) return;

        if (window.confirm('Are you sure you want to delete this supplier?')) {
            try {
                await deleteSupplier(id);
                await fetchSuppliers();
            } catch (error) {
                console.error('Error deleting supplier:', error);
                alert('Failed to delete supplier');
            }
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingSupplier(null);
    };

    // ✅ Fixed loading state
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
                    Supplier Management
                </h2>

                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Supplier</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {suppliers.map((supplier) => (
                    <SupplierCard
                        key={supplier._id}
                        supplier={supplier}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            <Modal
                isOpen={showForm}
                onClose={handleCloseForm}
                title={editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
            >
                <SupplierForm
                    supplier={editingSupplier}
                    onSubmit={editingSupplier ? handleUpdate : handleCreate}
                    onCancel={handleCloseForm}
                />
            </Modal>
        </div>
    );
};

export default SupplierList;
