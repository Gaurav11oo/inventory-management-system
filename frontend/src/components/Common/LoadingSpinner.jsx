import React from 'react';

const LoadingSpinner = () => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
        </div>
    );
};

export default LoadingSpinner;