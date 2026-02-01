import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import SecureVault from './components/SecureVault';
import AuditLog from './components/auditlog';

// Configure axios defaults
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Get CSRF token from meta tag
const token = document.head.querySelector('meta[name="csrf-token"]');
if (token) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('CSRF token not found');
}

const App = () => {
    const [currentPage, setCurrentPage] = useState('vault');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await axios.get('/api/user');
            setUser(response.data);
        } catch (err) {
            console.error('Error fetching user:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post('/logout');
            window.location.href = '/login';
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-white mb-4"></div>
                    <p className="text-white text-xl">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <nav className="bg-black/30 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h1 className="text-2xl font-bold text-white">SecureVault Pro</h1>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage('vault')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                        currentPage === 'vault'
                                            ? 'bg-purple-600 text-white shadow-lg'
                                            : 'text-gray-300 hover:bg-white/10'
                                    }`}
                                >
                                    Vault
                                </button>
                                <button
                                    onClick={() => setCurrentPage('audit')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                        currentPage === 'audit'
                                            ? 'bg-purple-600 text-white shadow-lg'
                                            : 'text-gray-300 hover:bg-white/10'
                                    }`}
                                >
                                    Audit Logs
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {user && (
                                <div className="text-right">
                                    <p className="text-white font-medium">{user.name}</p>
                                    <p className="text-gray-400 text-sm">{user.email}</p>
                                </div>
                            )}
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main>
                {currentPage === 'vault' ? <SecureVault /> : <AuditLog />}
            </main>

            <footer className="bg-black/30 backdrop-blur-md border-t border-white/10 py-6 mt-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white font-semibold">SecureVault Pro</p>
                            <p className="text-gray-400 text-sm">Enterprise-grade security for your credentials</p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-400 text-sm">Built with React + Vite & Laravel</p>
                            <p className="text-gray-400 text-sm">AES-256 Encryption</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

if (document.getElementById('app')) {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
}
