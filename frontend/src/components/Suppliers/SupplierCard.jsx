import React from 'react';
import { Users, Phone, Mail, MapPin, Edit2, Trash2 } from 'lucide-react';

const SupplierCard = ({ supplier, onEdit, onDelete }) => {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">{supplier.name}</h3>
                        <p className="text-sm text-gray-600">{supplier.supplierId}</p>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => onEdit(supplier)}
                        className="text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(supplier._id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {supplier.phone}
                </div>
                {supplier.email && (
                    <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {supplier.email}
                    </div>
                )}
                {supplier.address && (
                    <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {supplier.address}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupplierCard;