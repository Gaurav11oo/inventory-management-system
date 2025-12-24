import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';  // ADD THIS
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import ProductList from './components/Products/ProductList';
import SupplierList from './components/Suppliers/SupplierList';
import StockManagement from './components/Stock/StockManagement';
import Reports from './components/Reports/Reports';
import Header from './components/Layout/Header';
import Navigation from './components/Layout/Navigation';
import LoadingSpinner from './components/Common/LoadingSpinner';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <LoadingSpinner />;
    return user ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <ThemeProvider>  {/* WRAP EVERYTHING */}
            <AppContent />
        </ThemeProvider>
    );
}

function AppContent() {
    const { user, loading } = useAuth();
    if (loading) return <LoadingSpinner />;

    return (
        <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-300">
                {user && <Header />}
                <Routes>
                    <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
                    <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />

                    <Route path="/" element={
                        <PrivateRoute>
                            <div className="max-w-7xl mx-auto px-4 py-6">
                                <Navigation />
                                <Dashboard />
                            </div>
                        </PrivateRoute>
                    } />

                    <Route path="/products" element={
                        <PrivateRoute>
                            <div className="max-w-7xl mx-auto px-4 py-6">
                                <Navigation />
                                <ProductList />
                            </div>
                        </PrivateRoute>
                    } />

                    <Route path="/suppliers" element={
                        <PrivateRoute>
                            <div className="max-w-7xl mx-auto px-4 py-6">
                                <Navigation />
                                <SupplierList />
                            </div>
                        </PrivateRoute>
                    } />

                    <Route path="/stock" element={
                        <PrivateRoute>
                            <div className="max-w-7xl mx-auto px-4 py-6">
                                <Navigation />
                                <StockManagement />
                            </div>
                        </PrivateRoute>
                    } />

                    <Route path="/reports" element={
                        <PrivateRoute>
                            <div className="max-w-7xl mx-auto px-4 py-6">
                                <Navigation />
                                <Reports />
                            </div>
                        </PrivateRoute>
                    } />
                </Routes>
            </div>
        </Router>
    );
}

export default App;