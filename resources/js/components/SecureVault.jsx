import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SecureVault = () => {
    const [vaultItems, setVaultItems] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState({});
    const [formData, setFormData] = useState({
        title: '',
        username: '',
        password: '',
        url: '',
        notes: ''
    });

    useEffect(() => {
        fetchVaultItems();
    }, []);

    const fetchVaultItems = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('/vault');
            setVaultItems(response.data);
        } catch (err) {
            console.error('Error fetching vault items:', err);
            setError('Failed to load vault items. Please refresh the page.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const resetForm = () => {
        setFormData({
            title: '',
            username: '',
            password: '',
            url: '',
            notes: ''
        });
        setEditingId(null);
        setShowForm(false);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            if (editingId) {
                const response = await axios.put(`/vault/${editingId}`, formData);
                setVaultItems(prev => prev.map(item =>
                    item.id === editingId ? response.data : item
                ));
                setSuccess('Vault item updated successfully!');
            } else {
                const response = await axios.post('/vault', formData);
                setVaultItems(prev => [response.data, ...prev]);
                setSuccess('Vault item created successfully!');
            }
            resetForm();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error saving vault item:', err);
            setError(err.response?.data?.message || 'Failed to save vault item. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        setFormData({
            title: item.title,
            username: item.username || '',
            password: item.password || '',
            url: item.url || '',
            notes: item.notes || ''
        });
        setEditingId(item.id);
        setShowForm(true);
        setError('');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this vault item?')) {
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await axios.delete(`/vault/${id}`);
            setVaultItems(prev => prev.filter(item => item.id !== id));
            setSuccess('Vault item deleted successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error deleting vault item:', err);
            setError('Failed to delete vault item. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = (id) => {
        setShowPassword(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const generatePassword = () => {
        const length = 16;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
        let password = "";
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        setFormData(prev => ({ ...prev, password }));
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setSuccess('Copied to clipboard!');
        setTimeout(() => setSuccess(''), 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Secure Vault</h1>
                    <p className="text-gray-300">Advanced encryption for your sensitive data</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 bg-green-500/20 border border-green-500 text-green-200 px-4 py-3 rounded-lg">
                        {success}
                    </div>
                )}

                <div className="mb-6">
                    <button
                        onClick={() => {
                            setShowForm(!showForm);
                            if (showForm) resetForm();
                        }}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        {showForm ? 'Cancel' : '+ Add New Item'}
                    </button>
                </div>

                {showForm && (
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8 border border-white/20 shadow-2xl">
                        <h2 className="text-2xl font-bold text-white mb-6">
                            {editingId ? 'Edit Vault Item' : 'Add New Vault Item'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-200 mb-2 font-medium">Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="e.g., Gmail Account"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-200 mb-2 font-medium">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="username@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-200 mb-2 font-medium">Password</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="Enter password"
                                    />
                                    <button
                                        type="button"
                                        onClick={generatePassword}
                                        className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                                    >
                                        Generate
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-200 mb-2 font-medium">URL</label>
                                <input
                                    type="url"
                                    name="url"
                                    value={formData.url}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="https://example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-200 mb-2 font-medium">Notes</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Additional notes..."
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Saving...' : editingId ? 'Update Item' : 'Save Item'}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {loading && vaultItems.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                            <p className="text-gray-300 mt-4">Loading vault items...</p>
                        </div>
                    ) : vaultItems.length === 0 ? (
                        <div className="col-span-full text-center py-12 bg-white/5 rounded-xl border border-white/10">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <p className="text-gray-300 mt-4 text-lg">Your vault is empty</p>
                            <p className="text-gray-400 mt-2">Click "Add New Item" to store your first credential</p>
                        </div>
                    ) : (
                        vaultItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-200 hover:border-purple-500/50"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {item.username && (
                                        <div>
                                            <p className="text-gray-400 text-sm mb-1">Username</p>
                                            <div className="flex items-center gap-2">
                                                <p className="text-white font-mono text-sm flex-1 bg-white/5 px-3 py-2 rounded">{item.username}</p>
                                                <button
                                                    onClick={() => copyToClipboard(item.username)}
                                                    className="p-2 hover:bg-white/10 rounded transition-colors"
                                                    title="Copy"
                                                >
                                                    <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {item.password && (
                                        <div>
                                            <p className="text-gray-400 text-sm mb-1">Password</p>
                                            <div className="flex items-center gap-2">
                                                <p className="text-white font-mono text-sm flex-1 bg-white/5 px-3 py-2 rounded">
                                                    {showPassword[item.id] ? item.password : '••••••••'}
                                                </p>
                                                <button
                                                    onClick={() => togglePasswordVisibility(item.id)}
                                                    className="p-2 hover:bg-white/10 rounded transition-colors"
                                                    title={showPassword[item.id] ? "Hide" : "Show"}
                                                >
                                                    <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        {showPassword[item.id] ? (
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                        ) : (
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        )}
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => copyToClipboard(item.password)}
                                                    className="p-2 hover:bg-white/10 rounded transition-colors"
                                                    title="Copy"
                                                >
                                                    <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {item.url && (
                                        <div>
                                            <p className="text-gray-400 text-sm mb-1">URL</p>
                                            <a
                                                href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-400 hover:text-blue-300 text-sm underline break-all"
                                            >
                                                {item.url}
                                            </a>
                                        </div>
                                    )}

                                    {item.notes && (
                                        <div>
                                            <p className="text-gray-400 text-sm mb-1">Notes</p>
                                            <p className="text-gray-300 text-sm bg-white/5 px-3 py-2 rounded">{item.notes}</p>
                                        </div>
                                    )}

                                    <div className="pt-2 border-t border-white/10">
                                        <p className="text-gray-500 text-xs">
                                            Created: {new Date(item.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default SecureVault;
